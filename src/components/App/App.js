import React from 'react';
import { NavLink } from 'react-router-dom';
import { node } from 'prop-types';

export default function App(props) {
  return (
    <div className="all-wrapper with-side-panel solid-bg-all">
      <div className="layout-w">
        <div className="menu-w">
          <NavLink exact to="/">
            Home
          </NavLink>
          {' | '}
          <NavLink exact to="/login">
            Login
          </NavLink>
          {' | '}
          <NavLink exact to="/dapp">
            DApp Example
          </NavLink>
        </div>
        <div>{props.children}</div>
      </div>
    </div>
  );
}

App.propTypes = {
  children: node
};

App.defaultProps = {
  children: null
};
