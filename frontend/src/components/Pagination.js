import React, { Component, Fragment } from 'react'

import './CSS/PaginationStyle.css';

const LEFT_PAGE = 'left';
const RIGHT_PAGE = 'right';
//method for creating a range of numbers
const range = (from, to, step = 1) => {
    let i = from;
    const range = [];
    while (i <= to) {
        range.push(i);
        i += step;
    }
    return range;
}

export default class Pagination extends Component {
    constructor(props) {
        super(props);
        const { totalItems = null, pageLimit = 20, pageNeighbours = 0 } = props;
        this.pageLimit = typeof pageLimit === 'number' ? pageLimit : 20;
        this.totalItems = typeof totalItems === 'number' ? totalItems : 0;
        // page neighbours can be 0, 1 vs 2
        this.pageNeighbours = typeof pageNeighbours === 'number' ? Math.max(0, Math.min(pageNeighbours, 2)) : 0;
        this.totalPages = Math.ceil(this.totalItems / this.pageLimit);
        this.state = {
            currentPage: 1
        };
    };
    componentDidMount() {
        this.gotoPage(1);
    }
    fetchPageNumbers = () => {
        const currentPage = this.state.currentPage;
        const totalPages = this.totalPages;
        const pageNeighbours = this.pageNeighbours;
        const totalNumbers = (this.pageNeighbours * 2) + 3;
        const totalBlocks = totalNumbers + 2;
        if (totalPages > totalBlocks) {
            const startPage = Math.max(2, currentPage - pageNeighbours);
            const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
            let pages = range(startPage, endPage); //
            const hasLeftSpill = startPage > 2;
            const hasRightSpill = (totalPages - endPage) > 1;
            const spillOffSet = totalNumbers - (pages.length + 1);
            switch (true) {
                case (hasLeftSpill && !hasRightSpill): {
                    const extraPages = range(startPage - spillOffSet, startPage - 1);
                    pages = [LEFT_PAGE, ...extraPages, ...pages];
                    break;
                }
                case (!hasLeftSpill && hasRightSpill): {
                    const extraPages = range(endPage + 1, endPage + spillOffSet);
                    pages = [...pages, ...extraPages, RIGHT_PAGE];
                    break;
                }
                case (hasLeftSpill && hasRightSpill):
                default: {
                    pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
                    break;
                }
            }
            return [1, ...pages, totalPages];
        }
        return range(1, totalPages);
    };

    gotoPage = (page) => {
        const { onPageChanged = f => f } = this.props;

        const currentPage = Math.max(0, Math.min(page, this.totalPages));

        const paginationData = {
            currentPage,
            totalPages: this.totalPages,
            pageLimit: this.pageLimit,
            totalItems: this.totalItems
        };
        this.setState({ currentPage }, () => onPageChanged(paginationData));
    }
    handleClick = page => e => {
        e.preventDefault();
        this.gotoPage(page);
    }

    handleMoveLeft = e => {
        e.preventDefault();
        this.gotoPage(this.state.currentPage - (this.pageNeighbours * 2) - 1);
    }

    handleMoveRight = e => {
        e.preventDefault();
        this.gotoPage(this.state.currentPage + (this.pageNeighbours * 2) + 1);
    }


    render() {
        const { currentPage } = this.state;
        const pages = this.fetchPageNumbers();
        return (
            <Fragment>
                <nav>
                    <ul className="pagination">
                        {pages.map((page, index) => {
                            if (page === LEFT_PAGE) return (
                                <li key={index} className="page-item">
                                    <a className="page-link" href="#" onClick={this.handleMoveLeft}>
                                        <span >&laquo;</span>
                                        <span className="sr-only">Previous</span>
                                    </a>
                                </li>
                            );

                            if (page === RIGHT_PAGE) return (
                                <li key={index} className="page-item">
                                    <a className="page-link" href="#" onClick={this.handleMoveRight}>
                                        <span >&raquo;</span>
                                        <span className="sr-only">Next</span>
                                    </a>
                                </li>
                            );

                            return (
                                <li key={index} className={`page-item${currentPage === page ? ' active' : ''}`}>
                                    <a className="page-link" href="#" onClick={this.handleClick(page)}>{page}</a>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </Fragment>
        )
    }
}
