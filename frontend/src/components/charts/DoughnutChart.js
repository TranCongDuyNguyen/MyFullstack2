import React, { Component } from 'react'
import {
    RadialBarChart,
    RadialBar,
    Cell
} from 'recharts';
import classNames from 'classnames';

import '../CSS/DoughnutChartStyle.css';

export default class DoughnutChart extends Component {

    CustomBar = () => {
        const { data, dataKey, fault, warn, flash } = this.props;
        let value = data[0][dataKey];
        if (value > warn && value <= fault) {
            return <Cell fill="#DD403A"></Cell>
        }
        else if (value > fault) {
            return flash ? <Cell fill="#D60000">  </Cell> : <Cell fill="#DD403A"></Cell>
        }
    }

    render() {
        let textClass = classNames({
            blink: this.props.flash,
            bigchar: this.props.sSize,
            smallchar: this.props.ssSize
        })
        const { data, dataKey, colorId, startGradColor, endGradColor, theUnit, fault } = this.props;
        return (
            <div className="dc" style={{height:"140px"}}>
                <div className="dc-tribtn-box">
                        <svg height="140" width="140">
                            <polygon points={this.props.triBtnPos}
                                    onClick={e => this.props.onAdjTriClick(e)}
                                    id={this.props.id} 
                                    className="dc-tribtn"
                                    style={{"fill": `${(data[0][dataKey]>(fault))?"red":`url(#${colorId})`}`}} />
                        </svg>
                </div>
                <div className="text">
                    <div className={textClass}>
                        <sup className="number">{data[0][dataKey].toString().slice(0, 4)}</sup>&frasl;
                        <sub className="under">{this.props.maxScale}</sub>
                    </div>
                    <div className="unitText">{theUnit}</div>
                </div>
                <RadialBarChart height={230}
                    width={230}
                    innerRadius="40%"
                    outerRadius="80%"
                    startAngle={180}
                    endAngle={0}
                    data={data}
                    barSize={180}
                    barCategoryGap={0}
                >
                    <defs>
                        <linearGradient id={colorId} x1="0%" y1="0%" x2="120%" y2="20%">
                            <stop offset="0%" stopColor={startGradColor} stopOpacity={data[0][dataKey] / (80*this.props.warn/100)} />
                            <stop offset="100%" stopColor={endGradColor} stopOpacity={data[0][dataKey] / (80*this.props.fault/100)} />
                        </linearGradient>
                    </defs>
                    
                    <svg height="230" width="230" x="0" y="0">
                        <path className="dc-background"d="M 61.2,115
                            A 53.8,53.8,0,
                            0,1,
                            168.8,115
                        L 158.9,115
                                    A 43.9,43.9,0,
                                    0,0,
            71.1,115 Z"  fill="#6969B3" />
                    </svg>
                    <RadialBar minAngle={15}
                        clockWise={true}
                        dataKey="refKey"
                        fill="#0000"
                    ></RadialBar>
                    <RadialBar minAngle={15}
                        clockWise={true}
                        dataKey={dataKey}
                        fill={`url(#${colorId})`}
                    >{this.CustomBar()}
                    </RadialBar>
            
                </RadialBarChart>
            </div>
        )
    }
}
