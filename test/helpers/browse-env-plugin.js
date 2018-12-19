module.exports = function(ctx) {
  return {
    visitor: {
      Program: {
        exit: function(path) {
          var src = ctx.parse(`require("browser-env")()`);
          for (var line of src.program.body.reverse()) {
            path.node.body.unshift(line);
          }
        }
      }
    }
  };
};
