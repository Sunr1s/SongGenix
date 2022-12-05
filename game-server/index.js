import express from "express";
import http from "http";
import {WebSocketServer} from "ws";
import mongoose from "mongoose";
import Lobby from "./models/Lobby.js";

mongoose.connect("mongodb://localhost:27017/SongGenix", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (error) => {
    console.log("CONNECTED");
    console.log(error);
});

const app = express();

const server = http.createServer(app);

const webSocketServer = new WebSocketServer({ server });

const TOTAL_ROUNDS = 5;
const TOTAL_SONGS_PER_ROUND = 5;
const ROUND_TIME = 15; // sec

function _getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function _getArrayOfRandomSongs(songs) {
    const randomSongIndexes = [];
    for (let i = 0; i < TOTAL_SONGS_PER_ROUND; i++) {
        let randomSongIndex = 0;
        let isRandomSongIndexAlreadyChosen = true;
        while (isRandomSongIndexAlreadyChosen) {
            randomSongIndex = _getRandomInt(0, songs.length);
            isRandomSongIndexAlreadyChosen = randomSongIndexes.includes(randomSongIndex);
        }
        randomSongIndexes.push(randomSongIndex);
    }
    const arrayRandomIndex = _getRandomInt(0, randomSongIndexes.length);
    const randomTrueAnswer = randomSongIndexes[arrayRandomIndex];
    return randomSongIndexes.map((randomIndex) => {
        const randomSong = songs[randomIndex];
        randomSong.isTrueSong = randomIndex === randomTrueAnswer;
        return randomSong;
    });
}

const _delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}

const _getConnectedUserIds = (roomId) => {
    const connectedWS = [];
    webSocketServer.clients.forEach((client) => {
        if (client.roomId === roomId) connectedWS.push(client.userId);
    });
    return connectedWS;
}

const game = async (roomId) => {
    try {
        console.log(roomId);
        const room = await Lobby.findById(roomId).lean();
        const totalRounds = room.settings.songsAmount || TOTAL_ROUNDS;
        const roundTime = room.settings.songPlayingTime || ROUND_TIME;

        const roundNumbers = [];
        for (let i = 0; i < totalRounds; i++) roundNumbers.push(i + 1);

        const [songs] = room.playlist;

        for (const i of roundNumbers) {
            const connectedWSUserIds = _getConnectedUserIds(roomId);

            await _delay(5000);
            const randomSongs = _getArrayOfRandomSongs(songs);
            const startRoundRoomData = await Lobby.findById(roomId).lean();
            const roundObject = {
                event: "startRound",
                round: i,
                songs: randomSongs,
                songPlayingTime: roundTime,
                users: startRoundRoomData.users.filter((user) => connectedWSUserIds.includes(user._id.toString()))
            };
            broadcast(roundObject, roomId);
            await _delay(roundTime * 1000);

            const updatedRoom = await Lobby.findById(roomId).lean();
            const playerResults = updatedRoom.users.map((user) => {
                const oldUserResults = startRoundRoomData.users.find((oldUser) => oldUser.name === user.name);
                const earnedPoints = user.totalPoints - oldUserResults.totalPoints;
                return { ...user, earnedPoints };
            }).sort((a, b) => a.totalPoints - b.totalPoints);
            const endRoundObject = {
                event: "endRound",
                round: i,
                songs: randomSongs,
                songPlayingTime: roundTime,
                users: playerResults.filter((user) => connectedWSUserIds.includes(user._id.toString()))
            };
            broadcast(endRoundObject, roomId);
        }
        await _delay(7500);
        const lobby = await Lobby.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(roomId) },
            { $set: { "users.$[].totalPoints": 0 } },
            { new: true },
        );
        const connectedUserIds = _getConnectedUserIds(roomId);
        const endGameObject = {
            event: 'endGame',
            admin: lobby.admin,
            settings: lobby.settings,
            users: lobby.users.filter((user) => connectedUserIds.includes(user._id.toString()))
        }
        broadcast(endGameObject, roomId);
    } catch (e) {
        console.log(e);
    }
}

const calculateUserPoint = async (roomId, userId, answerData) => {
    try {
        const { answerTime, isAnswerCorrect } = answerData;
        const point = 100 / answerTime;
        if (isAnswerCorrect) {
            const lobby = await Lobby.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(roomId), "users._id": mongoose.Types.ObjectId(userId) },
                { $inc: { "users.$[i].totalPoints": point } },
                { arrayFilters: [{ "i._id": userId }], new: true },
            );
        }
    } catch (e) {
        console.log(e);
    }
}

const setClient = async (ws, userName, roomId) => {
    try {
        const room = await Lobby.findById(roomId);
        const user = await Lobby.find({ _id: roomId, "users.name": userName });
        const connectedUserIds = _getConnectedUserIds(roomId);

        if (!user.length) await room.users.push({ name: userName });
        await room.save();
        const addedUser = room.users.find((user) => user.name === userName);

        ws.roomId = roomId;
        ws.userId = addedUser._id.toString();

        connectedUserIds.push(addedUser._id.toString());

        const roomData = {
            admin: room.admin,
            settings: room.settings,
            users: room.users.filter((user) => connectedUserIds.includes(user._id.toString()))
        }

        ws.send(JSON.stringify(roomData));
    } catch (e) {
        console.log(e);
    }
}

webSocketServer.on('connection', (ws) => {
    ws.on('message', async (message) => {
        const parsedMessage = JSON.parse(message);
        switch (parsedMessage.event) {
            case "setClient":
                await setClient(ws, parsedMessage.name, parsedMessage.roomId);
                break;
            case "answer":
                await calculateUserPoint(ws.roomId, ws.userId, parsedMessage);
                break;
            case "startGame":
                await game(ws.roomId, ws.userId);
                break;
        }
    });
});

const broadcast = (data, roomId) => {
    webSocketServer.clients.forEach((client) => {
        if (client.roomId === roomId) client.send(JSON.stringify(data));
    });
};

server.listen(4200, () => console.log("Server started"));