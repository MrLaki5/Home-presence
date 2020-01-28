import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AllDevicesTimeGraph from '../pages/AllDevicesTimeGraph';
import DevicesInTime from '../pages/DevicesInTime';
import MacDevice from '../pages/MacDevice'
import Settings from '../pages/Settings'

const my_router = (<Router>
                        <Switch>
                            <Route exact path="/" component={AllDevicesTimeGraph} />
                            <Route exact path="/specific_time" component={DevicesInTime} />
                            <Route exact path="/mac_device" component={MacDevice} />
                            <Route exact path="/settings" component={Settings} />
                        </Switch>
                    </Router>
                    )

export default function(){
    return my_router;
}