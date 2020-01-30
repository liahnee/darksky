import React, { useState } from 'react';
import clsx from 'clsx';
import {
	Card,
	CardHeader,
	CardContent,
	makeStyles,
	Collapse,
	CardActions,
	IconButton,
	Grid
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
        maxWidth: '500px',
        marginLeft: 'auto',
        marginRight: 'auto'
	},
}));
export default (props) => {
	const { data } = props;
	const classes = useStyles();
    const [ expanded, setExpanded ] = useState(false);


	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

    const time = (unix) => {
		const date = new Date(unix * 1000);
		const hours = date.getHours();
		const minutes = '0' + date.getMinutes();
		return hours + ':' + minutes.substr(-2);
	};

	const date = (unix) => {
		const fullDate = new Date(unix * 1000);
		const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
		const year = fullDate.getFullYear();
		const month = months[fullDate.getMonth()];
		const date = fullDate.getDate();
		return month + ' ' + date + ', ' + year;
    };

	console.log(data);
	return (
		<div className={classes.root}>

			<Grid container spacing={1}>
				<Grid item xs={12}>
					<Card className={classes.card}>
						<CardHeader
							title={date(data.currently.time)}
							subheader={`${data.timezone}: ${time(data.currently.time)}`}
						/>
						<CardContent>
							<Grid item xs={12}>
								{data.currently.summary}
							</Grid>
							<Grid item xs={12}>
								Temperature: {data.currently.temperature}
							</Grid>
							<Grid item xs={12}>
								Feels like: {data.currently.apparentTemperature}
							</Grid>
							<Grid item xs={12}>
								Humidity: {data.currently.humidity}
							</Grid>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12}>
					<Card className={classes.card}>
						<CardHeader title={'Next 7 Days'} />
						<CardActions disableSpacing>
							<IconButton
								className={clsx(classes.expand, {
									[classes.expandOpen]: expanded
								})}
								onClick={handleExpandClick}
								aria-expanded={expanded}
								aria-label="show more"
							>
								<ExpandMoreIcon />
							</IconButton>
						</CardActions>
						<Collapse in={expanded} timeout="auto" unmountOnExit>
                            <CardContent>
							{data.daily.data.map((day) => {
								return (
									<Grid container spacing={2}>
										<Grid item xs={3}>
											{date(day.time)}: {' '}
										</Grid>
										<Grid item xs={9}>
											{day.summary}
										</Grid>
									</Grid>
								);
							})}
							</CardContent>
						</Collapse>
					</Card>
				</Grid>
			</Grid>
		</div>
	);
};
