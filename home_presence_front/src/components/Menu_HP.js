import React from 'react';
import { Redirect } from "react-router-dom";

import '../app.css'

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';

class Menu_HP extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            current_page: this.props.current_page,
            should_redirect: false,
            redirect_link: ""
        };
        console.log("Current page: " + this.state.current_page)
        this.redirectFunction = this.redirectFunction.bind(this)
    }

    redirectFunction(num) {
        if (num === this.state.current_page.toString()){
            return;
        }
        switch(num){
            case "0":
                this.setState(state => ({
                    should_redirect: true,
                    redirect_link: "/"
                }))
                break;
            case "1":
                this.setState(state => ({
                    should_redirect: true,
                    redirect_link: "/"
                }))
                break;
            case "2":
                this.setState(state => ({
                    should_redirect: true,
                    redirect_link: "/settings"
                }))
                break;
        }
    }

    render(){
        if (this.state.should_redirect){
            return <Redirect to={{
                pathname: this.state.redirect_link,
            }}/>;
        }
        return (
            <Grid container item xs={12}>
                <Grid item xs={4}>
                    <Hidden only={['xs', 'sm']}>
                        {/* Button PC */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1.5vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: (this.state.current_page === 0) ? 1 : 0.5}} onClick={ () => this.redirectFunction('0')}>All</Button>
                    </Hidden>
                    <Hidden only={['md', 'lg', 'xl']}>
                        {/* Button Mobile */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: (this.state.current_page === 0) ? 1 : 0.5}} onClick={ () => this.redirectFunction('0')}>All</Button>
                    </Hidden>
                </Grid>

                <Grid item xs={4}>
                    <Hidden only={['xs', 'sm']}>
                        {/* Button PC */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1.5vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: (this.state.current_page === 1) ? 1 : 0.5}} onClick={ () => this.redirectFunction('1')}>Search</Button>
                    </Hidden>
                    <Hidden only={['md', 'lg', 'xl']}>
                        {/* Button Mobile */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: (this.state.current_page === 1) ? 1 : 0.5}} onClick={ () => this.redirectFunction('1')}>Search</Button>
                    </Hidden>
                </Grid>

                <Grid item xs={4}>
                    <Hidden only={['xs', 'sm']}>
                        {/* Button PC */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1.5vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: (this.state.current_page === 2) ? 1 : 0.5}} onClick={ () => this.redirectFunction('2')}>Settings</Button>
                    </Hidden>
                    <Hidden only={['md', 'lg', 'xl']}>
                        {/* Button Mobile */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: (this.state.current_page === 2) ? 1 : 0.5}} onClick={ () => this.redirectFunction('2')}>Settings</Button>
                    </Hidden>
                </Grid>
            </Grid>
        );
    }
}

export default Menu_HP;