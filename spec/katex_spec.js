var rimraf = require('rimraf');
var uuid = require('node-uuid');
var build = require('magicbook/src/build');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');

function triggerBuild(config) {
  var uid = uuid.v4().replace('-', "").substring(0, 10);
  _.defaults(config, {
    addPlugins: ["./src/katex.js"],
    files: ["book/content/math.md"],
    destination: "tmp/"+uid+"/:build"
  });
  build(config);
  return uid;
}

beforeAll(function(done) {
  rimraf("tmp/*", function() {
    done();
  });
});

describe("Katex plugin", function() {

  it("should convert $$ to katex", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      finish: function() {
        var content = fs.readFileSync(path.join('tmp', uid, 'build1/math.html')).toString();
        expect(content).toMatch("<math>");
        expect(content).not.toMatch("\\$\\$");
        done();
      }
    });
  });

  it("should include katex.css in the stylesheets", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      finish: function() {
        fs.readFileSync(path.join('tmp', uid, 'build1/assets/katex.css'));
        done();
      }
    });
  });

  it("should include katex.min.js in the javascripts", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      finish: function() {
        fs.readFileSync(path.join('tmp', uid, 'build1/assets/katex.min.js'));
        done();
      }
    });
  });

  it("should include fonts in the fonts", function(done) {
    var uid = triggerBuild({
      builds: [{ format: "html" }],
      finish: function() {
        fs.readFileSync(path.join('tmp', uid, 'build1/assets/KaTeX_AMS-Regular.eot'));
        done();
      }
    });
  });

});
