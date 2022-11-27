import React from 'react'
import { useNavigate } from "react-router-dom";

const QuestionPage = ({ userName, setRoomData }) => {
    const navigate = useNavigate();

    const onCreateRoom = async () => {
        const response = await fetch('http://127.0.0.1:5000/createRoom', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive"
            },
            body: JSON.stringify({
                username: userName
            })
        });
        if (response.ok) {
            const room = await response.json();
            setRoomData(room);
            navigate('/room');
        }
    }

    return (
        <div>
            <div className="App">
                <div className='question'>
                    <div className="white-oval">Готові перевірити свої музичні знання?</div>
                    <div className='buttons'>
                        <div className='create-room-btn btn' onClick={onCreateRoom}>Створити кімнату</div>
                        <div className='connect-btn btn'>Приєднатись</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionPage