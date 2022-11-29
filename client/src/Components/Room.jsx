import React, { useState } from 'react'
import '../App.scss';

const Room = ({ roomData, socketData }) => {
    const [songsNumber, setSongsNumber] = useState(5);
    const [songsPlayingTime, setSongsPlayingTime] = useState(5);

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

<<<<<<< HEAD
                        <audio></audio>
=======
                        <figure>
                            <audio 
                                className='player'
                                controls = "true" autoplay = "true"
                                src="https://p.scdn.co/mp3-preview/660529eb782acfc296dc3a7810df409753b4a44c?cid=62cac1f286d94cf08b9cb1c29ab09f67.mp3" >
                                <a href="https://p.scdn.co/mp3-preview/660529eb782acfc296dc3a7810df409753b4a44c?cid=62cac1f286d94cf08b9cb1c29ab09f67.mp3">
                                    Download audio
                                </a>
                            </audio>
                        </figure>

>>>>>>> a3e9c11b2c143b706f3e3e0cabee329efd078b02
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
                                <button onClick={() => setSongsNumber(5)}>5</button>
                                <button onClick={() => setSongsNumber(10)}>10</button>
                                <button onClick={() => setSongsNumber(15)}>15</button>
                            </div>
                        </div>

                        <div className="room-options">
                            <div className="room-line"></div>
                            <p className="room-options-title">Тривалість треків</p>
                            <div className="roop-options-duration-tracks">
                                <button onClick={() => setSongsPlayingTime(5)}>5</button>
                                <button onClick={() => setSongsPlayingTime(10)}>10</button>
                                <button onClick={() => setSongsPlayingTime(15)}>15</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default Room;