"use client";
import { useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTodos([...todos, inputValue]);
    setInputValue("");
  };

  return (
    <main className="flex justify-center w-screen h-screen">
      <div className="flex flex-col justify-center max-w-md">
        <ul className="h-3/4">
          {todos.map((todo, index) => (
            <li key={index}>{todo}</li>
          ))}
        </ul>

        <form className="flex flex-row m-4" onSubmit={handleSubmit}>
          <input
            type="text"
            className={"border rounded px-2 bg-slate-50 focus:bg-white"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className={"border py-1 px-2 m-2 rounded"}>
            Add
          </button>
        </form>
      </div>
    </main>
  );
}
