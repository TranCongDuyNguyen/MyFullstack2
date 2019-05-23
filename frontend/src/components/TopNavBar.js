import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container
} from 'reactstrap';

import RegisterModal from './auth/RegisterModal';
import Logout from './auth/Logout';
import Login from './auth/Login';
import './CSS/NavBarStyle.css';
import TrendIcon from '../images/trending.svg';

class TopNavBar extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLink = (
      <>
        <NavItem>
          <span className="navbar-text text-white align-center">
            <strong>{user ? `Welcome ${user.name}` : ''}</strong>
          </span>
        </NavItem>
        <NavItem className="ml-3">
          <Logout />
        </NavItem>
      </>
    )

    const guestLink = (
      <>
        <NavItem>
          <Login />
        </NavItem>
        <NavItem>
          <RegisterModal />
        </NavItem>
      </>
    )

    return <div>
      <Navbar expand="md" className="navbar navbar-expand-md navbar-dark bg-dark">
        <Container >


          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar={true}>
            <Nav className="mr-auto mb-auto">
              <NavbarBrand className="nav-brand mr-auto"
                style={{
                  color: "#FFF",
                  position: "absolute"
                }}>
                <h1 className="brand-text">SCADA</h1>
                <svg width="50" height="50">
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(2,170,176,1)" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="rgba(0,205,172,1)" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <circle cx="25" cy="25" r="25" fill="url(#grad1)" >
                  </circle>
                </svg>

              </NavbarBrand>
              <NavItem style={{ margin: "auto 0" }}>
                <NavLink href="/" style={{ color: "#FFF", padding: "0 8px", margin: "0 0.5em 0 0.5em" }}>
                  <i className="fas fa-home" style={{ margin: "0 auto", fontSize: "1.5em", color: "#FBFCFF" }}></i>
                  <h2 style={{ margin: "0 auto", fontSize: "1em", color: "#FBFCFF" }}>Home</h2>
                </NavLink>
              </NavItem>
              <NavItem style={{ margin: "auto 0" }}>
                <NavLink href="/monitor/1" style={{ color: "#FFF", padding: "0" }}>
                  <img src={TrendIcon} alt="" style={{ margin: "0 auto", fontSize: "1.5em" }}></img>
                  <h2 style={{ margin: "0 auto", fontSize: "1em", color: "#FBFCFF" }}>Monitor</h2>
                </NavLink>
              </NavItem>
              <NavItem style={{ margin: "auto 0" }}>
                <NavLink href="/virtualization" style={{  color: "#FFF", padding: "0px 15.5px", margin: "0 0 0 0.5em" }}>
                <i className="fas fa-glasses" style={{ margin: "0 auto", fontSize: "1.5em", color: "#FBFCFF" }}></i>
                  <h2 style={{ margin: "0 auto", fontSize: "1em", color: "#FBFCFF" }}>Live</h2>
                </NavLink>
              </NavItem>
              <NavItem style={{ margin: "auto 0" }}>
                <NavLink href="/management" style={{  color: "#FFF", padding: "0px 15.5px", margin: "0 0.5em 0 0" }}>
                <i className="far fa-calendar-alt" style={{ margin: "0 auto", fontSize: "1.5em", color: "#FBFCFF" }}></i>
                  <h2 style={{ margin: "0 auto", fontSize: "1em", color: "#FBFCFF" }}>Plan</h2>
                </NavLink>
              </NavItem>
            </Nav>
            <Nav className="ml-auto" navbar>
              {isAuthenticated ? authLink : guestLink}
            </Nav>

            <UncontrolledDropdown nav-brand="true" inNavbar className="col-md-1">
              <DropdownToggle caret>
                Options
                          </DropdownToggle>
              <DropdownMenu left="true">
                <DropdownItem tag="a" href="/itemlist" active>
                  Item
                            </DropdownItem>
                <DropdownItem tag="a" href="/management" active>
                  Management
                            </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="/entry">
                  Entry
                            </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

          </Collapse>



        </Container>
      </Navbar>
    </div>
  }
}

TopNavBar.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(TopNavBar)