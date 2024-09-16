import React from "react";
import { Outlet } from "react-router-dom/dist";

export default function PreLoginLayout() {
  return (
    <div id="app">
      <div className="container">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
