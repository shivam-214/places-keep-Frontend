import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../../shared/component/UIElements/Avatar";
import Card from "../../shared/component/UIElements/Card";
import classes from "./UserItem.module.css";

const UserItem = (props) => {
  return (
    <li className={classes["user-item"]}>
      <Card className={classes.content}>
        <Link to={`/${props.id}/places`}>
          <div className={classes.image}>
            <Avatar
              image={props.image}
              alt={props.name}
            />
          </div>
          <div className={classes.info}>
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? "Place" : "Places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
