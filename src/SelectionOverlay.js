import React, { useReducer } from 'react';

const reducer = (state, action) => {
	switch(action.type){
		case 'UPDATE_ALL':
			return {...state, ...action}
		default:
			throw new Error();
	}
}

const initState = {
	isActive: false,
	beginX: 0,
	beginY: 0,
	endX: 0,
	endY: 0
}

function SelectionOverlay(props) {
	const [state, dispatch] = useReducer(reducer, initState);

	return (
		<div style={{
			position: 'absolute',
			width: '100%',
			height: '100%'
    }}
    onMouseDown={ev => {
			const { clientX, clientY } = ev;
    	dispatch({type: 'UPDATE_ALL', isActive: true, beginX: clientX, beginY: clientY, endX: clientX, endY: clientY});
    }}
    onMouseMove={ev => {
  		if (state.isActive){
				const { clientX, clientY } = ev;
    		dispatch({type: 'UPDATE_ALL', endX: clientX, endY: clientY});
    	}
  	}}
  	onMouseUp={ev => {
    	dispatch({type: 'UPDATE_ALL', isActive: false});
  	}} >
    	<div style={{
    		position: 'fixed',
    		backgroundColor: 'gray',
    		display: state.isActive ? '' : 'none',
    		top: `${Math.min(state.beginY, state.endY)}px`,
    		left: `${Math.min(state.beginX, state.endX)}px`,
    		width: `${Math.abs(state.endX - state.beginX)}px`,
    		height: `${Math.abs(state.endY - state.beginY)}px`
    	}}></div>
    </div>
	);
}

export default SelectionOverlay;