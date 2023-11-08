"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";

import { db } from "@/firebase";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import SwitcherButton from "../switcher-button";

type TodoType = {
  id: string;
  task: string;
  isDone: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
interface Props {
  selected?: TodoType;
}

const Header: FC<Props> = ({ selected }) => {
  const router = useRouter();

  const [value, setValue] = useState("");
  const [mode, setMode] = useState<"create" | "update">("create");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!value) {
      alert("なんか入力してね");
      return;
    }

    if (mode === "create") {
      await addDoc(collection(db, "todos"), {
        task: value,
        isDone: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    if (mode === "update" && !!value) {
      await updateDoc(doc(db, "todos", selected!.id), {
        task: value,
      });
    }

    setValue("");
    setMode("create");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-x-4 p-4">
      <SwitcherButton
        mode={mode}
        handleClickCreate={() => {
          setMode("create");
          setValue("");
        }}
        handleClickUpdate={() => setMode("update")}
      />
      <form onSubmit={handleSubmit}>
        <input
          className=" focus:border-blue-500 p-2 text-gray-700 rounded-md mr-4"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default Header;
