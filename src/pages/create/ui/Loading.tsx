import { FC } from "react";

type Props = {

}

const Loading: FC<Props> = () => {
  return (
    <div className="placeholder-glow pb-2">
      <span className="placeholder col-6"></span>
      <span className="placeholder w-75"></span>
      <span className="placeholder w-25"></span>
      <span className="placeholder w-75"></span>
      <span className="placeholder w-25"></span>
      <span className="placeholder w-75"></span>
      <span className="placeholder w-25"></span>
      <span className="placeholder w-75"></span>
      <span className="placeholder w-25"></span>
    </div>
  );
};

export default Loading