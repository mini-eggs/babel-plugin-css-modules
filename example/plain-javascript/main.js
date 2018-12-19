let white = "#fff";

let classes = styles`
    body {
        margin: 0;
        background: ${white};
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
