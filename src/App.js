import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import WeatherData from './container/weatherData';

import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: 200
		}
	}
}));

function App() {
	const classes = useStyles();

	const [ data, setData ] = useState(null);
	const [ loading, setLoading ] = useState(true);
	const [ count, setCount ] = useState(0);

	const [ longitude, setLng ] = useState('-0.127758');
	const [ latitude, setLat ] = useState('51.507351');
	const [ name, setName ] = useState('London');

	useEffect(
		() => {
			fetchData(latitude, longitude);
		}
	);

	async function fetchData(latitude, longitude) {
		const darkSkyApi = process.env.REACT_APP_DARK_SKY_API_KEY;
		const weatherData = await fetch(`https://api.darksky.net/forecast/${darkSkyApi}/${latitude}, ${longitude}`)
			.then((resp) => resp.json())
			.then((json) => {
				setData(json);
				setLoading(false);
			})
		return weatherData;
	}

	// useInterval(() => {
	//   setCount(count + 1);
	// }, 10000);

	const latlng = [ { type: 'Latitude', fn: setLat }, { type: 'Longitude', fn: setLng } ];
	return (
		<div className={classes.root} >
			<form noValidate autoComplete="off">
				{latlng.map((item, idx) => (
					<TextField 
						key={idx}
						id="standard-numsber"
						onChange={item.fn}
						label={item.type}
						InputLabelProps={{ shrink: true }}
					/>
				))}
			</form>
			{loading ? 'Loading' : <WeatherData data={data} setLat={setLat} setLng={setLng} />}
		</div>
	);
}

export default App;

function useInterval(callback, delay) {
	const savedCallback = useRef();
	useEffect(
		() => {
			savedCallback.current = callback;
		},
		[ callback ]
	);

	useEffect(
		() => {
			function tick() {
				savedCallback.current();
			}
			if (delay !== null) {
				let id = setInterval(tick, delay);
				return () => clearInterval(id);
			}
		},
		[ delay ]
	);
}
