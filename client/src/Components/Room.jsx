import React from 'react'
import '../App.scss';

const Room = () => {

    return (
        <div>
            <div className='App'>
                <div className="room">

                    <div className="left-column-room column-room">
                        <p className="title-room">Учасники</p>
                        <div className="cards">
                            <div className='person-card'>
                                <p className="person-card-place">1.</p>
                                <p className="person-card-name">Alex Kiri -</p>
                                <p className="person-card-points">333</p>
                            </div>
                            <div className='person-card'>
                                <p className="person-card-place">2.</p>
                                <p className="person-card-name">Vova -</p>
                                <p className="person-card-points">313</p>
                            </div>
                            <div className='person-card'>
                                <p className="person-card-place">3.</p>
                                <p className="person-card-name">SunR1se -</p>
                                <p className="person-card-points">299</p>
                            </div>
                        </div>

                    </div>

                    <div className="center-column-room">
                        <div className='add-playlist-btn btn'><p className="">Додати свій плейлист</p></div>
                        <div className='choose-playlist-btn btn'><p className="">Обрати плейлист</p></div>
                    </div>


                    <div className="right-column-room column-room">
                        <p className="title-room">Налаштування</p>
                        <div className="room-options">
                            <div className="room-line"></div>
                            <p className="">Кількість треків</p>
                            <div className="roop-options-quantity-tracks">
                                <div className='quantity-tracks-row'>
                                    <p>5</p>
                                    <p>10</p>
                                    <p>15</p>
                                </div>

                                <div className='quantity-tracks-row'>
                                    <p>25</p>
                                    <p>30</p>
                                    <p>50</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default Room;