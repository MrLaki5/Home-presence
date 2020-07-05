import React from 'react';
import { Redirect } from "react-router-dom";


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
                    redirect_link: "/search"
                }))
                break;
            case "2":
                this.setState(state => ({
                    should_redirect: true,
                    redirect_link: "/top_lists"
                }))
                break;
            case "3":
                this.setState(state => ({
                    should_redirect: true,
                    redirect_link: "/settings"
                }))
                break;
            case "4":
                if (!(localStorage.getItem("Token") === null)) {
                    localStorage.removeItem('Token');
                }
                this.setState(state => ({
                    should_redirect: true,
                    redirect_link: "/login"
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
            <Grid container item xs={12} style={{marginBottom: '3%'}}>
                <Grid item xs={(this.state.current_page === 1) ? 4 : 2}>
                    <Hidden only={['xs', 'sm']}>
                        {/* Button PC */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1.3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: (this.state.current_page === 1) ? 1 : 0.5}} onClick={ () => this.redirectFunction('1')}>Search</Button>
                    </Hidden>
                    <Hidden only={['md', 'lg', 'xl']}>
                        {/* Button Mobile */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: (this.state.current_page === 1) ? 1 : 0.5}} onClick={ () => this.redirectFunction('1')}>Search</Button>
                    </Hidden>
                </Grid>

                <Grid item xs={(this.state.current_page === 2) ? 4 : 2}>
                    <Hidden only={['xs', 'sm']}>
                        {/* Button PC */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1.3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: (this.state.current_page === 2) ? 1 : 0.5}} onClick={ () => this.redirectFunction('2')}>Top Lists</Button>
                    </Hidden>
                    <Hidden only={['md', 'lg', 'xl']}>
                        {/* Button Mobile */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: (this.state.current_page === 2) ? 1 : 0.5}} onClick={ () => this.redirectFunction('2')}>Top Lists</Button>
                    </Hidden>
                </Grid>

                <Grid item xs={(this.state.current_page === 0) ? 4 : 2}>
                    <Hidden only={['xs', 'sm']}>
                        {/* Button PC */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1.3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: (this.state.current_page === 0) ? 1 : 0.5}} onClick={ () => this.redirectFunction('0')}>All</Button>
                    </Hidden>
                    <Hidden only={['md', 'lg', 'xl']}>
                        {/* Button Mobile */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: (this.state.current_page === 0) ? 1 : 0.5}} onClick={ () => this.redirectFunction('0')}>All</Button>
                    </Hidden>
                </Grid>

                <Grid item xs={(this.state.current_page === 3) ? 4 : 2}>
                    <Hidden only={['xs', 'sm']}>
                        {/* Button PC */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1.3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: (this.state.current_page === 3) ? 1 : 0.5}} onClick={ () => this.redirectFunction('3')}>Settings</Button>
                    </Hidden>
                    <Hidden only={['md', 'lg', 'xl']}>
                        {/* Button Mobile */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: (this.state.current_page === 3) ? 1 : 0.5}} onClick={ () => this.redirectFunction('3')}>Settings</Button>
                    </Hidden>
                </Grid>

                <Grid item xs={(this.state.current_page === 4) ? 4 : 2}>
                    <Hidden only={['xs', 'sm']}>
                        {/* Button PC */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '1.3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: (this.state.current_page === 4) ? 1 : 0.5}} onClick={ () => this.redirectFunction('4')}>Logout</Button>
                    </Hidden>
                    <Hidden only={['md', 'lg', 'xl']}>
                        {/* Button Mobile */}
                        <Button size='small' disableRipple={true} fullWidth style={{fontSize: '3vw', fontFamily: 'Collegia', borderRadius: '0%', color: "var(--main-bg-color)", backgroundColor: "var(--main-primary-color)", opacity: (this.state.current_page === 4) ? 1 : 0.5}} onClick={ () => this.redirectFunction('4')}>Logout</Button>
                    </Hidden>
                </Grid>
            </Grid>
        );
    }
}

export default Menu_HP;