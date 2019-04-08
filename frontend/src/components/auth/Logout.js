import React, {Component} from 'react';
import { NavLink } from 'reactstrap';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { logout } from '../../actions/authAction';

class Logout extends Component {
    render() {
    return <> {/* Fragment -> don't have to return <div> */}
            <NavLink onClick = {this.props.logout} href="#">
                Log Out
            </NavLink>
        </>
    }
}

Logout.propTypes = {
    logout: PropTypes.func.isRequired
}

export default connect(null, { logout })(Logout);