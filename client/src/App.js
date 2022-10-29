import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
const socket = io.connect("http://localhost:5000")

function App() {

    return (
      <div className="App">123</div>
    );
  }

export default App;
