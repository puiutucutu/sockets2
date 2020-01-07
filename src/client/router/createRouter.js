import React from "react";
import { BrowserRouter } from "react-router-dom";

const createRouter = RootComponent => (
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <RootComponent />
  </BrowserRouter>
);

export { createRouter };
