import { html, render } from "lit-html";

let { container } = styles`
    .container{
        h1 {
            font-size: 100px;
        }
    }
`;

class Component extends HTMLElement {
  connectedCallback() {
    render(html([this.render()]), this);
  }
}

customElements.define(
  "app-test",
  class extends Component {
    render() {
      return `
        <div class="${container}"><h1>hi</h1></div>
      `;
    }
  }
);
