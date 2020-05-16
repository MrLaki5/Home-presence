import React from 'react';
import { Redirect } from "react-router-dom";

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


class SearchDevices extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            macs: [],
            go_device: false,
            dev_name: "",
            dev_mac: "",
            search: ""
        };
        this.getData = this.getData.bind(this)
        this.goDevice = this.goDevice.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        // TODO: Create api for search devices and implement handler here!

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
        //var params = "?time=" + this.props.location.state.time + "&time_group=" + this.props.location.state.time_group
        var params = "?time=11/05/2020, 08:00:00&time_group=hour"
        //console.log(params)
        // open the request with the verb and the url
        xhr.open('GET', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/mac_in_time' + params)
        // send the request
        xhr.send()
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
        if (this.state.go_device) {
            return <Redirect to={{
                pathname: "/mac_device",
                state: {
                    mac: this.state.dev_mac,
                    name: this.state.dev_name,
                }
            }}/>;
        }

        return  (
            <Grid container className='MainContainer'>
                
                {/* Title */}
                <Title_HP/>


                {/* Menu */}
                <Menu_HP current_page={1}/>

                <Grid item container xs={12}>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            id="standard-full-width"
                            label="MAC"
                            style={{color: "var(--main-primary-color)" }}
                            placeholder="Type device MAC"
                            fullWidth
                            margin="normal"
                            defaultValue={this.state.search}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                </Grid>

                {/* Tabble */}
                <Grid container item xs={12}>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                    <Grid item xs={12} md={4}>
                        <TableContainer component={Paper} style={{borderRadius: '0%'}}>
                            <Table aria-label="simple table" style={{color: "var(--main-bg-color)"}}>
                                <TableHead style={{backgroundColor: "var(--main-primary-color)", color: "var(--main-bg-color) !important"}}>
                                    <TableRow>
                                        <Hidden only={['xs', 'sm']}>
                                            {/* Button PC */}
                                            <TableCell style={{fontSize: "1vw"}}>MAC address</TableCell>
                                            <TableCell align="right" style={{fontSize: "1vw"}}>User</TableCell>
                                        </Hidden>
                                        <Hidden only={['md', 'lg', 'xl']}>
                                            {/* Button Mobile */}
                                            <TableCell style={{fontSize: "3vw"}}>MAC address</TableCell>
                                            <TableCell align="right" style={{fontSize: "3vw"}}>User</TableCell>
                                        </Hidden>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{backgroundColor: "var(--main-primary-color)", opacity: "0.5"}}>
                                {this.state.macs.map((mac, index) => (
                                    <TableRow key={index} onClick={() => this.goDevice(mac.name, mac.mac)} style={{cursor: "pointer"}}>
                                        <Hidden only={['xs', 'sm']}>
                                            {/* Button PC */}
                                            <TableCell style={{fontSize: "1vw"}} component="th" scope="row">
                                                {mac.mac}
                                            </TableCell>
                                            <TableCell style={{fontSize: "1vw"}} align="right">
                                                {mac.name}
                                            </TableCell>
                                        </Hidden>
                                        <Hidden only={['md', 'lg', 'xl']}>
                                            {/* Button Mobile */}
                                            <TableCell style={{fontSize: "3vw"}} component="th" scope="row">
                                                {mac.mac}
                                            </TableCell>
                                            <TableCell style={{fontSize: "3vw"}} align="right">
                                                {mac.name}
                                            </TableCell>
                                        </Hidden>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </TableContainer>
                    </Grid>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                </Grid>

            </Grid>)
    }
}

export default SearchDevices;