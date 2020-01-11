import React from 'react';
import { VictoryChart, VictoryAxis, VictoryLine, VictoryLegend } from 'victory';

class Graph extends React.Component {

    render(){
        var devices = []
        for (var i = (this.props.devices_num.length - 1); i >= 0 ; i--) {
            devices.push({x: this.props.devices_num[i]["time"], y: this.props.devices_num[i]["count"]})
        }
        return (
            <div>
                <VictoryChart
                    style={{parent: {backgroundColor: "#FFFFFF"}}}
                >
                    <VictoryLine
                        style={{ data: { stroke: "#000000" } }}
                        data={devices}
                    />
                    <VictoryAxis
                        label="Time"
                        tickFormat={(temp) => ""}
                        width={180}
                        style={{
                            tickLabels: {fill: 'black', fontSize: 10},
                            axis: {stroke: "#FFFFFF"},
                            labels: {fill: 'black', fontSize: 10}
                        }}
                    />
                    <VictoryAxis
                        dependentAxis
                        //domain={[0, 100]}
                        //tickValues={[0, 25, 50, 75, 100]}
                        label="Number"
                        style={{
                            tickLabels: {fill: '#000000', fontSize: 8},
                            axis: {stroke: "#FFFFFF"},
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