"use client";
import { useContext, useEffect, useState } from "react";
import { TodoCard } from "@/app/_components/TodoCard";
import { Todo } from "@/app/_models/Todo";
import { insertTodo } from "@/app/_models/insertTodo";
import { FirestoreContext } from "@/app/_components/FirestoreProvider";
import { updateTodo } from "@/app/_models/updateTodo";
import { deleteTodo } from "./_models/deleteTodo";
import { signInAnonymously } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";

type ListViewState = "progress" | "completed";

export default function Home() {
  const firestore = useContext(FirestoreContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [viewState, setViewState] = useState<ListViewState>("progress");
  const [inputValue, setInputValue] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  const instertTodoAction = async () => {
    await insertTodo({
      title: inputValue,
      completed: false,
    });
    setInputValue("");
  };

  const updateTodoAction = async (todo: Todo) => {
    await updateTodo(todo);
  };

  const deleteTodoAction = async (id: string) => {
    await deleteTodo(id);
  };

  useEffect(() => {
    setIsDisabled(inputValue === "");
  }, [inputValue]);

  useEffect(() => {
    signInAnonymously(auth);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User is signed in");
      } else {
        console.log("User is signed out");
      }
    });
    return () => {
      unsubscribe();
    };
  }, [auth]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "todos"),
      async (snapshot) => {
        const newTodos: Todo[] = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            title: doc.data().title,
            description: doc.data().description,
            deadline: doc.data().deadline,
            completed: doc.data().completed,
          };
        });
        setTodos(newTodos);
      });
    return () => {
      unsubscribe();
    };
  }, [firestore]);

  return (
    <main className="flex justify-center w-screen h-screen">
      <div className="flex flex-col justify-center max-w-md">
        <div className="my-2 border-b">
          <button
            className={
              "p-2 mx-2 rounded-s " +
              `${
                viewState === "progress"
                  ? "bg-slate-50 border-b"
                  : "text-gray-400"
              }`
            }
            onClick={() => setViewState("progress")}
          >
            Progress
          </button>
          <button
            className={
              "p-2 mx-2 rounded-s " +
              `${
                viewState === "completed"
                  ? "bg-slate-50 border-b"
                  : "text-gray-400"
              }`
            }
            onClick={() => setViewState("completed")}
          >
            Completed
          </button>
        </div>
        <ul className="h-3/4">
          {todos.map((todo, index) => (
            <li key={index}>
              <TodoCard
                title={todo.title}
                completed={todo.completed}
                handleComplete={() => {
                  updateTodoAction({ ...todo, completed: true });
                }}
                handleTrash={() => {
                  deleteTodoAction(todo.id!);
                }}
                hidden={
                  viewState === "progress" ? todo.completed : !todo.completed
                }
              />
            </li>
          ))}
        </ul>

        <form className="flex flex-row m-4" action={instertTodoAction}>
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
