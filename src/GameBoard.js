import React, { useState, useEffect } from 'react';
import './GameBoard.css';
import GameCell from './GameCell';

const createGrid = (rows, cols, isRandom=false) => {
	let grid = [];

	for (let x = 0; x < cols; x++){
		grid[x] = [];

		for (let y = 0; y < rows; y++){
			grid[x][y] = isRandom	? (Math.random() >= 0.5) : false;
		}
	}

	return grid;
}

const createCells = grid => {
	const rows = grid[0].length;
	const cols = grid.length;

	let cells = [];

	for (let x = 0; x < cols; x++){
		for (let y = 0; y < rows; y++){
			if (grid[x][y]){
				cells.push({ x, y });
			}
		}
	}

	return cells;
}

const evalNeighbors = (x, y, grid) => {
	const directions = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
	const rows = grid[0].length;
	const cols = grid.length;

	let neighbors = 0;

	directions.forEach(cell => {
		const neighborX = x + cell[0];
		const neighborY = y + cell[1];

		if (neighborX >= 0 && neighborX < cols && neighborY >= 0 && neighborY < rows && grid[neighborX][neighborY]){
			neighbors++;
		}
	});

	return neighbors;
}

function GameBoard() {
	const [width, setWidth] = useState(800);
	const [height, setHeight] = useState(600);
	const [cellSize, setCellSize] = useState(10);
	const [running, setRunning] = useState(false);
	const [gameInterval, setGameInterval] = useState(100);

	const rows = height / cellSize;
	const cols = width / cellSize;

	const [grid, setGrid] = useState(createGrid(rows, cols, true));
	const [cells, setCells] = useState(createCells(grid));

	useEffect(() => {
		let newGrid = createGrid(rows, cols);

		for (let x = 0; x < cols; x++){
			for (let y = 0; y < rows; y++){
				const neighbors = evalNeighbors(x, y, grid);

				if (grid[x][y]){
					if (neighbors === 2 || neighbors === 3){
						newGrid[x][y] = true;
					}else{
						newGrid[x][y] = false;
					}
				}else if(!grid[x][y] && neighbors === 3){
					newGrid[x][y] = true;
				}
			}
		}

		const timeout = setTimeout(() => {
			setGrid(newGrid);
			setCells(createCells(newGrid));
		}, gameInterval);

		return () => {
			clearTimeout(timeout);
		}
	}, [grid, rows, cols, gameInterval]);

	return (
    <div>
      <div className="game-board" style={{ width: width, height: height, backgroundSize: `${cellSize}px ${cellSize}px`}} >
        { cells.map(cell => <GameCell size={cellSize} x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`} />) }
      </div>
    </div>
	);
}

export default GameBoard;