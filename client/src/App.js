import React, {useMemo, useState} from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import EnterNickname from './Components/EnterNickname';
import QuestionPage from "./Components/QuestionPage";
import Room from "./Components/Room";
import EnterLobby from './Components/EnterLobby';

function App() {
  const [userName, setUserName] = React.useState("");
  const [roomData, setRoomData] = React.useState(null);
  const [socketData, setSocketData] = React.useState(null);
  const [socket, setSocket] = React.useState(null);

  React.useEffect(() => {
    const s = new WebSocket("ws://127.0.0.1:4200");
    setSocket(s);
    s.onmessage = (event) => {
      console.log(JSON.parse(event.data));
      setSocketData(JSON.parse(event.data));
    }
  }, []);

  const enterNickNameEl = useMemo(() => <EnterNickname setUserName={setUserName} />, [userName, setUserName]);
  const questionPageEl = useMemo(() => <QuestionPage socket={socket} userName={userName} setRoomData={setRoomData} />, [userName, socket]);
  const roomEl = useMemo(() => <Room roomData={roomData} socketData={socketData} />, [roomData, socketData]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={enterNickNameEl} />
        { userName && <Route path="/connect" element={questionPageEl} /> }
        { roomData && <Route path="/room" element={roomEl} /> }
        <Route path="*" element={enterNickNameEl} />
      </Routes>
    </Router>
  );
}

export default App; 
