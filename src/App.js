import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import WeatherData from './container/weatherData';
import CitySearchBox from './components/citySearchBox';

import { TextField, Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		margin: theme.spacing(1),
		maxWidth: '500px',
		marginLeft: 'auto',
		marginRight: 'auto',	
	},
	form: {
		marginTop: '10vh',
		marginBottom: '10px',
		maxWidth: '500px',
	},
	dividerFullWidth: {
		margin: `5px 100px 0px ${theme.spacing(2)}px`,
		justifyContent: 'center',
	},
	textField: {
		padding: '10px',
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

	const [ geoError, setGeoError ] = useState(false);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(handleCurrentLocation);
		} else {
			return setGeoError(true);
		}
	});

	const handleCurrentLocation = (position) => {
		setLat(position.coords.latitude);
		setLng(position.coords.longitude);
	};

	useEffect(() => {
		fetchData(latitude, longitude);
	});

	async function fetchData(latitude, longitude) {
		const darkSkyApi = process.env.REACT_APP_DARK_SKY_API_KEY;
		const weatherData = await fetch(`https://api.darksky.net/forecast/${darkSkyApi}/${latitude}, ${longitude}`)
			.then((resp) => resp.json())
			.then((json) => {
				setData(json);
				setLoading(false);
			});
		return weatherData;
	}

	// useInterval(() => {
	//   setCount(count + 1);
	// }, 10000);

	const latlng = [ { type: 'Latitude', fn: setLat }, { type: 'Longitude', fn: setLng } ];
	return (
		<div className={classes.root}>
			{geoError ? 'Geolocation is not supported by this browser.' : null}
			<form noValidate autoComplete="off" className={classes.form}>
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
			</form>
			<Divider variant="middle" />
				<Typography
					className={classes.dividerFullWidth}
					color="textSecondary"
					display="block"
					variant="caption"
				>
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
