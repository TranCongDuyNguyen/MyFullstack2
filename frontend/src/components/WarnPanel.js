import React, { Component } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

import WarnItem from './WarnItem';
import Pagination from './Pagination';
import './CSS/WarnPanelStyle.css';
let length = 0;
export default class WarnPanel extends Component {
    state = {
        allNoties: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
            , {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
            , {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
            , {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
            , {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        currentNoties: [],
        currentPage: null,
        totalPages: null,
        isDangerFilting: false,
        isWarnFilting: false,
        isAllFilting: true
    }

    componentWillUnmount() {
        this.socket.disconnect();
        this.socket.on("connect_error", function (error) {
            console.log(error);
            this.socket.disconnect();
        })
    };
    onPageChanged = data => {
        const { currentPage, totalPages, pageLimit } = data;
        axios.get(`/api/monitorNoties/${this.props.reqId}?page=${currentPage}&limit=${pageLimit}`)
        .then(res => {
            const currentNoties = res.data.noties;
            length = res.data.length;
            this.setState({
                currentPage,
                currentNoties,
                totalPages
            });
        }).catch(err => console.log(err));
    }
    onClickFiltDanger = () => {
        this.setState({
            isDangerFilting: true,
            isWarnFilting: false,
            isAllFilting: false
        })
    }
    onClickFiltWarn = () => {
        this.setState({
            isDangerFilting: false,
            isWarnFilting: true,
            isAllFilting: false
        })
    }
    onClickFiltAll = () => {
        this.setState({
            isDangerFilting: false,
            isWarnFilting: false,
            isAllFilting: true
        })
    }
    
    render() {
        const { currentPage, totalPages, currentNoties, allNoties, isDangerFilting, isWarnFilting, isAllFilting } = this.state;
        const totalNoties = allNoties.length;
        return (
            <div className="warn-panel">
                <div className="warn-panel-header">
                    <span className="title">Alarm List</span>
                    <span className="class-title">Select: </span>
                    <span className="fault-filt-btn" onClick={this.onClickFiltDanger}>
                        <i className="fas fa-exclamation" ></i>
                    </span>
                    <span className="warn-filt-btn" onClick={this.onClickFiltWarn}>
                        <i className="fas fa-bell" ></i>
                    </span>
                    <span className="all-filt-btn" onClick={this.onClickFiltAll}>
                        <i className="far fa-eye" ></i>
                    </span>
                    <span className="warn-amount">{`Alarms: ${length}`}</span>
                    <span className="current-page">
                        Page <span className="font-weight-bold">{currentPage}</span> / <span className="font-weight-bold">{totalPages}</span>
                    </span>
                </div>
                <div className="warn-panel-subheader">
                    <div>ID</div>
                    <div>Type</div>
                    <div>Time</div>
                    <div>Message</div>
                </div>
                <div className="warn-panel-content">
                    <div className="scrollbar" id="style-1">
                        {isAllFilting && <div className="inner">
                            {currentNoties.map((noti, index) => <WarnItem key={index} notiId={noti.notiId}
                                type={noti.type}
                                warnTime={noti.warnTime}
                                warnMsg={noti.warnMsg} />)}
                        </div>}
                        {isDangerFilting && <div className="inner">
                            {(currentNoties.filter((noti, index) => noti.type === "Danger")).map((noti, index) => <WarnItem key={index} notiId={noti.notiId}
                                type={noti.type}
                                warnTime={noti.warnTime}
                                warnMsg={noti.warnMsg} />)}
                        </div>}
                        {isWarnFilting && <div className="inner">
                            {(currentNoties.filter((noti, index) => noti.type === "Warning")).map((noti, index) => <WarnItem key={index} notiId={noti.notiId}
                                type={noti.type}
                                warnTime={noti.warnTime}
                                warnMsg={noti.warnMsg} />)}
                        </div>}

                        <div className="force-overflow"></div>
                    </div>


                </div>
                <Pagination totalItems={totalNoties} pageLimit={20} pageNeighbours={1} onPageChanged={this.onPageChanged} />
            </div>
        )
    }


}
