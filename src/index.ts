import { type AstroIntegration } from "astro";
import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { internaliseCSS } from "./internalise-css";
import { getFiles, removeEmptyDirs } from "./utils";

export default (): AstroIntegration => ({
  name: "astro-internalise-css",
  hooks: {
    "astro:build:done": ({ dir }) => {
      const outDir = dir.pathname;
      const files = getFiles(outDir);
      const htmlFiles = files.filter((file) => file.endsWith(".html"));
      const cssFiles = files.filter((file) => file.endsWith(".css"));

      htmlFiles.forEach((htmlFile) => {
        const htmlContents = readFileSync(htmlFile, "utf8");
        const htmlContentsInlineCSS = internaliseCSS(htmlContents, cssFiles);
        writeFileSync(htmlFile, htmlContentsInlineCSS);
      });

      cssFiles.forEach((cssFile) => {
        unlinkSync(cssFile);
      });

      removeEmptyDirs(outDir);
    },
  },
});
