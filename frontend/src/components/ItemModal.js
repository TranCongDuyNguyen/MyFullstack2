import React, {Component} from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';


import { addItem } from '../actions/itemAction';

class ItemModal extends Component {
    state = {
        modal: false,
        name: ''
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = (e) => {
        e.preventDefault();

        const newItem = {
            name: this.state.name
        }

        this.props.addItem(newItem) //Brad pass an obj here

        this.toggle();
    }
    debugger
    render() {
        return <div>
            <Button
                    color="dark"
                    style={{marginBottom: '2rem'}}
                    onClick={this.toggle}>
                Add Item
            </Button>
            <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add To Item List</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup> {/*replace for <div> instead*/}
                                <Label for="item">Item</Label>
                                <Input  
                                        type="text"
                                        name="name"
                                        id="item"
                                        placeholder="Add item please"
                                        onChange={this.onChange}>
                                </Input>
                                <Button
                                        color="dark"
                                        style={{marginTop: '2rem'}}
                                        block>
                                    Add
                                </Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
            </Modal>

        </div>
    }
}

ItemModal.propTypes = {
    addItem: PropTypes.func.isRequired,// to prevent product displayed when not authenticated
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {addItem})(ItemModal);