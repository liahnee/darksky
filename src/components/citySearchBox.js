import React from 'react';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
export default () => {
	const classes = useStyles();

	// const handleCityName = () => {};
	return (
		<div>
			<form>
				<TextField
					disabled
					className={classes.textField}
					id="standard-basic"
					// onChange={handleCityName}
					label={'City Name'}
					InputLabelProps={{ shrink: true }}
				/>
				<TextField
					disabled
					className={classes.textField}
					id="standard-basic"
					// onChange={handleCityName}
					label={'Country Name'}
					InputLabelProps={{ shrink: true }}
				/>
				<Button disabled variant="outlined">
					Search
				</Button>
			</form>
		</div>
	);
};
