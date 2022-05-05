import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";

import useHttp from "../../shared/hooks/http-hook";
import useForm from "../../shared/hooks/form-hook";
import Button from "../../shared/component/FormElements/Button";
import Input from "../../shared/component/FormElements/Input";
import Card from "../../shared/component/UIElements/Card";
import ImageUpload from "../../shared/component/FormElements/ImageUpload";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpiner from "../../shared/component/UIElements/LoadingSpinner";

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import classes from "./Auth.module.css";

const Auth = () => {
  const dispatch = useDispatch();

  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  const { isLoading, error, clearError, sendRequest } = useHttp();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevState) => !prevState);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formState.inputs.email.value,
              password: formState.inputs.password.value,
            }),
          }
        );
        dispatch(
          authActions.login({
            userId: responseData.userId,
            token: responseData.token,
          })
        );
      } catch (err) {}
    } else {
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
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);

        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          {
            method: "POST",
            body: formData,
          }
        );
        dispatch(
          authActions.login({
            userId: responseData.userId,
            token: responseData.token,
          })
        );
      } catch (err) {}
    }
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className={classes.authentication}>
        {isLoading && <LoadingSpiner asOverlay />}
        <form onSubmit={authSubmitHandler}>
          <h2>{isLoginMode ? "Login" : "Signup"}</h2>
          <hr />
          {!isLoginMode && (
            <Input
              id="name"
              type="text"
              label="Your Name"
              element="input"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            ></Input>
          )}

          {!isLoginMode && (
            <ImageUpload
              id="image"
              center
              onInput={inputHandler}
              errorText={
                "Please provide an image with (.png/.jpeg/.jpg) format only."
              }
            />
          )}

          <Input
            id="email"
            type="text"
            label="E-Mail"
            element="input"
            validators={[VALIDATOR_EMAIL(), VALIDATOR_REQUIRE()]}
            errorText="Please Provide a valid Email."
            onInput={inputHandler}
          ></Input>

          <Input
            id="password"
            type="password"
            label="Password"
            element="input"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please provide a valid password, at least 6 character."
            onInput={inputHandler}
          ></Input>

          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>

        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {!isLoginMode ? "LOGIN" : "SIGNUP"}
        </Button>
      </Card>
    </Fragment>
  );
};

export default Auth;
