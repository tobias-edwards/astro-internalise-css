import { readdirSync, rmdirSync, statSync } from "node:fs";
import { join } from "node:path";

export const getFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((item) => {
    const itemPath = join(dir, item);
    if (statSync(itemPath).isDirectory()) {
      return getFiles(itemPath);
    }
    return itemPath;
  });

const isEmpty = (dir: string) => readdirSync(dir).length === 0;

export const removeEmptyDirs = (dir: string) => {
  readdirSync(dir)
    .map((item) => join(dir, item))
    .filter((path) => statSync(path).isDirectory())
    .map((dir) => (isEmpty(dir) ? rmdirSync : removeEmptyDirs));
};
