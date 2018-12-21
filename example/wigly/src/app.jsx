// @jsx h
import { h } from "wigly";

export default ({ size = 50 }) => {
  let small = size + "px";
  let large = size * 2 + "px";

  let classes = styles`
    body {
      margin: ${small};
      text-align: center;
      transform: translate(0,0);
    }

    .container {
      font-size: 100px;
      padding: ${small} ${large};
      border-radius: 50px;
      background: grey;
      display: inline-block;
      margin: 0 auto;

      h1 {
        color: darkgrey;
        text-align: center;
      }
    }
  `;

  return (
    <div class={classes.container}>
      <h1>here</h1>
    </div>
  );
};
