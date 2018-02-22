import React from "react";
import { render } from "react-dom";
import CommentBox from "./CommentBox";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const App = () => (
  <div style={styles}>
    <h2>My Comment Box Sample</h2>
    <CommentBox />
  </div>
);

render(<App />, document.getElementById("root"));
