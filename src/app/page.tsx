"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await addDoc(collection(db, "todos"), {
      task: value,
      isDone: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    router.refresh();
  };

  if (!todos) return null;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          className=" focus:border-blue-500 p-2 focus:text-gray-700 rounded-md mr-4"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">submit</button>
      </form>
      <hr className="my-4" />
      {todos.map((item) => (
        <div key={item.id} className="flex items-center py-2 px-4 w-[400px]">
          <input
            className="mr-4"
            type="checkbox"
            defaultChecked={item.isDone}
            onChange={() => hendleChangeDone(item.id)}
          />
          <p className="mr-auto">{item.task}</p>
          <p>
            createdAt :{" "}
            {moment(new Date(item.createdAt?.seconds * 1000)).format(
              "M/DD HH:mm"
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
