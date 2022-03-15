import React, { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import classes from "./PlaceForm.module.css";
import Card from "../../shared/component/UIElements/Card";
import Button from "../../shared/component/FormElements/Button";
import Input from "../../shared/component/FormElements/Input";

import useForm from "../../shared/hooks/form-hook";
import useHttp from "../../shared/hooks/http-hook";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";

const UpdatePlace = (prop) => {
  const navigate = useNavigate();

  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);

  const [identifiedPlace, setIdentifiedPlace] = useState();
  const [formState, inputHandler, setFormHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const { isLoading, error, clearError, sendRequest } = useHttp();
  const { placeId } = useParams();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/places/" + placeId
        );
        setIdentifiedPlace(responseData.place);
        setFormHandler(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, setFormHandler, placeId]);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!identifiedPlace && !error) {
    return (
      <Card>
        <h2>Could not find place!</h2>
      </Card>
    );
  }

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/places/" + placeId,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            title: formState.inputs.title.value,
            description: formState.inputs.description.value,
          }),
        }
      );
      navigate("/" + userId + "/places");
    } catch (err) {}
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && identifiedPlace && (
        <form
          className={classes["place-form"]}
          onSubmit={placeUpdateSubmitHandler}
        >
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={identifiedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            type="text"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description(at least 5 characters)."
            onInput={inputHandler}
            initialValue={identifiedPlace.description}
            initialValid={true}
          />

          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </Fragment>
  );
};

export default UpdatePlace;
