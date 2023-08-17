import { ReactNode } from "react";

type Props = {
  label: ReactNode
  element: ReactNode
}

const FormRow = ({label, element}: Props) => {
  return (
    <>
      <div className="pb-2">
        <label className="fw-bold">{label}</label>
      </div>
      <div className="pb-2">
        {element}
      </div>
    </>
  );
};

export {FormRow}