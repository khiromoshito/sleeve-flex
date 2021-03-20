# sleeve-flex
A JS library for responsive HTML elements

## Usage

To make an element responsive, just add the `responsive` attribute to it.

```html
  <span style="color: blue" responsive>Hello world</span>
```

And that's when the magic begins.
Responsive elements can have JavaScript in them which automatically re-executes and rerenders the element according to window sizes and when the window size changes. Just wrap the JS code inside double curly brackets, like this:

`{{//YouJSCodeHere}}`

You can either put it inside the tag:

```html
  <span style="color: blue; fontSize: {{10+5}}" responsive>Hello world</span>
```

Or in the content:

```html
  <span style="color: blue; fontSize: {{10+5}}" responsive>Hello {{"world"+"s"}}</span>
```

And now, to add responsive values (values that are dependent with the window size), just place
the `R('mobile', 'tablet', 'desktop')` function call inside the JS script (between the curlies).

Each of the arguments (`'mobile'`, `'tablet'`, `'desktop'`) represent values that are dependent
on the current device size, respectively.

For example, if you want a text to have the color `blue` on mobile, `red` on tablet, and `green` on desktop, you can just say:

```html
  <span style="color: {{ R('blue', 'red', 'green'}};" responsive>Hello world</span>
```

And it will automatically adjust the color accordingly.

## Contributions
This project is open-source, so contributions are widely welcome.

## About Sleeve
Sleeve is a growing web framework, currently under construction. Sleeve bits is then a library collection for helping web developers export quality product over quantity work.
