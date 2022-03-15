import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";

let logoutTimer;

const useAuth = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const tokenExpirationTimeInMs = useSelector(
    (state) => state.auth.tokenExpirationTimeInMs
  );

  useEffect(() => {
    if (token && tokenExpirationTimeInMs) {
      const remainingTime =
        new Date(tokenExpirationTimeInMs).getTime() - new Date().getTime();

      const logoutHandler = () => {
        dispatch(authActions.logout());
      };

      logoutTimer = setTimeout(logoutHandler, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, tokenExpirationTimeInMs, dispatch]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration).getTime() > new Date().getTime()
    ) {
      dispatch(
        authActions.login({
          userId: storedData.userId,
          token: storedData.token,
          expiration: storedData.expiration,
        })
      );
    }
  }, [dispatch]);

  return { token };
};

export default useAuth;
