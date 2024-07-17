import { Icon } from "@iconify/react/dist/iconify.js";
import { MouseEvent, useCallback, useState } from "react";

type TodoCardProps = {
  title: string;
  description?: string;
  deadline?: Date;
  completed?: boolean;
  handleComplete?: () => void;
  handleTrash?: () => void;
  hidden?: boolean;
};

export const TodoCard = ({
  title,
  completed,
  handleComplete,
  handleTrash,
  hidden,
}: TodoCardProps) => {
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState("");
  const [dragging, setDragging] = useState(false);

  const handleDragStart = useCallback((e: MouseEvent<HTMLElement>) => {
    setStartX(e.screenX);
    setDragging(true);
  }, []);

  const handleDrag = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (dragging) {
        setTranslateX(`translateX(${e.screenX - startX}px)`);
      }
    },
    [dragging, startX]
  );

  const handleDragEnd = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (e.clientX - startX > 50) {
        handleComplete && handleComplete();
      }

      setDragging(false);
      setStartX(0);
      setTranslateX("");
    },
    [handleComplete, startX]
  );

  return (
    <div
      className={
        "flex flex-col border rounded p-2 mb-2 bg-white " +
        `${hidden ? "hidden" : ""}`
      }
      draggable={!completed}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{ transform: `${translateX}` }}
    >
      <div className="flex flex-row justify-between items-center">
        <h3 className="font-bold">{title}</h3>
        <div>
          <button
            className={
              "p-1 text-slate-100 hover:text-black " +
              `${completed ? "hidden" : ""}`
            }
            onClick={handleComplete}
          >
            ✔
          </button>
          <button
            className="p-1 text-slate-100 hover:text-red-500"
            onClick={handleTrash}
          >
            <Icon icon="mdi:trash-can-outline" />
          </button>
        </div>
      </div>
    </div>
  );
};
