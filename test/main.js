let test = require("ava");

let getStyle = (query, key) => getComputedStyle(document.querySelector(`.${query}`))[key];

test("With mutliple nested string variables.", t => {
  let fontSize = "100px";
  let color = "red";

  let classes = styles`
    .container {
      font-size: ${fontSize};

      .button {
        color: ${color};
      }
    }
  `;

  document.body.innerHTML = `
    <div class="${classes.container}">
      <button class="${classes.button}">Click me</button>
    </div>
  `;

  t.deepEqual(getStyle(classes.container, "font-size"), fontSize);
  t.deepEqual(getStyle(classes.button, "color").color);
});
