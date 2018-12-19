var css = require("clean-css");
var sass = require("node-sass");
var modules = require("css-modules-loader-core");
var deasync = require("deasync");
var uni = require("unique-string");
var postcss = require("postcss");
var cssnext = require("postcss-cssnext");

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

  // sync pcss
  function pcss(styles) {
    var done = false;
    var res;

    postcss([cssnext()])
      .process(styles, { from: undefined })
      .then(function(next) {
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
        exit: function(path) {
          var styles = all.replace(/\\([\s\S])|(")/g, "\\$1$2"); // escape double quotes
          styles = pcss(styles); // postcss/autofix

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
      TaggedTemplateExpression: function(path) {
        if (path.node.tag.name === func) {
          var data = path.get("quasi").evaluate().value;

          if (!data) {
            throw new Error("Unable to determine the value of your " + func + " string");
          }

          data = sass.renderSync({ data }).css.toString(); // sass
          data = new css({}).minify(data).styles; // minify
          data = toCssModule(data); // to module data

          all += data.injectableSource; // pool responses

          path.replaceWithSourceString(JSON.stringify(data.exportTokens)); // replace exp. w/ dec
        }
      }
    }
  };
};
