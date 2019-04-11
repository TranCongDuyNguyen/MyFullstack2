import React, { Component } from 'react'

import './CSS/WarnItemStyle.css';

export default class WarnItem extends Component {

  render() {
    const {notiId, type, warnTime, warnMsg} = this.props;
    return (
      <div className="warn-item">
        <div>{notiId}</div>
        <div>{type}</div>
        <div>{warnTime}</div>
        <div>{warnMsg}</div>
      </div>
    )
  }
}
