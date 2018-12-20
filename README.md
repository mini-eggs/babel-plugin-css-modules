# babel-plugin-css-modules

A lean, framework agnostic (S)CSS (modules) in JS library.

#### Why should you use babel-plugin-css-modules?

It's very lightweight -- nearly all work is done at compile time. The entire runtime shipped is only five lines of unminized JavaScript code.

```javascript
(function() {
  var ss = document.createElement("style");
  ss.innerHTML = `${styles}`;
  document.head.appendChild(ss);
})();
```

That's 107 bytes minimized.

#### Why should you not use babel-plugin-css-modules?

If you ever plan to server-side render -- or if you want to export a standard `.css` file. Those two issues are not in scope of babel-plugin-css-modules as of now.

#### But what does it look like?

The minimal example is:

```javascript
let classes = styles`
    body {
        margin: 0
    }

    .container {
        h1 {
            font-size: 50px;
        }
        :before {
            content: "1. ";
        }
    }
`;

document.body.innerHTML = `
    <div class="${classes.container}">
        <h1>This is a triumph.</h1>
    </div>
`;
```

#### Installing

```bash
npm i -D babel-plugin-css-modules
```

#### Now, how do I use it?

With [Babel](https://babeljs.io/)! You must have this placed in your `.babelrc`

```json
{
  "plugins": ["css-modules"]
}
```
