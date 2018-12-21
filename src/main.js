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
          // Don't include runtime if we never actually used it.
          if (all !== "") {
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
        }
      },
      TaggedTemplateExpression: function(path) {
        if (path.node.tag.name === func) {
          var data = path.get("quasi").evaluate().value;
          if (data) {
            // We have all the vars we need now.
            data = sass.renderSync({ data }).css.toString(); // sass
            data = new css({}).minify(data).styles; // minify
            data = toCssModule(data); // to module data
            all += data.injectableSource; // pool responses
            path.replaceWithSourceString(JSON.stringify(data.exportTokens)); // replace exp. w/ dec
          } else {
            // Now we need to do things at run time...
            // Lets remove the problem line from the quasis and do what we can while we're here.
            throw new Error("Unable to determine the value of your " + func + " string");

            // const scope = path.scope.getProgramParent();
            // const templateObject = scope.generateUidIdentifier("templateObject");
            // const t = ctx.types;

            // var something = t.callExpression(path.node.tag, [
            //   t.callExpression(t.cloneNode(templateObject), []),
            //   ...path.node.quasi.expressions
            // ]);

            var partial = "";

            // Removing problem lines so we can return an object to user.
            for (var i = 0; i < path.node.quasi.expressions.length; i++) {
              var curr = path.node.quasi.quasis[i].value.raw.trim().split("\n");
              if (i !== 0) curr.shift();
              if (i !== path.node.quasi.expressions.length - 1) curr.pop();
              partial += curr.join("\n");
            }

            partial += path.node.quasi.quasis[path.node.quasi.expressions.length].value.raw.trim();

            partial = sass.renderSync({ data: partial }).css.toString();
            partial = new css({}).minify(datapartial).styles;
            partial = toCssModule(partial);
            all += partial.injectableSource;
            path.replaceWithSourceString(JSON.stringify(partial.exportTokens));

            // TODO wrap the object returned to user above with function to insert
            // the given styling on use.
          }
        }
      }
    }
  };
};
