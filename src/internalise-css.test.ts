import { internaliseCSS } from "./internalise-css";

jest.mock("node:fs", () => ({
  readFileSync: jest.fn().mockImplementation((file) => {
    switch (file) {
      case "dist/bar.css":
        return ".bar { color: blue; }";
      case "dist/foo.css":
        return ".foo { color: red; }";
    }
  }),
}));

const cssFiles = ["dist/bar.css", "dist/foo.css"];

it.each([
  [
    `
    <html>
      <head>
        <link href="/foo.css" />
        <link href="/bar.css" />
      </head>
    </html>
  `,
    `
    <html>
      <head>
        <style type="text/css">.foo { color: red; }</style>
        <style type="text/css">.bar { color: blue; }</style>
      </head>
    </html>
  `,
  ],
  [
    `
    <html>
      <head>
        <meta charset="utf-8">
        <link href="./bar.css" />
        <link href="./baz.css" />
        <title>Title</title>
        <link href="./foo.css" />
      </head>
    </html>
  `,
    `
    <html>
      <head>
        <meta charset="utf-8">
        <style type="text/css">.bar { color: blue; }</style>
        <link href="./baz.css" />
        <title>Title</title>
        <style type="text/css">.foo { color: red; }</style>
      </head>
    </html>
  `,
  ],
  [
    `
    <html>
      <head>
        <link href="foo.css" />
        <link href="./foo.css" />
      </head>
    </html>
  `,
    `
    <html>
      <head>
        <link href="foo.css" />
        <style type="text/css">.foo { color: red; }</style>
      </head>
    </html>
  `,
  ],
])("internalises external style sheets", (html, expectedHTML) => {
  expect(internaliseCSS(html, cssFiles)).toEqual(expectedHTML);
});
