import React from 'react';

import Menu_HP from '../components/Menu_HP'
import Title_HP from '../components/Title_HP'
import '../app.css'

import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Hidden from '@material-ui/core/Hidden';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


class MacDevice extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            worker_status: false,
            sleep_time_db: 0,
            network_mask: "",
            sleep_time_mac: 0,
            max_miss_count: 0
        };
        this.checkWorkerStatus = this.checkWorkerStatus.bind(this)
        this.sendWorkerChange = this.sendWorkerChange.bind(this)
        this.checkSettings = this.checkSettings.bind(this)
        this.handleNetworkMaskChange = this.handleNetworkMaskChange.bind(this)
        this.handleMissCounterChange = this.handleMissCounterChange.bind(this)
        this.handleSleepTimeMacChange = this.handleSleepTimeMacChange.bind(this)
        this.handleSleepTimeDBChange = this.handleSleepTimeDBChange.bind(this)
        this.sendSettings = this.sendSettings.bind(this)
    }

    componentDidMount() {
        this.checkWorkerStatus()
        this.checkSettings()
    }

    checkWorkerStatus() {
        // create a new XMLHttpRequest
        var xhr = new XMLHttpRequest()

        // get a callback when the server responds
        xhr.addEventListener('load', () => {
            // update the state of the component with the result here
            console.log(xhr.responseText)
            var data_obj = JSON.parse(xhr.responseText);
            if (data_obj["state"] === "running"){
                this.setState(state => ({
                    worker_status: true
                }));
            }
            else {
                this.setState(state => ({
                    worker_status: false
                }));
            }
        })
        // open the request with the verb and the url
        xhr.open('GET', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/workers_status')
        // send the request
        xhr.send()
    }

    checkSettings() {
        // create a new XMLHttpRequest
        var xhr = new XMLHttpRequest()

        // get a callback when the server responds
        xhr.addEventListener('load', () => {
            // update the state of the component with the result here
            console.log(xhr.responseText)
            var data_obj = JSON.parse(xhr.responseText);
            data_obj = data_obj["settings"]
            this.setState(state => ({
                sleep_time_db: data_obj["sleep_time_db"],
                network_mask: data_obj["network_mask"],
                sleep_time_mac: data_obj["sleep_time_mac"],
                max_miss_count: data_obj["max_miss_count"]
            }));

        })
        // open the request with the verb and the url
        xhr.open('GET', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/settings')
        // send the request
        xhr.send()
    }

    sendSettings() {
        // create a new XMLHttpRequest
        var xhr = new XMLHttpRequest()

        // get a callback when the server responds
        xhr.addEventListener('load', () => {
            // update the state of the component with the result here
            console.log(xhr.responseText)
            var data_obj = JSON.parse(xhr.responseText);
            data_obj = data_obj["settings"]
            this.setState(state => ({
                sleep_time_db: data_obj["sleep_time_db"],
                network_mask: data_obj["network_mask"],
                sleep_time_mac: data_obj["sleep_time_mac"],
                max_miss_count: data_obj["max_miss_count"]
            }));

        })

        const json_data = {
            "sleep_time_db": this.state.sleep_time_db,
            "network_mask": this.state.network_mask,
            "sleep_time_mac": this.state.sleep_time_mac,
            "max_miss_count": this.state.max_miss_count
        }

        // open the request with the verb and the url
        xhr.open('POST', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/settings')
        xhr.setRequestHeader('Content-Type', 'application/json');
        // send the request
        xhr.send(JSON.stringify(json_data))
    }

    sendWorkerChange(event) {
        // create a new XMLHttpRequest
        var xhr = new XMLHttpRequest()

        // get a callback when the server responds
        xhr.addEventListener('load', () => {
            // update the state of the component with the result here
            console.log(xhr.responseText)
            var data_obj = JSON.parse(xhr.responseText);
            if (data_obj["status"] === "success"){
                if (this.state.worker_status === false){
                    this.setState(state => ({
                        worker_status: true
                    }));
                }
                else {
                    this.setState(state => ({
                        worker_status: false
                    }));
                }
            }
        })
        if (this.state.worker_status === false){
            // open the request with the verb and the url
            xhr.open('GET', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/workers_start')
        }
        else {
            // open the request with the verb and the url
            xhr.open('GET', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/workers_stop')
        }
        // send the request
        xhr.send()
    }

    handleNetworkMaskChange(event) {
        const value = event.target.value || ""
        this.setState(state => ({
            network_mask: value
        }));
    }

    handleMissCounterChange(event) {
        const value = event.target.value || ""
        this.setState(state => ({
            max_miss_count: Number(value)
        }));
    }

    handleSleepTimeMacChange(event) {
        const value = event.target.value || ""
        this.setState(state => ({
            sleep_time_mac: Number(value)
        }));
    }

    handleSleepTimeDBChange(event) {
        const value = event.target.value || ""
        this.setState(state => ({
            sleep_time_db: Number(value)
        }));
    }

    render() {
        console.log("Network mask: " + this.state.network_mask)
        return  <Grid container className='MainContainer'>
            {/* Title */}
            <Title_HP/>

            {/* Menu */}
            <Menu_HP current_page={2}/>

            {/* Workers status slider */}
            <Grid container item xs={12} >
                <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                <Grid item xs={12} md={4}>
                    <Hidden only={['xs', 'sm']}>
                        {/* Button PC */}
                        <FormControlLabel
                            style={{color: 'var(--main-primary-color)', fontSize: '1.5vw'}}
                            control={
                                <Switch
                                    style={{color: 'var(--main-primary-color)'}}
                                    checked={this.state.worker_status}
                                    onChange={this.sendWorkerChange}
                                    value="checkedB"
                                    color="secondary"
                                />
                            }
                            label={ "Active mode: " + ((this.state.worker_status)? "ON": "OFF")}
                        />
                    </Hidden>
                    <Hidden only={['md', 'lg', 'xl']}>
                        {/* Button Mobile */}
                        <FormControlLabel
                            style={{color: 'var(--main-primary-color)', fontSize: '3vw'}}
                            control={
                                <Switch
                                    style={{color: 'var(--main-primary-color)'}}
                                    checked={this.state.worker_status}
                                    onChange={this.sendWorkerChange}
                                    value="checkedB"
                                    color="secondary"
                                />
                            }
                            label={ "Active mode: " + ((this.state.worker_status)? "ON": "OFF")}
                        />
                    </Hidden>
                </Grid>
                <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
            </Grid>

            {/* Settings part */}
            <Grid container item xs={12}>
                {/* Network mask */}
                <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        id="standard-full-width"
                        label="Network mask"
                        style={{color: "var(--main-primary-color)" }}
                        placeholder="Network mask"
                        fullWidth
                        margin="normal"
                        onChange={this.handleNetworkMaskChange}
                        value={this.state.network_mask}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>

                {/* Miss counter mac */}
                <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        id="standard-full-width"
                        label="MAC miss threshold"
                        style={{color: "var(--main-primary-color)" }}
                        placeholder="MAC miss threshold"
                        fullWidth
                        margin="normal"
                        type="number"
                        onChange={this.handleMissCounterChange}
                        value={this.state.max_miss_count}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>

                {/* MAC worker sleep time */}
                <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        id="standard-full-width"
                        label="MAC worker sleep time (s)"
                        style={{color: "var(--main-primary-color)" }}
                        placeholder="MAC worker sleep time (s)"
                        fullWidth
                        margin="normal"
                        type="number"
                        onChange={this.handleSleepTimeMacChange}
                        value={this.state.sleep_time_mac}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>

                {/* DB worker sleep time */}
                <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        id="standard-full-width"
                        label="Save worker sleep time (s)"
                        style={{color: "var(--main-primary-color)" }}
                        placeholder="Save worker sleep time (s)"
                        fullWidth
                        margin="normal"
                        type="number"
                        onChange={this.handleSleepTimeDBChange}
                        value={this.state.sleep_time_db}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>

                {/* Save button */}
                <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                <Grid item xs={12} md={4}>
                    <Hidden only={['xs', 'sm']}>
                        {/* Button PC */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)"}} onClick={ () => this.sendSettings()}>Save</Button>
                    </Hidden>
                    <Hidden only={['md', 'lg', 'xl']}>
                        {/* Button Mobile */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)"}} onClick={ () => this.sendSettings()}>Save</Button>
                    </Hidden>
                </Grid>
                <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
            </Grid>
        </Grid>
    }
}

export default MacDevice;