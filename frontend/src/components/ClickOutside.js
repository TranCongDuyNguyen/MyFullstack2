import  React, { Component } from 'react'
import classNames from 'classnames';
import io from 'socket.io-client';

export default class ClickOutside extends Component {
ref = React.createRef();
state = {
    isRev: false,
    isForw: false,
    isStop: false
}
onForw = () => {
    this.socket.emit("vCmdToPLC", "onForward");
    this.setState({
        isForw: true,
        isRev:false,
        isStop:false
    })
}
onStop = () => {
    this.socket.emit("vCmdToPLC", "onStop");
    this.setState({
        isForw:false,
        isStop:true,
        isRev:false
    })
}
onRev = () => {
    this.socket.emit("vCmdToPLC", "onReverse");
    this.setState({
        isForw:false,
        isStop:false,
        isRev:true
    })
}
handleClick = e => {
    if(this.node.contains(e.target)) {
        console.log('clicking inside!');
        return;
    }
    this.setState({
        isForw: false,
        isRev: false,
        isStop: false
    })
};

componentDidMount() {
    this.socket = io();
    document.addEventListener("mousedown", this.handleClick);
}

componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick);
    this.socket.disconnect();
        this.socket.on("connect_error", function (error) {
            console.log(error);
            this.socket.disconnect();
        })
}

  render() {
    let forClass = classNames({
        "btn-entry": true,
        forw: this.state.isForw
    })
    let revClass = classNames({
        "btn-entry": true,
        reve: this.state.isRev
    })
    let stopClass = classNames({
        "btn-entry": true,
        stop: this.state.isStop
    })
    return (
        <div ref={node => this.node = node}>
            <div className="btns">
                <div className={revClass} id="rev" onClick={this.onRev}><i className="fas fa-chevron-left"></i></div>
                <div className={stopClass} id="stop" onClick={this.onStop}><i className="fas fa-pause"></i></div>
                <div className={forClass} id="forw" onClick={this.onForw}><i className="fas fa-chevron-right"></i></div>
            </div>
        </div>
    );
  }
}
