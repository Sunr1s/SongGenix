import React from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import EnterNickname from './Components/EnterNickname';
import QuestionPage from "./Components/QuestionPage";
import Room from "./Components/Room";

function App() {
  const [userName, setUserName] = React.useState("");
  const [roomData, setRoomData] = React.useState(null);

  return (
      <Router>
          <Routes>
            <Route path="/" element={<EnterNickname userName={userName} setUserName={setUserName} />} />
            <Route path="/connect" element={<QuestionPage userName={userName} setRoomData={setRoomData} />}/>
            <Route path="/room" element={<Room />}/>
            <Route path="*" element={<QuestionPage />}/>
          </Routes>
      </Router>
  );
}

export default App; 
