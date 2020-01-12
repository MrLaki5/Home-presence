import React from 'react';
import { VictoryChart, VictoryAxis, VictoryBar } from 'victory';

class Graph extends React.Component {

    render(){
        var devices = []
        for (var i = (this.props.devices_num.length - 1); i >= 0 ; i--) {
            devices.push({
                x: this.props.devices_num[i]["time"],
                y: this.props.devices_num[i]["count"],
                label: ""
            })
        }
        return (
            <div>
                <VictoryChart
                    style={{parent: {backgroundColor: "#FFFFFF"}}}
                    domainPadding={20}
                >
                    <VictoryBar
                        style={{ data: { stroke: "#000000" } }}
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
                        tickFormat={(x) => (String(x).split(" ")[0] + "\n" + String(x).split(" ")[1])}
                        style={{
                            tickLabels: {fill: 'black', fontSize: 7, angle: -40},
                            axis: {stroke: "#000000"},
                            labels: {fill: 'black', fontSize: 10},
                            grid: {stroke: "#000000"}
                        }}
                    />
                    <VictoryAxis
                        dependentAxis
                        //domain={[0, max_num]}
                        minDomain={0}
                        //tickValues={[0, 25, 50, 75, 100]}
                        label="Number"
                        style={{
                            tickLabels: {fill: '#000000', fontSize: 8},
                            axis: {stroke: "#000000"},
                            axisLabel: {fill: '#000000', fontSize: 9},
                            grid: {stroke: "#000000"}
                        }}
                    />
                </VictoryChart>
                <div>

                </div>
            </div>
        );
    }
}

export default Graph;