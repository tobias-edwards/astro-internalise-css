import { readFileSync } from "node:fs";

export const internaliseCSS = (html: string, cssFiles: string[]): string => {
  const cssLinkRegex = /<link[^>]*? href="(.*css)"[^>]*?>/g;
  const cssLinks = [...html.matchAll(cssLinkRegex)];

  return cssLinks.reduce((htmlWithInternalCSS, [linkTag, hrefValue]) => {
    const linkedCSSFile = cssFiles.find(
      (cssFile) =>
        hrefValue.includes("/") &&
        cssFile.endsWith(hrefValue.slice(hrefValue.lastIndexOf("/")))
    );
    if (linkedCSSFile) {
      const cssContents = readFileSync(linkedCSSFile, "utf8");
      const internalCSS = `<style type="text/css">${cssContents}</style>`;
      return htmlWithInternalCSS.replace(linkTag, internalCSS);
    }
    return htmlWithInternalCSS;
  }, html);
};
