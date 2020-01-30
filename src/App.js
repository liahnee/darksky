import React, { useState, useEffect, useRef } from 'react';
import socketIOClient from "socket.io-client";
import './App.css';

import WeatherData from './container/weatherData';
import CitySearchBox from './components/citySearchBox';

import { TextField, Typography, Divider, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const darkSkyApi = process.env.REACT_APP_DARK_SKY_API_KEY;

const useStyles = makeStyles((theme) => ({
	root: {
		margin: theme.spacing(1),
		maxWidth: '500px',
		marginLeft: 'auto',
		marginRight: 'auto'
	},
	form: {
		marginTop: '10vh',
		marginBottom: '10px',
		maxWidth: '500px'
	},
	dividerFullWidth: {
		margin: `5px 100px 0px ${theme.spacing(2)}px`,
		justifyContent: 'center'
	},
	textField: {
		padding: '10px'
	}
}));

function App() {
	const classes = useStyles();

	const [ checkedCurrentGeo, setCheckedCurrentGeo ] = useState(false);
	const [ geoError, setGeoError ] = useState(false);
	const [ loading, setLoading ] = useState(true);

	const [ data, setData ] = useState(null);
	const [ longitude, setLng ] = useState(null);
	const [ latitude, setLat ] = useState(null);
	const [ name, setName ] = useState('');

	const [ count, setCount ] = useState(0);
	const [ newSearch, setNewSearch ] = useState(0);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(handleCurrentLocation);

		} else {
			setGeoError(true);
		}
	}, [geoError]);

	const handleCurrentLocation = (position) => {
		setLat(position.coords.latitude);
		setLng(position.coords.longitude);
		setCheckedCurrentGeo(true);
	};

	useEffect(
		() => {
			if (latitude !== null && longitude !== null) {
				const socket = socketIOClient(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkSkyApi}/${latitude}, ${longitude}`);
				socket.on("FromAPI", data => setData(data))
				fetchData(latitude, longitude);
			}
		},
		[ newSearch, count, checkedCurrentGeo ]
	);

	async function fetchData(latitude, longitude) {

		const weatherData = await fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkSkyApi}/${latitude}, ${longitude}`)
			.then((resp) => resp.json())
			.then((json) => {
				setData(json);
			})
			.then(() => {
				setLoading(false);
			});
	}

	useInterval(() => {
		setCount(count + 1);
	}, 60000);

	const handleSubmit = () => {
		setLoading(true);
		setNewSearch(newSearch + 1);
	};

	const latlng = [ { type: 'Latitude', fn: setLat }, { type: 'Longitude', fn: setLng } ];
	return (
		<div className={classes.root}>
			{geoError ? 'Geolocation is not supported by this browser.' : null}
			<form noValidate autoComplete="off" className={classes.form} onSubmit={handleSubmit}>
				{latlng.map((item, idx) => (
					<TextField
						className={classes.textField}
						key={idx}
						id="standard-number"
						onChange={item.fn}
						label={item.type}
						InputLabelProps={{ shrink: true }}
					/>
				))}
				<Button variant="outlined">Search</Button>
			</form>
			<Divider variant="middle" />
			<Typography className={classes.dividerFullWidth} color="textSecondary" display="block" variant="caption">
				OR
			</Typography>
			<CitySearchBox />
			{loading ? 'Loading' : <WeatherData data={data} />}
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
