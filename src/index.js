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
    
    

    <p>
      <strong>Expected Output:</strong>
      <br /> Hi [@juliandoesstuff] and [@nikgrafs] , wish you #happynewyear
      2018.
    </p>

    <p>
      <strong>Note:</strong> You can also check console for output.
    </p>
  </div>
);

render(<App />, document.getElementById("root"));
