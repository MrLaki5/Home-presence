import React from 'react';
import { Redirect } from "react-router-dom";
import TimeLine from '../components/TimeLine';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


import Menu_HP from '../components/Menu_HP'
import Title_HP from '../components/Title_HP'
import '../app.css'


class MacDevice extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            go_back: false,
            name: this.props.location.state.name,
            times: [],
            top_val: 10,
            time_group: "hour",
        };
        this.goBack = this.goBack.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.sendNameChange = this.sendNameChange.bind(this)
        this.getData = this.getData.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSelectTimeChange = this.handleSelectTimeChange.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    handleInputChange(event) {
        this.setState({top_val: event.target.value}, () => this.getData());
    }

    handleSelectTimeChange(event){
        this.setState({time_group: event.target.value}, () => this.getData());
    }

    getData() {
        // create a new XMLHttpRequest
        var xhr = new XMLHttpRequest()

        // get a callback when the server responds
        xhr.addEventListener('load', () => {
            // update the state of the component with the result here
            console.log(xhr.responseText)
            var data_obj = JSON.parse(xhr.responseText);
            this.setState(state => ({
                times: data_obj.times
            }));
        })
        var params = "mac=" + this.props.location.state.mac + "&time_group=" + this.state.time_group + "&top=" + this.state.top_val
        console.log(params)
        // open the request with the verb and the url
        xhr.open('POST', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/time_for_mac')
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // send the request
        xhr.send(params)
    }

    goBack() {
        this.setState(state => ({
            go_back: true
        }));
    }

    handleNameChange(event) {
        const value = event.target.value || ""
        this.setState(state => ({
            name: value
        }));
    }

    sendNameChange(event) {
        // create a new XMLHttpRequest
        var xhr = new XMLHttpRequest()

        // get a callback when the server responds
        xhr.addEventListener('load', () => {
            // update the state of the component with the result here
            console.log(xhr.responseText)
        })
        var params = "name=" + this.state.name + "&mac=" + this.props.location.state.mac
        console.log(params)
        // open the request with the verb and the url
        xhr.open('POST', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/change_name')
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // send the request
        xhr.send(params)
    }

    render() {
        if (this.state.go_back) {
            if (!this.props.location.state.time_back)
                return <Redirect to={{
                    pathname: "/"
                }}/>;
            else {
                return <Redirect to={{
                pathname: "/specific_time",
                state: {
                    time: this.props.location.state.time_back,
                    time_group: this.props.location.state.time_group
                }
            }}/>;
            }
        }
        const times = this.state.times.map((time_curr, index) =>
            <TimeLine key={index} time={time_curr}/>
        );
        return (
            <Grid container className='MainContainer'>
                
                {/* Title */}
                <Title_HP/>


                {/* Menu */}
                <Menu_HP current_page={0}/> 

                {/* Back button */}
                <Grid container item xs={12} style={{marginBottom: '1.5%'}}>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                    <Grid item xs={12} md={4}>
                        <Hidden only={['xs', 'sm']}>
                            {/* Button PC */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)"}} onClick={ () => this.goBack()}>Back</Button>
                        </Hidden>
                        <Hidden only={['md', 'lg', 'xl']}>
                            {/* Button Mobile */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)"}} onClick={ () => this.goBack()}>Back</Button>
                        </Hidden>
                    </Grid>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                </Grid>

                {/* User and mac info */}
                <Grid container item xs={12}>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            id="standard-full-width"
                            disabled={true}
                            label="MAC"
                            style={{color: "var(--main-primary-color)" }}
                            placeholder="MAC"
                            fullWidth
                            margin="normal"
                            defaultValue={this.props.location.state.mac}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            id="standard-full-width"
                            label="User"
                            style={{color: "var(--main-primary-color)" }}
                            placeholder="User"
                            fullWidth
                            margin="normal"
                            onChange={this.handleNameChange}
                            defaultValue={this.state.name}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                    
                    {/* Change button */}
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                    <Grid item xs={12} md={4}>
                        <Hidden only={['xs', 'sm']}>
                            {/* Button PC */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)"}} onClick={ () => this.sendNameChange()}>Save</Button>
                        </Hidden>
                        <Hidden only={['md', 'lg', 'xl']}>
                            {/* Button Mobile */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)"}} onClick={ () => this.sendNameChange()}>Save</Button>
                        </Hidden>
                    </Grid>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>

                </Grid>


                <div>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={this.state.top_val}
                        onChange={this.handleInputChange}
                    />
                    <select
                        value={this.state.time_group}
                        onChange={this.handleSelectTimeChange}
                    >
                        <option value="hour">Hour</option>
                        <option value="day">Day</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                    </select>
                </div>
                <div>
                    {times}
                </div>

            </Grid>)
    }
}

export default MacDevice;