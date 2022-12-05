import React, {useEffect, useMemo, useState} from 'react'
import '../App.scss';
import PlayerLine from "./PlayerLine";
import AddPlaylist from "./AddPlaylist";
import {useNavigate} from "react-router-dom";

const Room = ({ roomData, socketData, socket, userName }) => {
    const navigate = useNavigate();
    const [songsNumber, setSongsNumber] = useState(roomData.settings?.songsAmount || 5);
    const [songsPlayingTime, setSongsPlayingTime] = useState(roomData.settings?.songPlayingTime || 10);
    const [currentPlayingTime, setPlayingCurrentTime] = useState(0);
    const [isRoundAnswered, setIsRoundAnswered] = useState(false);
    const [answeredRound, setAnsweredRound] = useState(null);

    const isUserNameAdmin = roomData.admin === userName;

    const songToPlay = useMemo(() => {
        if (socketData && socketData.songs)
            return socketData.songs.find((song) => song.isTrueSong);
        return null;
    }, [socketData]);
    console.log(songToPlay);

    useEffect(() => {
        if (socketData && socketData.event === "startRound") {
            setIsRoundAnswered(false);
            setAnsweredRound(null);
        }
    }, [socketData]);

    useEffect(() => {
        if (!(socket && socket.readyState === socket.OPEN)) {
            navigate("/");
        }
    }, [socket]);


    const [show, setShow] = useState(false)

    const changeSettingData = async (settings) => {
        const response = await fetch(`http://127.0.0.1:5000/updateRoom/${roomData._id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive"
            },
            body: JSON.stringify({
                settings
            })
        });
    }

    const onChangeSongsPlayingTime = (songsPlayingTime) => {
        return async () => {
            setSongsPlayingTime(songsPlayingTime);
            await changeSettingData({
                songsAmount: songsNumber,
                songPlayingTime: songsPlayingTime
            });
        }
    }

    const onChangeSongsNumber = (songsNumber) => {
        return async () => {
            setSongsNumber(songsNumber);
            await changeSettingData({
                songsAmount: songsNumber,
                songPlayingTime: songsPlayingTime
            });
        }
    }

    const onTimeUpdate = (event) => {
        setPlayingCurrentTime(event.target.currentTime);
        if (event.target.currentTime >= songsPlayingTime) {
            event.target.pause();
            event.target.currentTime = 0
        }
    }

    const onStartGame = async () => {
        socket.send(JSON.stringify({
            "event": "startGame"
        }));
    }

    const onClickAnswer = (song, round) => {
        return async () => {
            if (socketData.round !== answeredRound) {;
                socket.send(JSON.stringify({
                    event: "answer",
                    isAnswerCorrect: song.name === songToPlay.track.name,
                    answerTime: currentPlayingTime
                }));
                setIsRoundAnswered(true);
                setAnsweredRound(round);
            }
        }
    }

    const onAddTracks = async () => {
        const response = await fetch(`http://127.0.0.1:5000/tracks/${roomData._id}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive"
            }
        });
        setShow(false);
    }

    const onLogin = async () => {
        const response = await fetch(`http://127.0.0.1:5000/loginSpotify`, {
            method: 'GET',
            mode: 'no-cors',
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive"
            }
        });

    }
    return (
        <div>
            <div className='App'>
                <div className="room">

                    <div className="left-column-room column-room">
                        <p className="title-room">Учасники</p>
                        <div className="cards">
                            {
                                socketData && socketData.users && socketData.users.map((user, index) => {
                                    return (
                                        <div className='person-card'>
                                            <p className="person-card-place">{index + 1}</p>
                                            <p className="person-card-name">{user.name}</p>
                                            <p className="person-card-points">{parseInt(user.totalPoints) || 0}</p>
                                            {!!(user.earnedPoints || user.earnedPoints === 0)
                                                ? <p className="person-card-points">(+{parseInt(user.earnedPoints)})</p>
                                                : null
                                            }
                                        </div>
                                    );
                                })
                            }
                        </div>

                    </div>

                    <div className="center-column-room">
                        <div className="center-column-room-buttons">

                            {isUserNameAdmin ?
                                (<>
                                    <div onClick={() => setShow(true)} className='add-playlist-btn'><p className="">Додати свій плейлист</p></div>
                                    <AddPlaylist onClose={onAddTracks} show = {show}/>
                                    <div className='choose-playlist-btn'><p className="">Обрати плейлист</p></div>
                                </>) : null
                            }

                        </div>
                        <figure>
                            <audio
                                className='player'
                                controls="true"
                                autoPlay="true"
                                volume={"0.5"}
                                src={songToPlay ? songToPlay.track.preview_url : ""}
                                onTimeUpdate={(event) => onTimeUpdate(event)}
                            />
                        </figure>
                        <PlayerLine currentTime={currentPlayingTime} songsPlayingTime={songsPlayingTime} />

                        <div className="game-cards">
                            {socketData && socketData.songs && socketData.songs.map((data) => {
                                let cardClassName = "card";
                                if (isRoundAnswered)
                                    cardClassName = data && songToPlay && data.track.name === songToPlay.track.name
                                        ? "card card-true" : "card card-false";
                                else cardClassName = "card";
                                return (
                                    <div
                                        className={cardClassName}
                                        onClick={onClickAnswer(data.track, socketData.round)}
                                    >
                                        <p className="card-song-name">{data.track.name}</p>
                                    </div>
                                );
                            })}
                        </div>
                        {socketData && socketData.round
                            ? <p className='central-rounds'>{socketData.round}/{songsNumber}</p>
                            : <p className='central-rounds'>---/---</p>}
                    </div>


                    {isUserNameAdmin ?
                        (<div className="right-column-room column-room">
                            <p className="title-room">Налаштування</p>
                            <div className="room-options">
                                <div className="room-line"></div>
                                <p className="room-options-title">Кількість треків</p>
                                <div className="roop-options-quantity-tracks">
                                    <button onClick={onChangeSongsNumber(5)} className={songsNumber === 5 ? 'roop-option-quantity-checked' : ''}>5</button>
                                    <button onClick={onChangeSongsNumber(10)} className={songsNumber === 10 ? 'roop-option-quantity-checked' : ''}>10</button>
                                    <button onClick={onChangeSongsNumber(15)} className={songsNumber === 15 ? 'roop-option-quantity-checked' : ''}>15</button>
                                </div>
                            </div>

                            <div className="room-options">
                                <div className="room-line"></div>
                                <p className="room-options-title">Тривалість треків</p>
                                <div className="roop-options-duration-tracks">
                                    <button onClick={onChangeSongsPlayingTime(5)} className={songsPlayingTime === 5 ? 'roop-option-duration-checked' : ''}>5</button>
                                    <button onClick={onChangeSongsPlayingTime(10)} className={songsPlayingTime === 10 ? 'roop-option-duration-checked' : ''}>10</button>
                                    <button onClick={onChangeSongsPlayingTime(15)} className={songsPlayingTime === 15 ? 'roop-option-duration-checked' : ''}>15</button>
                                </div>
                                <div className="right-btns">
                                    <button className='spotify-btn' onClick={onLogin}>SPOTIFY</button>
                                    <button className='start-btn' onClick={onStartGame}>Розпочати</button>
                                </div>
                                <p>{"ID кімнати: " + roomData._id}</p>


                            </div>
                        </div>) : null}
                </div>

            </div>
        </div>

    )
}

export default Room;