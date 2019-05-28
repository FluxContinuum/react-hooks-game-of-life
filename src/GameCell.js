import React from 'react';
import './GameCell.css';

function GameCell(props) {
	const { size, x, y } = props;
	return (
		<div className="game-cell" style={{
      left: `${size * x + 1}px`,
      top: `${size * y + 1}px`,
      width: `${size - 1}px`,
      height: `${size - 1}px`,
    }} />
	);
}

export default GameCell;