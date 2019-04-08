import React, {Component} from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    FormText,
    Label,
    NavLink
} from 'reactstrap';
import classNames from 'classnames';

import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {register} from '../../actions/authAction';
import {clearErrors} from '../../actions/errorAction';
import '../CSS/InputStyle.css';
import AlertIcon from '../.././images/alert-login.svg';

let isTextChange = false;

class RegisterModal extends Component {
    state = {
        modal: false,
        name: '',
        email: '',
        password: '',
        errors: {}
    }

    componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props;
        if(error !== prevProps.error){
            isTextChange = false;
            // Check for register error
            if(error.id === 'REGISTER_FAIL')
             this.setState({errors: error.msgs})
            else 
            this.setState({ errors: {} });
        }

        //If authenticated, close modal
        if (this.state.modal) {
            if(isAuthenticated) {
                this.toggle();
            };
        };

    }

    toggle = () => {
        // Clear errors
        this.props.clearErrors();
        this.setState({
            modal: !this.state.modal
        })
    }

    onChange = (e) => {
        isTextChange = true;
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = (e) => {
        e.preventDefault();

        //Create user obj
        const { name, email, password } = this.state;
        const newUser = { name, email, password };
        //Attempt to register
        this.props.register(newUser);

        
    }
    
    isEmpty = (obj) => {
        for(let prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }
        return JSON.stringify(obj) === JSON.stringify({});
    }


    render() {

        var formInput = classNames({
            'form-input': true,
            'form-input-alert': !this.isEmpty(this.state.errors) && !isTextChange
        })

        return <div>
            <NavLink onClick={this.toggle} href="#">
                Register
            </NavLink>

            <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Register</ModalHeader>
                    <ModalBody>
                       
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup> {/*replace for <div> instead*/}
                                <Label for="name">Name</Label>
                                <input  
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Enter name"
                                        className = {formInput}
                                        onChange={this.onChange}>
                                </input>
                                
                                { this.state.errors.name  ? <FormText color="danger"
                                                                    className ="mb-1 ml-1">
                                                                    <img src={AlertIcon} className="alert-icon" alt=""></img>
                                                                    <strong>{ this.state.errors.name }</strong>
                                                            </FormText> : null}                     
                                <Label for="email">Email</Label>
                                <input  
                                        type="text"
                                        name="email"
                                        id="email"
                                        placeholder="Your email"
                                        className = {formInput}
                                        onChange={this.onChange}>
                                </input>

                                { this.state.errors.email  ? <FormText color="danger"
                                                                    className ="mb-1 ml-1">
                                                                    <img src={AlertIcon} className="alert-icon" alt=""></img>
                                                                    <strong>{ this.state.errors.email }</strong>
                                                            </FormText> : null}    

                                <Label for="password">Password</Label>
                                <input  
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="Your password"
                                        className = {formInput}
                                        onChange={this.onChange}>
                                </input>

                                { this.state.errors.password  ? <FormText color="danger"
                                                                    className ="mb-1 ml-1">
                                                                    <img src={AlertIcon} className="alert-icon" alt=""></img>
                                                                    <strong>{ this.state.errors.password }</strong>
                                                            </FormText> : null}    

                                <Button
                                        color="dark"
                                        style={{marginTop: '2rem'}}
                                        block>
                                    Register
                                </Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
            </Modal>

        </div>
    }
}

RegisterModal.propTypes = {
    isAuthenticated: PropTypes.bool, //can be bool so not required
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
})

export default connect( mapStateToProps, {register, clearErrors} )(RegisterModal);