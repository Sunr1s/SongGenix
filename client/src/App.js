import React from 'react';
import './App.scss';
import { Route, Routes } from 'react-router-dom';
import QuestionPage from './Components/QuestionPage';
import EnterNickname from './Components/EnterNickname';



function App() {

  return (
    <EnterNickname />
  );
}

export default App; 
