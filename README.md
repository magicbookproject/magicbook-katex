## Magicbook katex

This plugin allows you to write math equations via latex math expressions and automatically render these with the Katex math library. We chose to use Katex over Mathjax as it's faster, smaller, and supports bundling alongside other libraries. Mathjax is problematic when it comes to these things.

## Using the plugin

First install the NPM package, either in your `package.json` file in your book repo, or by running the following.

```
npm i magicbook-katex
```

Just add the plugin to your config.

```json
{
  "addPlugins" : ["magicbook-katex"]
}
```

Then write some content with math markup. Here's an example with an inline and block math equations in your markdown.

```md
This is an inline equation: $$5 + 5$$. The following is a block equation:

$$
5 + 5
$$
```

The required JavaScript, stylesheets and fonts will automatically be added to the build assets during the build process.
