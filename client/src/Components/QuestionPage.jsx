import React from 'react'
import { useNavigate } from "react-router-dom";

const QuestionPage = ({ socket, userName, setRoomData }) => {
    const navigate = useNavigate();
    const [isConnect, setIsConnect] = React.useState(false);
    const [roomId, setRoomId] = React.useState("");

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
            socket.send(JSON.stringify({
                roomId: room._id,
                name: userName,
                event: "setClient"
            }));
            navigate('/room');
        }
    }

    const onConnectRoom = async () => {
        setIsConnect(!isConnect);
        if (roomId.length) {
            const response = await fetch(`http://127.0.0.1:5000/readRoom/${roomId}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Connection": "keep-alive"
                },
            });
            if (response.ok) {
                const room = await response.json();
                setRoomData(room);
                socket.send(JSON.stringify({
                    roomId,
                    name: userName,
                    event: "setClient"
                }));
                navigate('/room');
            }
        }
    }

    return (
        <div>
            <div className="App">
                <div className='question'>
                    <div className="white-oval">Готові перевірити свої музичні знання?</div>
                    <div className='buttons'>
                        { !isConnect
                            ? <div className='create-room-btn btn' onClick={onCreateRoom}>Створити кімнату</div>
                            : <input
                                placeholder="ID кімнати"
                                className="input-id"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                              />
                        }
                        <div className='connect-btn btn' onClick={onConnectRoom}>Приєднатись</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionPage