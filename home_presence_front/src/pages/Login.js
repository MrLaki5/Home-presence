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


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            password: "",
            login_approved: false
        };
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
    }

    componentDidMount() {}

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

    sendLogin(event) {
        // create a new XMLHttpRequest
        var xhr = new XMLHttpRequest()

        // get a callback when the server responds
        xhr.addEventListener('load', () => {
            // update the state of the component with the result here
            console.log(xhr.responseText)
            var data_obj = JSON.parse(xhr.responseText);
            if (data_obj["status"] === "success"){
                if (data_obj.hasOwnProperty('auth_token')){
                    localStorage.setItem('Token', data_obj['auth_token']);
                    this.setState(state => ({
                        login_approved: true
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




    handlePasswordChange(event) {
        const value = event.target.value || ""
        this.setState(state => ({
            password: value
        }));
    }

    render() {
        return  <Grid container className='MainContainer'>
            {/* Title */}
            <Title_HP/>

            {/* Login part */}
            <Grid container item xs={12} style={{marginBottom: '3%'}}>
                {/* Password */}
                <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        id="standard-full-width"
                        label="Password"
                        style={{color: "var(--main-primary-color)" }}
                        placeholder="Password"
                        fullWidth
                        margin="normal"
                        onChange={this.handlePasswordChange}
                        value={this.state.password}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>

                {/* Login button */}
                <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                <Grid item xs={12} md={4}>
                    <Hidden only={['xs', 'sm']}>
                        {/* Button PC */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)"}} onClick={ () => this.sendLogin()}>Login</Button>
                    </Hidden>
                    <Hidden only={['md', 'lg', 'xl']}>
                        {/* Button Mobile */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)"}} onClick={ () => this.sendLogin()}>Login</Button>
                    </Hidden>
                </Grid>
                <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
            </Grid>

        </Grid>
    }
}

export default Login;