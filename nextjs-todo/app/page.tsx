"use client";
import { useEffect, useState } from "react";

type Todo = {
  title: string;
  description?: string;
  deadline?: Date;
  completed: boolean;
};

type TodoCardProps = {
  title: string;
  description?: string;
  deadline?: Date;
  completed?: boolean;
  handleComplete?: () => void;
};

const TodoCard = ({ title, completed, handleComplete }: TodoCardProps) => {
  return (
    <div
      className={
        "flex flex-col border rounded p-2 mb-2 " +
        `${completed ? " bg-slate-300 " : ""}`
      }
    >
      <div className="flex flex-row justify-between items-center">
        <h3 className="font-bold">{title}</h3>
        <button
          className={
            "p-1 text-slate-100 hover:text-black " +
            `${completed ? "hidden" : ""}`
          }
          onClick={handleComplete}
        >
          ✔
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTodos([
      ...todos,
      {
        title: inputValue,
        completed: false,
      },
    ]);
    setInputValue("");
  };

  useEffect(() => {
    setIsDisabled(inputValue === "");
  }, [inputValue]);

  return (
    <main className="flex justify-center w-screen h-screen">
      <div className="flex flex-col justify-center max-w-md">
        <ul className="h-3/4">
          {todos.map((todo, index) => (
            <li key={index}>
              <TodoCard
                title={todo.title}
                completed={todo.completed}
                handleComplete={() => {
                  const newTodos = [...todos];
                  newTodos[index].completed = true;
                  setTodos(newTodos);
                }}
              />
            </li>
          ))}
        </ul>

        <form className="flex flex-row m-4" onSubmit={handleSubmit}>
          <input
            type="text"
            className={"border rounded px-2 bg-slate-50 focus:bg-white"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className={"border py-1 px-2 m-2 rounded disabled:text-gray-400"}
            disabled={isDisabled}
          >
            Add
          </button>
        </form>
      </div>
    </main>
  );
}
