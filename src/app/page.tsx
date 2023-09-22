"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

import { db } from "@/firebase";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

type TodoType = {
  id: string;
  task: string;
  isDone: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export default function Home() {
  const router = useRouter();

  const [todos, setTodos] = useState<TodoType[]>();
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState<TodoType>();
  const [mode, setMode] = useState<"create" | "update">("create");

  // Read items from database
  useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let _todos: TodoType[] = [];

      querySnapshot.forEach((doc) => {
        _todos.push({ id: doc.id, ...doc.data() } as TodoType);
      });

      setTodos(
        _todos.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
      );

      return () => unsubscribe();
    });
  }, []);

  const hendleChangeDone = async (id: string) => {
    await updateDoc(doc(db, "todos", id), {
      isDone: !todos?.find((item) => item.id === id)?.isDone,
    });
    router.refresh();
  };

  const handleClickTodo = (id: string) => {
    setMode("update");
    const selectedTodo = todos?.find((item) => item.id === id);

    setSelected(selectedTodo);
    setValue(selectedTodo?.task || "");
  };

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

  if (!todos) return null;

  return (
    <>
      <div className="flex items-center gap-x-4 px-4">
        <span
          className={clsx(
            "cursor-pointer",
            mode === "create" ? "font-bold" : "text-neutral-700"
          )}
          onClick={() => {
            setMode("create");
            setValue("");
          }}
        >
          Create
        </span>
        <span
          className={clsx(
            "cursor-pointer",
            mode === "update" ? "font-bold" : "text-neutral-700"
          )}
          onClick={() => setMode("update")}
        >
          Update
        </span>
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
      <hr className="my-4" />
      {todos.map((item) => (
        <div key={item.id} className="flex items-center py-2 px-4 w-[400px]">
          <input
            className="mr-4"
            type="checkbox"
            defaultChecked={item.isDone}
            onChange={() => hendleChangeDone(item.id)}
          />
          <p
            className="mr-auto cursor-pointer"
            onClick={() => handleClickTodo(item.id)}
          >
            {item.task}
          </p>
          <p>
            createdAt :{" "}
            {moment(new Date(item.createdAt?.seconds * 1000)).format(
              "M/DD HH:mm"
            )}
          </p>
        </div>
      ))}
    </>
  );
}
