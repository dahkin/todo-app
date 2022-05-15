import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';
import { categoryNames } from '../../utils';
// import logo from '../../images/logo.svg';

interface Props {
  className?: string;
  placement: 'header' | 'footer';
}

export const Navigation: FC<Props> = ({ className = '', placement = 'header' }) => {
  return (
    <nav className={`grid navigation navigation--${placement} ${className}`}>
      {/*<NavLink to="/" className="navigation__logo">*/}
      {/*  <img className="navigation__logo-image" src={logo} alt="Логотип" />*/}
      {/*</NavLink>*/}
      <ul className="navigation__list">
        {['index', 'fashion', 'technologies', 'sport', 'karpov'].map((item) => {
          return (
            <li className="navigation__item" key={item}>
              <NavLink
                to={`/${item}`}
                className="navigation__link"
                activeClassName="navigation__link--active"
                isActive={(match, location) => {
                  if (match) {
                    return true;
                  }

                  if (item === 'index' && location.pathname === '/') {
                    return true;
                  }

                  return false;
                }}
              >
                {categoryNames[item]}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
