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
        const { data, dataKey, threshold, offset, flash } = this.props;
        console.log(flash);
        let value = data[0][dataKey];
        if (value > threshold && value <= threshold + offset) {
            return <Cell fill="#DD403A"></Cell>
        }
        else if (value > threshold + offset) {
            return flash ? <Cell fill="#D60000">  </Cell> : <Cell fill="#DD403A"></Cell>
        }
    }

    render() {
        let textClass = classNames({
            blink: this.props.flash
        })
        const { data, dataKey, colorId, startGradColor, endGradColor, theUnit, threshold, offset } = this.props;
        return (
            <div className="dc" style={{height:"140px"}}>
                <div className="text">
                    <div className={textClass}>
                        <sup className="number">{data[0][dataKey].toString().slice(0, 4)}</sup>&frasl;
                        <sub className="under">100</sub>
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
                            <stop offset="0%" stopColor={startGradColor} stopOpacity={data[0][dataKey] / 40} />
                            <stop offset="100%" stopColor={endGradColor} stopOpacity={data[0][dataKey] / 80} />
                        </linearGradient>
                    </defs>
                    
                    <svg height="230" width="230" x="0" y="0">
                        <path d="M 61.2,115
                            A 53.8,53.8,0,
                            0,1,
                            168.8,115
                        L 158.9,115
                                    A 43.9,43.9,0,
                                    0,0,
            71.1,115 Z"  fill="#6969B3" />
                    </svg>
                    <svg height="60" width="60" x="140" y="28">
                        <g transform="rotate(50)">
                        <polygon points="50,10 60,10 55,20" 
                                style={{"fill": `${(data[0][dataKey]>(threshold+offset))?"red":"lime"}`}} />
                        Sorry, your browser does not support inline SVG.
                        </g>
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
