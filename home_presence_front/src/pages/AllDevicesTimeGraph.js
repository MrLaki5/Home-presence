import React from 'react';

import Graph from '../components/Graph'
import Menu_HP from '../components/Menu_HP'
import Title_HP from '../components/Title_HP'
import '../app.css'
import { Redirect } from "react-router-dom";

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Slider from '@material-ui/core/Slider';


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            devices: [],
            top_val: 10,
            top_val_cur: 10,
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
        this.handleTopVal = this.handleTopVal.bind(this)
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

    handleTopVal(event, value){
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.setState(state => ({
            top_val_cur: value
        }));
        this.timeout = setTimeout(() => {
            this.setState(state => ({
                top_val: value
            })
            , () => this.getData());
        }, 500);
    }

    render() {
        if (this.state.go_settings) {
            return <Redirect to={{
                pathname: "/settings"
            }}/>;
        }
        return (
            <Grid container className='MainContainer'>
                
                {/* Title */}
                <Title_HP/>


                {/* Menu */}
                <Menu_HP current_page={0}/>
                
                
                {/* Time Group */}
                <Grid container item xs={12}>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                    <Grid item xs={3} md={1}>
                        <Hidden only={['xs', 'sm']}>
                            {/* Button PC */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1.5vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._1h_opacity}} onClick={ () => this.handleClickTime('1h')}>Hour</Button>
                        </Hidden>
                        <Hidden only={['md', 'lg', 'xl']}>
                            {/* Button Mobile */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._1h_opacity}} onClick={ () => this.handleClickTime('1h')}>Hour</Button>
                        </Hidden>
                    </Grid>
                    <Grid item xs={3} md={1}>
                        <Hidden only={['xs', 'sm']}>
                            {/* Button PC */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1.5vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._24h_opacity}} onClick={() => this.handleClickTime('24h')}>Day</Button>
                        </Hidden>
                        <Hidden only={['md', 'lg', 'xl']}>
                            {/* Button Mobile */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._24h_opacity}} onClick={() => this.handleClickTime('24h')}>Day</Button>
                        </Hidden>
                    </Grid>
                    <Grid item xs={3} md={1}>
                        <Hidden only={['xs', 'sm']}>
                            {/* Button PC */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1.5vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._1m_opacity}} onClick={() => this.handleClickTime('1m')}>Month</Button>
                        </Hidden>
                        <Hidden only={['md', 'lg', 'xl']}>
                            {/* Button Mobile */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._1m_opacity}} onClick={() => this.handleClickTime('1m')}>Month</Button>
                        </Hidden>
                    </Grid>
                    <Grid item xs={3} md={1}>
                        <Hidden only={['xs', 'sm']}>
                            {/* Button PC */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1.5vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._1y_opacity}} onClick={() => this.handleClickTime('1y')}>Year</Button>
                        </Hidden>
                        <Hidden only={['md', 'lg', 'xl']}>
                            {/* Button Mobile */}
                            <Button size='small' disableRipple={true} fullWidth style={{fontSize: '3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: this.state._1y_opacity}} onClick={() => this.handleClickTime('1y')}>Year</Button>
                        </Hidden>
                    </Grid>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                </Grid>

                {/* Samples */}
                <Grid container item xs={12}>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                    <Grid item xs={12} md={4}>
                        <Slider
                            style={{color: 'var(--main-primary-color)', opacity: '0.7'}}
                            value={this.state.top_val_cur}
                            valueLabelDisplay="off"
                            onChange={this.handleTopVal}
                            min={1}
                            max={20}
                            aria-labelledby="discrete-slider-always"
                        />
                        <Hidden only={['xs', 'sm']}>
                            {/* Title PC */}
                            <div className='TextForm'>
                                Samples: {this.state.top_val_cur}
                            </div>
                        </Hidden>
                        <Hidden only={['md', 'lg', 'xl']}>
                            {/* Title Mobile */}
                            <div className='TextFormMobile'>
                                Samples: {this.state.top_val_cur}
                            </div>
                        </Hidden>
                    </Grid>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                </Grid>

                {/* Settings */}
                <Grid item xs={12}>
                    <a onClick={this.goSettings}> Settings </a>
                </Grid>

                {/* Graph */}
                <Grid item xs={12}>
                    <Graph devices_num={this.state.devices} time_group={this.state.time}/>
                </Grid>

            </Grid>
        );
    }
}

export default App;
