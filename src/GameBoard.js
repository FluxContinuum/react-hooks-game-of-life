import React, { useState, useEffect } from 'react';
import './GameBoard.css';
import GameCell from './GameCell';

const WIDTH = 1200;
const HEIGHT = 600;
const CELL_SIZE = 5;
const ROWS = HEIGHT / CELL_SIZE;
const COLS = WIDTH / CELL_SIZE;

const createGrid = (rows, cols, isRandom=false) => {
	let grid = [];

	for (let y = 0; y < rows; y++){
		grid[y] = [];

		for (let x = 0; x < cols; x++){
			grid[y][x] = isRandom	? (Math.random() >= 0.5) : false;
		}
	}

	return grid;
}

const createCells = grid => {
/*	const rows = grid.length;
	const cols = grid[0].length;

	let cells = [];

	for (let y = 0; y < rows; y++){
		for (let x = 0; x < cols; x++){
			if (grid[y][x]){
				cells.push({ x, y });
			}
		}
	}
*/
	const cells = grid.flatMap((row, y) => {
		return row.reduce((living, col, x) => {
			if (col){
				living.push({ x,y });
			}
			return living;
		}, []);
	});

	return cells;
}

const evalNeighbors = (x, y, grid) => {
	const directions = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
	const rows = grid.length;
	const cols = grid[0].length;

	let neighbors = 0;

	directions.forEach(cell => {
		const neighborX = x + cell[1];
		const neighborY = y + cell[0];

		if (neighborX >= 0 && neighborX < cols && neighborY >= 0 && neighborY < rows && grid[neighborY][neighborX]){
			neighbors++;
		}
	});

	return neighbors;
}

function GameBoard() {
	const [running, setRunning] = useState(false);
	const [gameInterval, setGameInterval] = useState(100);

	const [grid, setGrid] = useState(createGrid(ROWS, COLS, true));
	const [cells, setCells] = useState(createCells(grid));

	// set cells when grid updates
	useEffect(() => {
		setCells(createCells(grid));
	}, [grid]);

	// main game loop
	useEffect(() => {
		if (running){
			let newGrid = createGrid(ROWS, COLS);

			for (let y = 0; y < ROWS; y++){
				for (let x = 0; x < COLS; x++){
					const neighbors = evalNeighbors(x, y, grid);

					if (grid[y][x]){
						if (neighbors === 2 || neighbors === 3){
							newGrid[y][x] = true;
						}else{
							newGrid[y][x] = false;
						}
					}else if(!grid[y][x] && neighbors === 3){
						newGrid[y][x] = true;
					}
				}
			}

			const timeout = setTimeout(() => {
				setGrid(newGrid);
			}, gameInterval);

			return () => {
				clearTimeout(timeout);
			}
		}
	}, [grid, gameInterval, running]);

	return (
    <div>
      <div className="game-board" style={{ width: WIDTH, height: HEIGHT, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}} >
        { cells.map(cell => <GameCell size={CELL_SIZE} x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`} />) }
      </div>
      <div>
      	<span style={{fontSize: 'calc(10px + 1vmin)'}}>Game Interval:</span> <input value={gameInterval} onChange={ev => setGameInterval(ev.target.value)} />
      	<button className="button-control" onClick={() => setRunning(!running)}> {running ? 'Stop' : 'Start'} </button>
      	<button className="button-control" onClick={() => setGrid(createGrid(ROWS, COLS, true))}> Randomize </button>
      	<button className="button-control" onClick={() => setGrid(createGrid(ROWS, COLS))}> Empty </button>
      </div>
    </div>
	);
}

export default GameBoard;