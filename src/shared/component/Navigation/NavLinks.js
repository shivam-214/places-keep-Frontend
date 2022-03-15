import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "./NavLinks.css";
import { authActions } from "../../../store/auth-slice";

// const activeClassHandler = ({ isActive }) =>
//   isActive ? `${classes.active}` : "";

const NavLinks = (props) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userId = useSelector((state) => state.auth.userId);

  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(authActions.logout());
    navigate("/auth", { replace: true });
  };

  return (
    <ul className={"nav-links"}>
      <li>
        <NavLink
          to="/"
          end
          // className={activeClassHandler}
        >
          ALL USERS
        </NavLink>
      </li>
      {isLoggedIn && (
        <li>
          <NavLink to={`/${userId}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}
      {!isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATION</NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <button onClick={logoutHandler}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
