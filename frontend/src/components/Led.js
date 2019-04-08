import React, { Component } from 'react'

import './CSS/LedStyle.css';

export default class Led extends Component {
    render() {
        const {customColor, customShadow, customShadowOfText} = this.props;
        return (
            <div className="container-box">
                <div className="led-box">
                    <div className="led" 
                    style={{
                        margin: "0 auto",
                        backgroundColor: `${customColor}`,
                        borderRadius: "50%",
                        boxShadow: `${customShadow}`
                    }}></div>
                
                    <p style={{boxShadow: `${customShadowOfText}`}}>{this.props.children}</p>
                </div>
            </div >
        )
    }
}
