import React from 'react';

import Graph from '../components/Graph'
import '../app.css'
import { Redirect } from "react-router-dom";

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            devices: [],
            top_val: 10,
            time: "hour",
            go_settings: false,
            _1h_opacity: 1,
            _24h_opacity: 0.5,
            _1m_opacity: 0.5,
            _1y_opacity: 0.5
        };
        this.getData = this.getData.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSelectTimeChange = this.handleSelectTimeChange.bind(this)
        this.goSettings = this.goSettings.bind(this)
        this.handleClickTime = this.handleClickTime.bind(this)
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
                devices: data_obj.mac_logs
            }));
        })
        var params = "?top=" + this.state.top_val + "&time_group=" + this.state.time
        console.log(params)
        // open the request with the verb and the url
        xhr.open('GET', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/num_logs' + params)
        // send the request
        xhr.send()
    }

    handleInputChange(event) {
        this.setState({top_val: event.target.value}, () => this.getData());
    }

    handleSelectTimeChange(event){
        this.setState({time: event.target.value}, () => this.getData());
    }

    goSettings(event) {
        this.setState(state => ({
            go_settings: true
        }));
    }

    handleClickTime(time_clk) {
        switch(time_clk){
            case "1h":
                this.setState(state => ({
                    _1h_opacity: 1,
                    _24h_opacity: 0.5,
                    _1m_opacity: 0.5,
                    _1y_opacity: 0.5,
                    time: "hour"
                })
                , () => this.getData());
                break;
            case "24h":
                this.setState(state => ({
                    _1h_opacity: 0.5,
                    _24h_opacity: 1,
                    _1m_opacity: 0.5,
                    _1y_opacity: 0.5,
                    time: "day"
                })
                , () => this.getData());
                break;
            case "1m":
                this.setState(state => ({
                    _1h_opacity: 0.5,
                    _24h_opacity: 0.5,
                    _1m_opacity: 1,
                    _1y_opacity: 0.5,
                    time: "month"
                })
                , () => this.getData());
                break;
            case "1y":
                this.setState(state => ({
                    _1h_opacity: 0.5,
                    _24h_opacity: 0.5,
                    _1m_opacity: 0.5,
                    _1y_opacity: 1,
                    time: "year"
                })
                , () => this.getData());
                break;
            default:
                break;
        }
    }

    render() {
        if (this.state.go_settings) {
            return <Redirect to={{
                pathname: "/settings"
            }}/>;
        }
        return (
            <div>
                <Grid container className='MainContainer'>

                    <Grid item xs={12} >
                        <Hidden only={['xs', 'sm']}>
                            {/* Title PC */}
                            <div className='Title'>
                                Home-Presence
                            </div>
                        </Hidden>
                        <Hidden only={['md', 'xl']}>
                            {/* Title Mobile */}
                            <div className='TitleMobile'>
                                Home-Presence
                            </div>
                        </Hidden>
                    </Grid>
                        
                    <Grid container item xs={12}>
                        <Grid item only={['md', 'xl']} md={4}></Grid>
                        <Grid item xs={3} md={1}>
                            <Hidden only={['xs', 'sm']}>
                                {/* Button PC */}
                                <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1.5vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._1h_opacity}} onClick={ () => this.handleClickTime('1h')}>Hour</Button>
                            </Hidden>
                            <Hidden only={['md', 'xl']}>
                                {/* Button Mobile */}
                                <Button size='small' disableRipple={true} fullWidth style={{fontSize: '3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._1h_opacity}} onClick={ () => this.handleClickTime('1h')}>Hour</Button>
                            </Hidden>
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1.5vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._1h_opacity}} onClick={ () => this.handleClickTime('1h')}>Hour</Button>
                        </Grid>
                        <Grid item xs={3} md={1}>
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1.5vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._24h_opacity}} onClick={() => this.handleClickTime('24h')}>Day</Button>
                        </Grid>
                        <Grid item xs={3} md={1}>
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1.5vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._1m_opacity}} onClick={() => this.handleClickTime('1m')}>Month</Button>
                        </Grid>
                        <Grid item xs={3} md={1}>
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1.5vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._1y_opacity}} onClick={() => this.handleClickTime('1y')}>Year</Button>
                        </Grid>
                        <Grid item only={['md', 'xl']} md={4}></Grid>
                    </Grid>

                </Grid>
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={this.state.top_val}
                    onChange={this.handleInputChange}
                />
                <select
                    value={this.state.time}
                    onChange={this.handleSelectTimeChange}
                >
                  <option value="hour">Hour</option>
                  <option value="day">Day</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
                <a onClick={this.goSettings}> Settings </a>
                <Graph devices_num={this.state.devices} time_group={this.state.time}/>
            </div>
        );
    }
}

export default App;
