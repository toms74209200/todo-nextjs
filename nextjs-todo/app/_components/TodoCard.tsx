type TodoCardProps = {
  title: string;
  description?: string;
  deadline?: Date;
  completed?: boolean;
  handleComplete?: () => void;
  hidden?: boolean;
};

export const TodoCard = ({
  title,
  completed,
  handleComplete,
  hidden,
}: TodoCardProps) => {
  return (
    <div
      className={
        "flex flex-col border rounded p-2 mb-2 " + `${hidden ? "hidden" : ""}`
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
