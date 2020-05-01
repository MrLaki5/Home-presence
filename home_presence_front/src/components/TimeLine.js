import React from 'react';


class TimeLine extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            time: false
        };
    }

    render() {
        return  <div>
                    {this.props.time.time}
                </div>
    }
}

export default TimeLine;