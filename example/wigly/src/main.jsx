// @jsx h
import { h, render } from "wigly";

let { container } = styles`
    body {
        margin: 50px;
        text-align: center;
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

let App = () => (
  <div class={container}>
    <h1>here</h1>
  </div>
);

render(<App />, document.body);
