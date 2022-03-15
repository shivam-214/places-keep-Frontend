import React, { useState, useEffect, Fragment } from "react";
import useHttp from "../../shared/hooks/http-hook";

import UsersList from "../component/UsersList";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState();
  const { isLoading, error, clearError, sendRequest } = useHttp();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users"
        );
        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <Fragment>
      {<ErrorModal error={error} onClear={clearError} />}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </Fragment>
  );
};

export default Users;
