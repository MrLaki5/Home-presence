
import React from 'react';

import '../app.css'

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

function Title_HP(props) {
    return (
        <Grid item xs={12}>
            <Hidden only={['xs', 'sm']}>
                {/* Title PC */}
                <div className='Title'>
                    Home-Presence
                </div>
            </Hidden>
            <Hidden only={['md', 'lg', 'xl']}>
                {/* Title Mobile */}
                <div className='TitleMobile'>
                    Home-Presence
                </div>
            </Hidden>
        </Grid>
    );
}

export default Title_HP;