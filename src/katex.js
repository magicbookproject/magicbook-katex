var path = require('path');
var _ = require('lodash');
var katex = require('katex');
var through = require('through2');
var cheerio = require('cheerio');
var markdownitKatex = require('markdown-it-katex');

var Plugin = function(registry) {
  registry.before('stylesheets:move', 'katex:setup', this.setupKatex);
  registry.after('markdown:convert', 'katex:html', this.replaceHTML);
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
  },

  replaceHTML: function(config, stream, extras, callback) {

    stream = stream.pipe(through.obj(function(file, enc, cb) {

      file.$el = file.$el || cheerio.load(file.contents.toString());
      var found = false;

      file.$el('span[data-type="equation"],div[data-type="equation"]').each(function(i, el) {
        var jel = file.$el(this);
        var latex = jel.html();
        jel.replaceWith(katex.renderToString(latex, { displayMode: el.tagName == 'div' }));
        found = true;
      });

      if(found) {
        file.contents = new Buffer(file.$el.html());
      }

      cb(null, file);
    }));

    callback(null, config, stream, extras);

  }
}

module.exports = Plugin;
