import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ component: Component, auth, ...rest }) => {

  if(localStorage.token) {
    auth.isAuthenticated = true;
  }
  
  return (<Route
    {...rest}
    render={props => 
     auth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to={{
          pathname: "/",
          state: {from: props.location}
        }} />
      ) 
    }
  />) 
};



PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => {
  return({
  auth: state.auth
})};
export default connect(mapStateToProps)(PrivateRoute);