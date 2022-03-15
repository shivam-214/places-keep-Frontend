import React, { Fragment,useState } from "react";
import classes from "./MainNavigation.module.css";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import { Link } from "react-router-dom";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";

const MainNavigation = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  return (
    <Fragment>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className={classes["drawer-nav"]}>
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className={classes["menu-btn"]} onClick={openDrawerHandler}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className={classes.title}>
          <Link to="/">PlacesKeep</Link>
        </h1>
        <nav className={classes["header-nav"]}>
          <NavLinks />
        </nav>
      </MainHeader>
    </Fragment>
  );
};

export default MainNavigation;
