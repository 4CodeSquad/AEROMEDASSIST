import { createHash } from "node:crypto";

// Short hash of a page's source files, used to tell whether src/data/lastmod.json still
// describes the content being built. `read(file)` returns the file's text. Line endings are
// normalized so a CRLF checkout hashes the same as the committed LF content.
export function contentHash(files, read) {
  const hash = createHash("sha256");
  for (const file of files) hash.update(`${file}\0${read(file).replace(/\r\n/g, "\n")}\0`);
  return hash.digest("hex").slice(0, 16);
}
