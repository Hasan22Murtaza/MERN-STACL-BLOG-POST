import React from "react";
import { Route, Routes } from "react-router-dom";
import PostLoginLayout from "../../components/Layouts/PostLoginLayout";
import Posts from "./Posts/Posts";

const PrivatePortal = () => {
  return (
    <React.Suspense fallback={<></>}>
      <Routes>
        <Route path="/" element={<PostLoginLayout />}>
          <Route
            path="/posts"
            element={
              <React.Suspense fallback={<></>}>
                <Posts />
              </React.Suspense>
            }
          />
        </Route>
      </Routes>
    </React.Suspense>
  );
};

export default PrivatePortal;
