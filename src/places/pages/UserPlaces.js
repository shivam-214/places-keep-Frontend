import React, { useState, useEffect, Fragment } from "react";
import PlaceList from "../component/PlaceList";
import { useParams } from "react-router-dom";

import useHttp from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";

const UsersPlaces = (props) => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, clearError, sendRequest } = useHttp();

  const { userId } = useParams();

  useEffect(() => {
    const fetchUserPlaces = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/places/user/" + userId
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };
    fetchUserPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) => {
      return prevPlaces.filter((place) => place.id !== deletedPlaceId);
    });
  };

  return (
    <Fragment>
      {<ErrorModal error={error} onClear={clearError} />}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </Fragment>
  );
};
export default UsersPlaces;
