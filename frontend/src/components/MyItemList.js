import React, {Component} from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';


import {getItems, deleteItem} from '../actions/itemAction';

class MyItemList extends Component {

    componentDidMount(){
        this.props.getItems();
    }

    deleteSingleItem = id => {
        this.props.deleteItem(id);
    }

    render(){
        const { items } = this.props.item;
        return (<Container>
           
            <ListGroup>
                <TransitionGroup className = "item-list">
                   {items.map(( {_id, name} ) => (
                        <CSSTransition key={_id} timeout={500} classNames="fade">
                            <ListGroupItem>
                            <Button className = "remove-btn"
                                color = "danger"
                                size = "sm"
                                onClick = {() => {
                                    this.deleteSingleItem(_id);
                                }} 
                            >&times; {/*ampersand times semilocon which give "X" icon */}</Button>
                                {name}
                            </ListGroupItem>
                        </CSSTransition>
                   ))}
                </TransitionGroup>
            </ListGroup>
        </Container>)
    }
}

MyItemList.propTypes = {
    getItems: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    item: state.item
})

export default connect(mapStateToProps, {
    getItems, 
    deleteItem
})(MyItemList);