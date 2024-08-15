import {
  MouseEvent,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export interface ToastHandles {
  show: (children: ReactNode) => void;
  hide: () => void;
}

interface ToastProps {}

export const useToast = () => {
  const toastRef = useRef<ToastHandles>(null);
  const showToast = useCallback((children: ReactNode) => {
    toastRef.current && toastRef.current.show(children);
  }, []);
  const hideToast = useCallback(() => {
    toastRef.current && toastRef.current.hide();
  }, []);
  return {
    toastRef,
    showToast,
    hideToast,
  };
};

export const Toast = forwardRef<ToastHandles, ToastProps>(({}, ref) => {
  const [poping, setPoping] = useState(false);
  const [displayed, setDisplayed] = useState(false);
  const [children, setChildren] = useState<ReactNode | null>(null);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState("");

  useImperativeHandle(
    ref,
    () => ({
      show: (children) => {
        setChildren(children);
        setPoping(true);
        setDisplayed(true);
      },
      hide: () => {
        setPoping(false);
      },
    }),
    []
  );

  useEffect(() => {
    const timeout = setTimeout(() => setPoping(false), 5000);
    return () => clearTimeout(timeout);
  }, [poping]);

  useEffect(() => {
    if (!poping) {
      const timeout = setTimeout(() => setDisplayed(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [poping]);

  const onDragEnter = useCallback((e: MouseEvent<HTMLElement>) => {
    setStartX(e.screenX);
  }, []);

  const onDrag = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      setTranslateX(`translateX(${e.screenX - startX})`);
      if (e.screenX - startX > 50) {
        setPoping(false);
      }
    },
    [startX]
  );

  return (
    <div
      className={
        `${displayed ? "" : "hidden"} ` +
        `${poping ? "mx-8" : "-mx-8 translate-x-full"} ` +
        "transition-transform duration-300 ease-in-out " +
        "min-w-32 rounded bg-white text-center shadow-md "
      }
      draggable={true}
      onDragEnter={onDragEnter}
      onDrag={onDrag}
      style={{ transform: `${poping ? `${translateX}` : ""}` }}
    >
      {children}
    </div>
  );
});

Toast.displayName = "Toast";
