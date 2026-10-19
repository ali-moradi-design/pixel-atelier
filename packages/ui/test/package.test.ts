import { readFileSync } from "node:fs";

// Guards the tree-shaking contract: JS is side-effect free, one entry per component.
describe("package.json", () => {
  const pkg = JSON.parse(readFileSync(`${process.cwd()}/package.json`, "utf8"));
  it("marks only CSS as having side effects", () => {
    expect(pkg.sideEffects).toEqual(["**/*.css"]);
  });
  it("exposes one entry per component", () => {
    expect(pkg.exports["./*"].default).toBe("./dist/components/*.js");
  });
});
