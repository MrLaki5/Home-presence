import React from 'react';
import { Redirect } from "react-router-dom";
import MacDeviceLine from "../components/MacDeviceLine"

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Menu_HP from '../components/Menu_HP'
import Title_HP from '../components/Title_HP'
import '../app.css'


class DevicesInTime extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            macs: [],
            go_back: false,
            go_device: false,
            dev_name: "",
            dev_mac: ""
        };
        this.getData = this.getData.bind(this)
        this.goBack = this.goBack.bind(this)
        this.goDevice = this.goDevice.bind(this)
    }

    componentDidMount() {
        this.getData()
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
                macs: data_obj.mac_logs
            }));
        })
        var params = "?time=" + this.props.location.state.time + "&time_group=" + this.props.location.state.time_group
        console.log(params)
        // open the request with the verb and the url
        xhr.open('GET', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/mac_in_time' + params)
        // send the request
        xhr.send()
    }

    goBack() {
        this.setState(state => ({
            go_back: true
        }));
    }

    goDevice(dev_name, dev_mac) {
        console.log("name: " + dev_name)
        console.log("mac: " + dev_mac)
        this.setState(state => ({
            go_device: true,
            dev_name: dev_name,
            dev_mac: dev_mac
        }));
    }

    render() {
        if (this.state.go_back) {
            return <Redirect to={{
                pathname: "/"
            }}/>;
        }
        if (this.state.go_device) {
            return <Redirect to={{
                pathname: "/mac_device",
                state: {
                    mac: this.state.dev_mac,
                    time_back: this.props.location.state.time,
                    name: this.state.dev_name,
                    time_group: this.props.location.state.time_group
                }
            }}/>;
        }

        return  (
            <Grid container className='MainContainer'>
                
                {/* Title */}
                <Title_HP/>


                {/* Menu */}
                <Menu_HP current_page={0}/>

                {/* Tabble */}
                <Grid container item xs={12}>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                    <Grid item xs={12} md={4}>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table" style={{color: "var(--main-bg-color)"}}>
                                <TableHead style={{backgroundColor: "var(--main-primary-color)", color: "var(--main-bg-color) !important"}}>
                                <TableRow>
                                    <TableCell>Time: {this.props.location.state.time_group} [{this.props.location.state.time}]</TableCell>
                                    <TableCell align="right">Count: {this.state.macs.length}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>MAC address</TableCell>
                                    <TableCell align="right">User</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody style={{backgroundColor: "var(--main-primary-color)", opacity: "0.5"}}>
                                {this.state.macs.map((mac, index) => (
                                    <TableRow key={index} onClick={() => this.goDevice(mac.name, mac.mac)} style={{cursor: "pointer"}}>
                                    <TableCell component="th" scope="row">
                                        {mac.mac}
                                    </TableCell>
                                    <TableCell align="right">{mac.name}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </TableContainer>
                    </Grid>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                </Grid>


                    <a onClick={this.goBack}> Back </a>
            </Grid>)
    }
}

export default DevicesInTime;