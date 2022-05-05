import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import useHttp from "../../shared/hooks/http-hook";

import Card from "../../shared/component/UIElements/Card";
import Button from "../../shared/component/FormElements/Button";
import Modal from "../../shared/component/UIElements/Modal";
import Map from "../../shared/component/UIElements/Map";

import "./PlaceItem.css";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";

const PlaceItem = (props) => {
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);

  const { isLoading, error, clearError, sendRequest } = useHttp();

  const openMapHandler = () => {
    setShowMap(true);
  };

  const closeMapHandler = () => {
    setShowMap(false);
  };

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const closeDeleteWarningHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/places/" + props.id,
        {
          method: "DELETE",
          body: null,
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass={"place-item__modal-content"}
        footerClass={"place-item__modal-actions"}
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className={"map-container"}>
          <Map
            center={props.coordinates}
            title={props.title}
            description={props.description}
            zoom={15}
          ></Map>
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={closeDeleteWarningHandler}
        header="Are you sure?"
        footerClass={"place-item__modal-actions"}
        footer={
          <Fragment>
            <Button inverse onClick={closeDeleteWarningHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className={"place-item"}>
        <Card className={"place-item__content"}>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className={"place-item__image"}>
            <img
              src={props.image}
              alt={props.title}
            />
          </div>
          <div className={"place-item__info"}>
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className={"place-item__actions"}>
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {props.creatorId === userId && (
              <Button to={`../../places/${props.id}`}>EDIT</Button>
            )}
            {props.creatorId === userId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </Fragment>
  );
};

export default PlaceItem;
