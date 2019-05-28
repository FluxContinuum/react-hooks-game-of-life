import React, { createRef, useEffect, useReducer } from 'react';
import './GameBoard.css';
import GameCell from './GameCell';

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

const getGridCoords = (event, elem) => {
	const x = Math.floor((event.clientX - elem.current.offsetLeft) / CELL_SIZE);
	const y = Math.floor((event.clientY - elem.current.offsetTop) / CELL_SIZE);

	return {x, y};
}

const reducer = (state, action) => {
	switch(action.type) {
		case 'UPDATE_GAME':
			return {...state, grid: action.grid, cells: createCells(action.grid)}
		case 'TOGGLE_RUNNING':
			return {...state, isRunning: !state.isRunning}
		case 'SET_INTERVAL':
			return {...state, gameInterval: action.gameInterval}
		default:
			throw new Error();
	}
}

const WIDTH = 1200;
const HEIGHT = 600;
const CELL_SIZE = 5;
const ROWS = HEIGHT / CELL_SIZE;
const COLS = WIDTH / CELL_SIZE;

const initGrid = createGrid(ROWS, COLS, true);
const initState = {
	grid: initGrid,
	cells: createCells(initGrid),
	isRunning: false,
	gameInterval: 100
}

function GameBoard() {
	const boardRef = createRef();
	const [state, dispatch] = useReducer(reducer, initState);

	// main game loop
	useEffect(() => {
		if (state.isRunning){
			let newGrid = createGrid(ROWS, COLS);

			for (let y = 0; y < ROWS; y++){
				for (let x = 0; x < COLS; x++){
					const neighbors = evalNeighbors(x, y, state.grid);

					if (state.grid[y][x]){
						if (neighbors === 2 || neighbors === 3){
							newGrid[y][x] = true;
						}else{
							newGrid[y][x] = false;
						}
					}else if(!state.grid[y][x] && neighbors === 3){
						newGrid[y][x] = true;
					}
				}
			}

			const timeout = setTimeout(() => {
				dispatch({type: 'UPDATE_GAME', grid: newGrid});
			}, state.gameInterval);

			return () => {
				clearTimeout(timeout);
			}
		}
	}, [state.grid, state.gameInterval, state.isRunning]);

	return (
    <div>
      <div className="game-board" ref={boardRef}
      	onClick={(ev) => {
      		const {x, y} = getGridCoords(ev, boardRef);
      		state.grid[y][x] = !state.grid[y][x];
      		dispatch({type: 'UPDATE_GAME', grid: state.grid});
      	}}
      	style={{ width: WIDTH, height: HEIGHT, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}} >
        { state.cells.map(cell => <GameCell size={CELL_SIZE} x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`} />) }
      </div>
      <div>
      	<span style={{fontSize: 'calc(10px + 1vmin)'}}>Game Interval:</span>
      	<input style={{marginLeft: '5px'}} value={state.gameInterval} onChange={ev => dispatch({type: 'SET_INTERVAL', gameInterval: ev.target.value})} />
      	<button className="button-control" onClick={() => dispatch({type: 'TOGGLE_RUNNING', isRunning: !state.isRunning})}> {state.isRunning ? 'Stop' : 'Start'} </button>
      	<button className="button-control" onClick={() => dispatch({type: 'UPDATE_GAME', grid: createGrid(ROWS, COLS, true)})}> Randomize </button>
      	<button className="button-control" onClick={() => dispatch({type: 'UPDATE_GAME', grid: createGrid(ROWS, COLS)})}> Empty </button> 
      </div>
    </div>
	);
}

export default GameBoard;