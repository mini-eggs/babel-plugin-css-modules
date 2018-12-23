// @jsx h
import { h, render } from "wigly";

let App = () => {
  let classes = styles`
    body {
      margin: 50px;
      text-align: center;
      transform: translate(0,0);
    }

    .container {
      font-size: 100px;
      padding: 50px 100px;
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

render(<App />, document.body);
