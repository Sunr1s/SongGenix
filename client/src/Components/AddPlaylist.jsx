import React from 'react'

const EnterLobby = (props) => {
    if(!props.show) {
        return null
    }


    return (
        <div className='App'>
            <div className='AddPlaylist'>
                <div className="data-playlist">
                    <div className="playlist-white-oval">
                        <p className="playlist-white-oval-text">Назва плейлиста</p>
                        <input type="text" className="playlist-white-oval-input" />
                        <div onClick={props.onClose} className='playlist-white-oval-btn btn'>Продовжити</div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default EnterLobby



