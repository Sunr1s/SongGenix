import React from 'react'

const EnterLobby = () => {
    return (
        <div className='App'>
            <div className='EnterLobby'>
                <div className="lobby-white-oval">
                    <p className="lobby-white-oval-text">Код кімнати</p>
                    <input type="text" className="lobby-white-oval-input" />
                    <div className='lobby-white-oval-btn btn'>Продовжити</div>
                </div>
            </div>
        </div>
    )
}

export default EnterLobby