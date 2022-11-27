import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, () => {
    console.log("CONNECTED");
});

const app = express();

const server = http.createServer(app);

const webSocketServer = new WebSocketServer({ server });

webSocketServer.on('connection', (ws) => {
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        switch (parsedMessage.event) {
            case "setClientRoomId":
                ws.roomId = parsedMessage.roomId;
                break;
            case "answer":

                break;
            case "startGame":

                break;
        }
    });
});

const broadcast = (data, roomId) => {
    webSocketServer.clients.forEach((client) => {
        client.send(data);
    });
};

const setClientRoomId = {
    event: "setClientRoomId",
    roomId: "23242",
};

const newRoundMessage = {
    event: "startRound",
    songs: [],
    songPlayingTime: 15,
    roundDuration: 15,
};

const endRound = { // to clients
    event: "endRound",
    roundPlayerResults: [
        {
            name: "John",
            roundResult: 15,
            totalPoints: 45,
        },
        {
            name: "John",
            roundResult: 15,
            totalPoints: 45,
        }
    ]
};

const answer = { // to clients
    event: "answer",
    name: "John",
    isAnswerCorrect: true,
    answerTime: 5.3,
    roomId: "34534535",
};

server.listen(5000, () => console.log("Server started"));