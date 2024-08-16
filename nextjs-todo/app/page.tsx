"use client";
import { useContext, useEffect, useState } from "react";
import { TodoCard } from "@/app/_components/TodoCard";
import { Todo } from "@/app/_models/Todo";
import { insertTodo } from "@/app/_models/insertTodo";
import { FirebaseAuthContext } from "@/app/_components/FirebaseAuthProvider";
import { FirestoreContext } from "@/app/_components/FirestoreProvider";
import { updateTodo } from "@/app/_models/updateTodo";
import { deleteTodo } from "./_models/deleteTodo";
import { signInAnonymously, User } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { Toast, useToast } from "@/app/_components/Toast";
import { Icon } from "@iconify/react/dist/iconify.js";

type ListViewState = "progress" | "completed";

const ToastView = ({
  message,
  handleClose,
}: {
  message: string;
  handleClose: () => void;
}) => {
  return (
    <div className="relative flex flex-row items-center pl-2 pr-6 py-2 bg-red-400 text-white">
      <Icon
        icon={"material-symbols:info-outline"}
        className={"text-3xl mr-2"}
      />
      <p>{message}</p>
      <div className={"absolute top-0 right-0"}>
        <button className={"p-2"} onClick={handleClose}>
          <Icon icon={"material-symbols:close"} />
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const auth = useContext(FirebaseAuthContext);
  const firestore = useContext(FirestoreContext);
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [viewState, setViewState] = useState<ListViewState>("progress");
  const [inputValue, setInputValue] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  const { toastRef, showToast, hideToast } = useToast();

  const instertTodoAction = async (
    idToken: string,
    uid: string,
    todo: Todo
  ) => {
    const error = await insertTodo(idToken, uid, todo);
    error &&
      showToast(<ToastView message={error.name} handleClose={hideToast} />);
    setInputValue("");
  };

  const updateTodoAction = async (idToken: string, uid: string, todo: Todo) => {
    const error = await updateTodo(idToken, uid, todo);
    error &&
      showToast(<ToastView message={error.message} handleClose={hideToast} />);
  };

  const deleteTodoAction = async (idToken: string, uid: string, id: string) => {
    const error = await deleteTodo(idToken, uid, id);
    error &&
      showToast(<ToastView message={error.message} handleClose={hideToast} />);
  };

  useEffect(() => {
    setIsDisabled(inputValue === "");
  }, [inputValue]);

  useEffect(() => {
    signInAnonymously(auth);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, [auth]);

  useEffect(() => {
    (async () => {
      if (user === null) {
        console.log("user is null");
        return;
      }
      const newIdToken = await user.getIdToken(true).catch((error) => {
        showToast(
          <ToastView message={error.message} handleClose={hideToast} />
        );
        return null;
      });
      newIdToken && setIdToken(newIdToken);
    })();
  }, [hideToast, showToast, user]);

  useEffect(() => {
    if (user === null) return;
    const unsubscribe = onSnapshot(
      collection(firestore, "users", `${user.uid}`, "todos"),
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
      },
      (error) => {
        showToast(
          <ToastView message={error.message} handleClose={hideToast} />
        );
      }
    );
    return () => {
      unsubscribe();
    };
  }, [firestore, hideToast, showToast, user]);

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
                  updateTodoAction(idToken!, user!.uid, {
                    ...todo,
                    completed: true,
                  });
                }}
                handleTrash={() => {
                  deleteTodoAction(idToken!, user!.uid, todo.id!);
                }}
                hidden={
                  viewState === "progress" ? todo.completed : !todo.completed
                }
              />
            </li>
          ))}
        </ul>

        <form
          className="flex flex-row m-4"
          action={() => {
            console.log(`${idToken}, ${user!.uid}`);
            instertTodoAction(idToken!, user!.uid, {
              title: inputValue,
              completed: false,
            });
          }}
        >
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
      <div className={"absolute top-8 right-0"}>
        <Toast ref={toastRef} />
      </div>
    </main>
  );
}
