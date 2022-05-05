import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import classes from "./PlaceList.module.css";
import Card from "../../shared/component/UIElements/Card";
import Button from "../../shared/component/FormElements/Button";
import PlaceItem from "./PlaceItem";

const PlaceList = (props) => {
  const uId = useSelector((state) => state.auth.userId);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { userId } = useParams();
  if (props.items.length === 0) {
    return (
      <div className={`${classes["place-list"]} ${classes.center} `}>
        <Card>
          <h2>
            No Places Found.
            {isLoggedIn && uId === userId && <span> May be create one?</span>}
          </h2>
          {isLoggedIn && uId === userId && (
            <Button to="/places/new">Share Place</Button>
          )}
          {!isLoggedIn && <Button to="/auth">Share Place</Button>}
        </Card>
      </div>
    );
  }

  return (
    <ul className={classes["place-list"]}>
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.imageUrl}
          title={place.title}
          address={place.address}
          description={place.description}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
