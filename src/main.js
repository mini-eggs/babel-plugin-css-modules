var css = require("clean-css");
var sass = require("node-sass");
var modules = require("css-modules-loader-core");
var deasync = require("deasync");
var uni = require("unique-string");

module.exports = function(ctx, props) {
  var all = "";
  var prefix = props.prefix || "";
  var func = props.func || "styles";

  // sync create css module
  function toCssModule(styles) {
    var done = false;
    var res;

    new modules().load(styles, prefix + uni()).then(function(next) {
      done = true;
      res = next;
    });

    deasync.loopWhile(function() {
      return !done;
    });

    return res;
  }

  return {
    visitor: {
      Program: {
        exit(path) {
          var styles = all.replace(/\\([\s\S])|(")/g, "\\$1$2"); // escape double quotes

          var src = ctx.parse(`
            (function(){
              var ss = document.createElement("style");
              ss.innerHTML = "${styles}";
              document.head.appendChild(ss);
            })();
          `);

          for (var line of src.program.body.reverse()) {
            path.node.body.unshift(line);
          }
        }
      },
      TaggedTemplateExpression(path) {
        try {
          if (path.node.tag.name === func) {
            var data = toCssModule(
              new css({}).minify(sass.renderSync({ data: path.node.quasi.quasis[0].value.raw }).css.toString()).styles
            );

            all += data.injectableSource;

            path.replaceWithSourceString(JSON.stringify(data.exportTokens));
          }
        } catch (e) {
          throw path.buildCodeFrameError(e);
        }
      }
    }
  };
};
