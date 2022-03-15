import React, { Fragment, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import useAuth from "./shared/hooks/auth-hook";
import MainNavigation from "./shared/component/Navigation/MainNavigation";
import LoadingSpinner from "./shared/component/UIElements/LoadingSpinner";

const Users = React.lazy(() => import("./user/pages/User"));
const Auth = React.lazy(() => import("./user/pages/Auth"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UsersPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));

function App() {
  const { token } = useAuth();

  let routes;
  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UsersPlaces />} />
        <Route path="/places/new" element={<NewPlace />} />
        <Route path="/places/:placeId" element={<UpdatePlace />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UsersPlaces />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate replace to="/auth" />} />
      </Routes>
    );
  }

  return (
    <Fragment>
      <MainNavigation />
      <main>
        <Suspense
          fallback={
            <div className="center">
              <LoadingSpinner />
            </div>
          }
        >
          {routes}
        </Suspense>
      </main>
    </Fragment>
  );
}

export default App;
