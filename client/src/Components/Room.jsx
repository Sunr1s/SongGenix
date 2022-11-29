import React, { useState } from 'react'
import '../App.scss';
import PlayerLine from "./PlayerLine";

const Room = ({ roomData, socketData }) => {
    const [songsNumber, setSongsNumber] = useState(roomData.settings?.songsAmount || 5);
    const [songsPlayingTime, setSongsPlayingTime] = useState(roomData.settings?.songPlayingTime || 10);
    const [currentPlayingTime, setPlayingCurrentTime] = useState(0);

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

    return (
        <div>
            <div className='App'>
                <div className="room">

                    <div className="left-column-room column-room">
                        <p className="title-room">Учасники</p>
                        <div className="cards">
                            {
                                roomData.users.map((user, index) => {
                                    const userSocketData = socketData && socketData.users.find((su) => su.name === user.name);
                                    return (
                                        <div className='person-card'>
                                            <p className="person-card-place">{index + 1}</p>
                                            <p className="person-card-name">{user.name}</p>
                                            <p className="person-card-points">{userSocketData && userSocketData.totalPoints || 0}</p>
                                            {userSocketData && userSocketData.earnedPoints && <p className="person-card-points">(+{userSocketData.earnedPoints})</p>}
                                        </div>
                                    );
                                })
                            }
                        </div>

                    </div>

                    <div className="center-column-room">
                        <div className="center-column-room-buttons">

                            <div className='add-playlist-btn btn'><p className="">Додати свій плейлист</p></div>
                            <div className='choose-playlist-btn btn'><p className="">Обрати плейлист</p></div>

                        </div>
                        <figure>
                            <audio
                                className='player'
                                controls="true"
                                autoplay="true"
                                src="https://p.scdn.co/mp3-preview/660529eb782acfc296dc3a7810df409753b4a44c?cid=62cac1f286d94cf08b9cb1c29ab09f67.mp3"
                                onTimeUpdate={(event) => onTimeUpdate(event)}
                            >
                                <a href="https://p.scdn.co/mp3-preview/660529eb782acfc296dc3a7810df409753b4a44c?cid=62cac1f286d94cf08b9cb1c29ab09f67.mp3">
                                    Download audio
                                </a>
                            </audio>
                        </figure>
                        <PlayerLine currentTime={currentPlayingTime} songsPlayingTime={songsPlayingTime} />

                        <div className="game-cards">
                            <div className="card">
                                <p className="card-song-name">Eminem</p>
                            </div>
                            <div className="card">
                                <p className="card-song-name">Drake</p>
                            </div>
                            <div className="card">
                                <p className="card-song-name">twenty one pilots</p>
                            </div>
                            <div className="card">
                                <p className="card-song-name">blinc-182</p>
                            </div>
                        </div>
                    </div>


                    <div className="right-column-room column-room">
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
                        </div>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default Room;