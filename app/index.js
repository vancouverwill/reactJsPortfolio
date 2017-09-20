import ApiUrl from "./config.js";
import ImagePreLoadingClass from "./ImagePreLoadingClass.js";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <ImagePreLoadingClass url={ApiUrl} />,
  document.getElementById("container")
);