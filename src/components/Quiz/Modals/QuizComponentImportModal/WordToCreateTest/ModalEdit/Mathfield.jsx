"use client";
import * as React from "react";
import "mathlive"; // регистрирует <math-field>
// import { MathfieldElement, MathfieldElementAttributes } from "mathlive";

// export interface IMathfieldProps {
//   value: string;
//   options?: Partial<MathfieldElementAttributes>;
//   onChange?: (value: string) => void;
//   style?: React.HTMLAttributes<HTMLDivElement>["style"];
// }

export default function Mathfield(props) {
  const mathfield = React.useRef(null);

  const onInput = () =>
    props.onChange?.(mathfield.current?.getValue("latex-expanded") || "");

  const { style, value, options } = props;

  const init = (mf) => {
    if (mf) {
      mathfield.current = mf;
      mf.setValue(value, { silenceNotifications: true });
      if (options) Object.assign(mf, options);
    }
  };

  React.useEffect(() => {
    if (
      mathfield.current &&
      value !== mathfield.current.getValue("latex-expanded")
    ) {
      mathfield.current.setValue(value, { silenceNotifications: true });
    }
  }, [value]);

  return <math-field ref={init} onInput={onInput} style={style} />;
}
