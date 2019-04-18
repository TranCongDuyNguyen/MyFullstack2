import React, { Component } from 'react'

import './CSS/LedStyle.css';

export default class Led extends Component {
    render() {
        const {customColor, customShadow} = this.props;
        return (
            <div style={{margin: "auto"}}>
                <div className="led-box">
                    <div className="led" 
                    style={{
                        margin: "0 auto",
                        backgroundColor: `${customColor}`,
                        borderRadius: "50%",
                        boxShadow: `${customShadow}`
                    }}></div>
                </div>
            </div >
        )
    }
}
