import React from 'react';
import './App.css';
import GameBoard from './GameBoard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Conway's Game of Life
        </p>
        <GameBoard />
      </header>
    </div>
  );
}

export default App;
