import React from 'react';
import { VictoryChart, VictoryAxis, VictoryBar } from 'victory';
import { Redirect } from "react-router-dom";

import '../app.css'

class Graph extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            should_redirect: false,
            redirect_arg: ""
        };
    }

    render(){
        if (this.state.should_redirect){
            return <Redirect to={{
                pathname: "/specific_time",
                state: {
                    time: this.state.redirect_arg,
                    time_group: this.props.time_group
                }
            }}/>;
        }
        var devices = []
        for (var i = (this.props.devices_num.length - 1); i >= 0 ; i--) {
            devices.push({
                x: this.props.devices_num[i]["time"],
                y: this.props.devices_num[i]["count"],
                label: ""
            })
        }
        var labelYFunction = (x) => (x)
        if (devices.length === 0) {
            labelYFunction = (x) => ("")
        }
        return (
            <div>
                <VictoryChart
                    style={{parent: {backgroundColor: "var(--main-bg-color)"}}}
                    domainPadding={20}
                >
                    <VictoryBar
                        style={{ data: { stroke: "var(--main-primary-color)", fill: "var(--main-primary-color)", cursor: "pointer" }}}
                        data={devices}
                        events={[
                            {
                                target: "data",
                                eventHandlers: {
                                    onClick: () => {
                                        return [{
                                            target: "labels",
                                            mutation: (props) => {
                                                console.log(props.data[props.index].x)
                                                this.setState(state => ({
                                                    should_redirect: true,
                                                    redirect_arg: props.data[props.index].x
                                                }));
                                                return props.text
                                            }
                                        }];
                                    }
                                }
                            }
                        ]}
                    />
                    <VictoryAxis
                        label=""
                        tickFormat={(x) => ((devices.length === 0) ? "" :
                        String(x).split(" ")[0] + "\n" + String(x).split(" ")[1])}
                        style={{
                            tickLabels: {fill: 'var(--main-primary-color)', fontSize: 7, angle: -40, fontFamilly: 'Collegia'},
                            axis: {stroke: "var(--main-primary-color)"},
                            labels: {fill: 'var(--main-primary-color)', fontSize: 10, fontFamilly: 'Collegia'},
                            grid: {stroke: "var(--main-primary-color)"}
                        }}
                    />
                    <VictoryAxis
                        dependentAxis
                        //domain={[0, max_num]}
                        minDomain={0}
                        //tickValues={[0, 25, 50, 75, 100]}
                        tickFormat = {labelYFunction}
                        label="Number"
                        style={{
                            tickLabels: {fill: 'var(--main-primary-color)', fontSize: 8, fontFamilly: 'Collegia'},
                            axis: {stroke: "var(--main-primary-color)"},
                            axisLabel: {fill: 'var(--main-primary-color)', fontSize: 9, fontFamilly: 'Collegia'},
                            grid: {stroke: "var(--main-primary-color)"}
                        }}
                    />
                </VictoryChart>
            </div>
        );
    }
}

export default Graph;