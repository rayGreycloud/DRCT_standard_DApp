import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
  // UncontrolledDropdown,
  // DropdownToggle,
  // DropdownMenu,
  // DropdownItem
} from 'reactstrap';

// Dropdown disabled pending separate routes for dropdown items

// Use named export for unconnected component for testing
export class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <nav id="header-nav">
        <Link to="/">
          <img
            className="nav-logo"
            src="./dda-logo.png"
            alt="logo"
            height="30px"
            width="30px"
          />
        </Link>
        <ul>
          <li>
            <Link className="nav-link" to="/portfolio">Portfolio</Link>
          </li>
          <li>
            <Link className="nav-link" to="/bulletin">Bulletin</Link>
          </li>
          <li>
            <Link className="nav-link" to="/how-to">How To</Link>
          </li>
        </ul>
        <div className="connection-status">
          {this.props.isConnected && (
            <div className="connected">
              Connected
                    <span style={{ color: 'green', paddingLeft: '5px' }}>
                <i className="fas fa-circle" />
              </span>
            </div>
          )}

          {!this.props.isConnected && (
            <div className="connected">
              Not Connected
                    <span style={{ color: 'red', paddingLeft: '5px' }}>
                <i className="fas fa-circle" />
              </span>
            </div>
          )}
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  isConnected: PropTypes.bool.isRequired
};

Navbar.propTypes = {
  dark: PropTypes.bool,
  color: PropTypes.string,
  expand: PropTypes.string
};

export default Header;
