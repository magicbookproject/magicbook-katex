var path = require('path');
var _ = require('lodash');
var markdownitKatex = require('markdown-it-katex');

var Plugin = function(registry) {
  registry.before('stylesheets:move', 'katex', this.setupKatex)
}

Plugin.prototype = {

  setupKatex: function(config, extras, callback) {

    // make sure we parse $-$ and $$-$$ into katex markup
    extras.md.use(markdownitKatex);

    // Stylesheets
    var css = path.join(__dirname, "..", "assets", "katex", "katex.scss");
    config.stylesheets = config.stylesheets || {};
    config.stylesheets.files = config.stylesheets.files || [];
    if(_.isString(config.stylesheets.files)) {
      config.stylesheets.files = [config.stylesheets.files]
    }
    config.stylesheets.files.push(css);

    // Javascripts
    var js = path.join(__dirname, "..", "assets", "katex", "katex.min.js");
    config.javascripts = config.javascripts || {};
    config.javascripts.files = config.javascripts.files || [];
    if(_.isString(config.javascripts.files)) {
      config.javascripts.files = [config.javascripts.files]
    }
    config.javascripts.files.push(js);

    // Fonts
    var fonts = path.join(__dirname, "..", "assets", "katex", "fonts", "**/*.*");
    config.fonts = config.fonts || {};
    config.fonts.files = config.fonts.files || [];
    if(_.isString(config.fonts.files)) {
      config.fonts.files = [config.fonts.files]
    }
    config.fonts.files.push(fonts);

    callback(null, config, extras);
  }
}

module.exports = Plugin;
