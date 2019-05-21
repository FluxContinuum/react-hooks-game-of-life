import React from 'react';
import './GameCell.css';

function GameCell(props) {
	const { x, y } = props;
	return (
		<div className="game-cell" style={{
      left: `${props.size * x + 1}px`,
      top: `${props.size * y + 1}px`,
      width: `${props.size - 1}px`,
      height: `${props.size - 1}px`,
    }} />
	);
}

export default GameCell;