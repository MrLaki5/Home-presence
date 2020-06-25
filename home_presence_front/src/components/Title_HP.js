
import React from 'react';


import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

function Title_HP(props) {
    return (
        <Grid item container xs={12}>
            <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
            <Grid item xs={12} md={4}>
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
            <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>

            <Grid item xs={12} md={4} className="VersionContainer">
                <Hidden only={['xs', 'sm']}>
                    {/* Title PC */}
                    <div className='TitleVersion'>
                        MrLaki5 v{process.env.REACT_APP_VERSION}
                    </div>
                </Hidden>
                <Hidden only={['md', 'lg', 'xl']}>
                    {/* Title Mobile */}
                    <div className='TitleVersionMobile'>
                        MrLaki5 v{process.env.REACT_APP_VERSION}
                    </div>
                </Hidden>
            </Grid>
            <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
            <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
        </Grid>
    );
}

export default Title_HP;