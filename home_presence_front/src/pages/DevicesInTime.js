import React from 'react';
import { Redirect } from "react-router-dom";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';

import Menu_HP from '../components/Menu_HP'
import Title_HP from '../components/Title_HP'


class DevicesInTime extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            macs: [],
            go_back: false,
            go_device: false,
            dev_name: "",
            dev_mac: "",
            row_per_page: 10,
            page_num: 0,
            all_device_count: 0,
            login_required: false
        };
        this.getData = this.getData.bind(this)
        this.goBack = this.goBack.bind(this)
        this.goDevice = this.goDevice.bind(this)
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
        this.handleChangePage = this.handleChangePage.bind(this)
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
            if (data_obj["status"] === "success"){
                 if (data_obj.hasOwnProperty('mac_logs')){
                    this.setState(state => ({
                        macs: data_obj.mac_logs,
                        all_device_count: data_obj.count
                    }));
                 }
            }
            else {
                this.setState(state => ({
                    login_required: true
                }));
            }

        })
        var params = "?time=" + this.props.location.state.time + "&time_group=" + this.props.location.state.time_group + "&per_page=" + this.state.row_per_page + "&page_num=" + (this.state.page_num + 1)
        console.log(params)
        // open the request with the verb and the url
        xhr.open('GET', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/mac_in_time' + params)
        // add auth token
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'))
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

    handleChangePage(event, newPage) {
        this.setState(state => ({
            page_num: newPage
        })
        , () => this.getData());
    };

    handleChangeRowsPerPage(event){
        this.setState(state => ({
            row_per_page: +event.target.value,
            page_num: 0
        })
        , () => this.getData());
    };

    render() {
        if (this.state.login_required) {
            return <Redirect to={{
                pathname: "/login"
            }}/>;
        }
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
                                            <TableCell style={{fontSize: "1vw"}}>Time: {this.props.location.state.time_group} [{this.props.location.state.time}]</TableCell>
                                            <TableCell align="right" style={{fontSize: "1vw"}}>Count: {this.state.all_device_count}</TableCell>
                                        </Hidden>
                                        <Hidden only={['md', 'lg', 'xl']}>
                                            {/* Button Mobile */}
                                            <TableCell style={{fontSize: "3vw"}}>Time: {this.props.location.state.time_group} [{this.props.location.state.time}]</TableCell>
                                            <TableCell align="right" style={{fontSize: "3vw"}}>Count: {this.state.all_device_count}</TableCell>
                                        </Hidden>
                                    </TableRow>
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
                        <TablePagination
                            rowsPerPageOptions={[10, 20]}
                            component="div"
                            count={this.state.all_device_count}
                            rowsPerPage={this.state.row_per_page}
                            page={this.state.page_num}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                    </Grid>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                </Grid>

            </Grid>)
    }
}

export default DevicesInTime;