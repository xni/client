/* eslint-disable consistent-return */

import React from 'react';
import { NavLink } from 'react-router-dom';

import Icon from 'shared/components/Icon';
import Tooltip from 'shared/components/Tooltip';

import styles from './Navigation.scss';

export default function Navigation() {
  return (
    <nav className={styles.navigation}>
      <ul className={styles.group}>
        <li>
          <NavLink exact to="/browser" draggable={false} className={styles.link}>
            <Tooltip id="browser" overlay="Browser">
              <Icon name="browser" aria-describedby="browser" />
            </Tooltip>
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/account" draggable={false} className={styles.link}>
            <Tooltip id="account" overlay="Account">
              <Icon name="account" aria-describedby="account" />
            </Tooltip>
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/settings" draggable={false} className={styles.link}>
            <Tooltip id="settings" overlay="Settings">
              <Icon name="settings" aria-describedby="settings" />
            </Tooltip>
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/logout" draggable={false} className={styles.link}>
            <Tooltip id="logout" overlay="Logout">
              <Icon name="logout" aria-describedby="logout" />
            </Tooltip>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
