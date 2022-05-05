import React, { useState, Fragment } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import classes from "./PlaceForm.module.css";

import Modal from "../../shared/component/UIElements/Modal";
import Map from "../../shared/component/UIElements/Map";
import Button from "../../shared/component/FormElements/Button";
import Input from "../../shared/component/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import useForm from "../../shared/hooks/form-hook";
import useHttp from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/component/FormElements/ImageUpload";

const NewPlace = () => {
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState();

  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  const { isLoading, error, clearError, sendRequest } = useHttp();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      coordinates: {
        value: null,
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const openMapHandler = () => {
    setShowMap(true);
  };

  const closeMapHandler = () => {
    setShowMap(false);
  };

  const coordinatesHandler = (coords) => {
    setCoordinates(coords);
    console.log(coords);
    inputHandler("coordinates", coords, true);
  };

  const resetCoordinatesHandler = () => {
    setCoordinates(null);
    inputHandler("coordinates", null, false);
  };

  const placeSubmitHandler = async (event) => {
    event.preventDefault();

    // let imageUrl;
    // try {
    //   const imageData = new FormData();
    //   imageData.append("file", formState.inputs.image.value);
    //   imageData.append("upload_preset", "xembnjbb");

    //   const response = await sendRequest(
    //     "https://api.cloudinary.com/v1_1/mern-images/image/upload",
    //     {
    //       method: "POST",
    //       body: imageData,
    //     }
    //   );
    //   imageUrl = response.url;
    //   console.log(response);
    // } catch (err) {
    //   console.log(err);
    // }
    const formData = new FormData();
    formData.append("title", formState.inputs.title.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("address", formState.inputs.address.value);
    formData.append("lat", formState.inputs.coordinates.value.lat);
    formData.append("lng", formState.inputs.coordinates.value.lng);
    formData.append("image", formState.inputs.image.value);

    try {
      await sendRequest(process.env.REACT_APP_BACKEND_URL + "/places", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      navigate("../");
    } catch (err) {}
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={"Double click to Mark a place."}
        contentClass={"place-item__modal-content"}
        footerClass={"place-item__modal-actions"}
        footer={
          <Fragment>
            <Button inverse onClick={resetCoordinatesHandler}>
              RESET
            </Button>
            <Button onClick={closeMapHandler}>CLOSE</Button>
          </Fragment>
        }
      >
        <div className={"map-container"}>
          <Map
            createplace={true}
            coordinates={coordinates}
            center={{
              lng: coordinates ? coordinates.lng : "78.46180869300093",
              lat: coordinates ? coordinates.lat : "22.27333407191034",
            }}
            title={formState.inputs.title.value}
            description={formState.inputs.description.value}
            getCoordinates={coordinatesHandler}
          ></Map>
        </div>
      </Modal>
      <form onSubmit={placeSubmitHandler} className={classes["place-form"]}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          type="text"
          label="Title"
          element="input"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please provide a valid Text."
          onInput={inputHandler}
        />

        <Input
          id="description"
          type="text"
          label="description"
          element="textarea"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description(at least 5 character)."
          onInput={inputHandler}
        />

        <Input
          id="address"
          type="text"
          label="address"
          element="textarea"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />

        <Button type="button" onClick={openMapHandler}>
          MARK PLACE ON MAP
        </Button>
        {!coordinates && <p>Please mark the place on map.</p>}

        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText={
            "Please provide an image with (.png/.jpeg/.jpg) format only."
          }
        />
        <div className="center">
          <Button
            style={{ padding: "0.5rem 4rem" }}
            type="submit"
            disabled={!formState.isValid}
          >
            ADD PLACE
          </Button>
        </div>
      </form>
    </Fragment>
  );
};

export default NewPlace;
