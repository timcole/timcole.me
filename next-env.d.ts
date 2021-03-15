/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.svg' {
  const value: React.StatelessComponent<React.SVGAttributes<SVGElement>>;
  export default value;
}
