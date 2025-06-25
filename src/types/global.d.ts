// src/global.d.ts or at root (e.g. types/global.d.ts)
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
