import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from '../pages/App';

const my_router = (<Router>
                        <Switch>
                            <Route exact path="/" component={App} />
                        </Switch>
                    </Router>
                    )

export default function(){
    return my_router;
}