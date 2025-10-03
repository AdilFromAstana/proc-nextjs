import * as Mathlive from "mathlive";

type CustomElement<T> = Partial<T & React.DOMAttributes<T>>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement>,
        MathfieldElement
      >;
    }
  }
}

export {};
