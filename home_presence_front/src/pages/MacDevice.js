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
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';


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
            time_group: "hour",
            _1h_opacity: 1,
            _24h_opacity: 0.5,
            _1m_opacity: 0.5,
            _1y_opacity: 0.5,
            row_per_page: 10,
            page_num: 0,
            all_user_count: 0
        };
        this.goBack = this.goBack.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.sendNameChange = this.sendNameChange.bind(this)
        this.getData = this.getData.bind(this)
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
            this.setState(state => ({
                times: data_obj.times,
                all_user_count: data_obj.count
            }));
        })
        var params = "mac=" + this.props.location.state.mac + "&time_group=" + this.state.time_group + "&per_page=" + this.state.row_per_page + "&page_num=" + (this.state.page_num + 1)
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

    handleClickTime(time_clk) {
        switch(time_clk){
            case "1h":
                this.setState(state => ({
                    _1h_opacity: 1,
                    _24h_opacity: 0.5,
                    _1m_opacity: 0.5,
                    _1y_opacity: 0.5,
                    page_num: 0,
                    time_group: "hour"
                })
                , () => this.getData());
                break;
            case "24h":
                this.setState(state => ({
                    _1h_opacity: 0.5,
                    _24h_opacity: 1,
                    _1m_opacity: 0.5,
                    _1y_opacity: 0.5,
                    page_num: 0,
                    time_group: "day"
                })
                , () => this.getData());
                break;
            case "1m":
                this.setState(state => ({
                    _1h_opacity: 0.5,
                    _24h_opacity: 0.5,
                    _1m_opacity: 1,
                    _1y_opacity: 0.5,
                    page_num: 0,
                    time_group: "month"
                })
                , () => this.getData());
                break;
            case "1y":
                this.setState(state => ({
                    _1h_opacity: 0.5,
                    _24h_opacity: 0.5,
                    _1m_opacity: 0.5,
                    _1y_opacity: 1,
                    page_num: 0,
                    time_group: "year"
                })
                , () => this.getData());
                break;
            default:
                break;
        }
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
        if (this.state.go_back) {
            if (!this.props.location.state.time_back)
                return <Redirect to={{
                    pathname: "/search"
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

        var current_page_menu = 0
        if(!this.props.location.state.time_back) {
            var current_page_menu = 1
        }

        return (
            <Grid container className='MainContainer'>
                
                {/* Title */}
                <Title_HP/>


                {/* Menu */}
                <Menu_HP current_page={current_page_menu}/>


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
                <Grid container item xs={12} style={{marginBottom: '2.0%'}}>
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

                {/* Time Group and slider */}
                <Grid container item xs={12}>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                    <Grid item xs={3} md={1}>
                        <Hidden only={['xs', 'sm']}>
                            {/* Button PC */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._1h_opacity}} onClick={ () => this.handleClickTime('1h')}>Hour</Button>
                        </Hidden>
                        <Hidden only={['md', 'lg', 'xl']}>
                            {/* Button Mobile */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '2.5vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._1h_opacity}} onClick={ () => this.handleClickTime('1h')}>Hour</Button>
                        </Hidden>
                    </Grid>
                    <Grid item xs={3} md={1}>
                        <Hidden only={['xs', 'sm']}>
                            {/* Button PC */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._24h_opacity}} onClick={() => this.handleClickTime('24h')}>Day</Button>
                        </Hidden>
                        <Hidden only={['md', 'lg', 'xl']}>
                            {/* Button Mobile */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '2.5vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._24h_opacity}} onClick={() => this.handleClickTime('24h')}>Day</Button>
                        </Hidden>
                    </Grid>
                    <Grid item xs={3} md={1}>
                        <Hidden only={['xs', 'sm']}>
                            {/* Button PC */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._1m_opacity}} onClick={() => this.handleClickTime('1m')}>Month</Button>
                        </Hidden>
                        <Hidden only={['md', 'lg', 'xl']}>
                            {/* Button Mobile */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '2.5vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._1m_opacity}} onClick={() => this.handleClickTime('1m')}>Month</Button>
                        </Hidden>
                    </Grid>
                    <Grid item xs={3} md={1}>
                        <Hidden only={['xs', 'sm']}>
                            {/* Button PC */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._1y_opacity}} onClick={() => this.handleClickTime('1y')}>Year</Button>
                        </Hidden>
                        <Hidden only={['md', 'lg', 'xl']}>
                            {/* Button Mobile */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '2.5vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._1y_opacity}} onClick={() => this.handleClickTime('1y')}>Year</Button>
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
                                            <TableCell style={{fontSize: "1vw"}} align="center">Active times</TableCell>
                                        </Hidden>
                                        <Hidden only={['md', 'lg', 'xl']}>
                                            {/* Button Mobile */}
                                            <TableCell style={{fontSize: "3vw"}} align="center">Active times</TableCell>
                                        </Hidden>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{backgroundColor: "var(--main-primary-color)", opacity: "0.5"}}>
                                {this.state.times.map((time_curr, index) => (
                                    <TableRow key={index}>
                                        <Hidden only={['xs', 'sm']}>
                                            {/* Button PC */}
                                            <TableCell style={{fontSize: "1vw"}} component="th" scope="row" align="center">
                                                {time_curr.time}
                                            </TableCell>
                                        </Hidden>
                                        <Hidden only={['md', 'lg', 'xl']}>
                                            {/* Button Mobile */}
                                            <TableCell style={{fontSize: "3vw"}} component="th" scope="row" align="center">
                                                {time_curr.time}
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
                            count={this.state.all_user_count}
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

export default MacDevice;