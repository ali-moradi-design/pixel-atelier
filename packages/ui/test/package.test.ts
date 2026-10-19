import { readdirSync, readFileSync } from "node:fs";

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

// Server-component safety: a file that uses client-only React APIs must be
// marked "use client", or apps using it from a server component break.
describe('"use client" directives', () => {
  const dir = `${process.cwd()}/src/components`;
  const files = readdirSync(dir).filter(
    (f) => f.endsWith(".tsx") && !f.includes(".test."),
  );
  const clientOnly =
    /\b(useState|useEffect|useLayoutEffect|useRef|useContext|useCallback|useMemo|useSyncExternalStore|useReducer|createContext)\b/;
  it.each(files)("%s", (f) => {
    const src = readFileSync(`${dir}/${f}`, "utf8");
    if (clientOnly.test(src)) expect(src.startsWith('"use client";')).toBe(true);
  });
  it("exposes the pixel primitives entry", () => {
    const pkg = JSON.parse(readFileSync(`${process.cwd()}/package.json`, "utf8"));
    expect(pkg.exports["./pixels"].default).toBe("./dist/pixels/index.js");
  });
});

// Security guard: the kit renders text only through React (escaped). These
// APIs turn strings into markup or code, so they are banned from the source.
describe("no dangerous APIs in the source", () => {
  const banned =
    /dangerouslySetInnerHTML|\.innerHTML|\.outerHTML|insertAdjacentHTML|document\.write|\beval\(|new Function\(|setTimeout\(\s*["'`]|srcdoc/;
  const files = ["components", "blocks", "lib", "pixels"].flatMap((d) =>
    readdirSync(`${process.cwd()}/src/${d}`)
      .filter((f) => /\.tsx?$/.test(f) && !f.includes(".test."))
      .map((f) => `src/${d}/${f}`),
  );
  it.each(files)("%s", (f) => {
    expect(readFileSync(`${process.cwd()}/${f}`, "utf8")).not.toMatch(banned);
  });
});
