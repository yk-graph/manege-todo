"use client";

import { FC } from "react";
import { clsx } from "clsx";

interface Props {
  mode: "create" | "update";
  handleClickCreate: () => void;
  handleClickUpdate: () => void;
}

const SwitcherButton: FC<Props> = ({
  mode,
  handleClickCreate,
  handleClickUpdate,
}) => {
  return (
    <>
      <span
        className={clsx(
          "cursor-pointer",
          mode === "create" ? "font-bold" : "text-neutral-700"
        )}
        onClick={handleClickCreate}
      >
        Create
      </span>
      <span
        className={clsx(
          "cursor-pointer",
          mode === "update" ? "font-bold" : "text-neutral-700"
        )}
        onClick={handleClickUpdate}
      >
        Update
      </span>
    </>
  );
};

export default SwitcherButton;
