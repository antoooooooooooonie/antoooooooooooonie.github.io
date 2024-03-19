import { useCallback, useEffect, useState } from "react";
import { debounce } from "../utils/debounce";

export const useWindowWidth = () => {
  const [state, setState] = useState({
    isMobile: false,
  });

  const onResizeHandler = useCallback(() => {
    setState({
      isMobile: window.innerWidth <= 500,
    });
  }, []);

  const debouncedCall = useCallback(
    () => debounce(onResizeHandler),
    [onResizeHandler]
  );

  const setup = useCallback(() => {
    return window.addEventListener("resize", debouncedCall(), false);
  }, [debouncedCall]);

  const cleanup = useCallback(() => {
    window.removeEventListener("resize", debouncedCall(), false);
  }, [debouncedCall]);

  useEffect(() => {
    onResizeHandler();

    setup();

    return () => {
      cleanup();
    };
  }, [cleanup, setup, onResizeHandler]);

  return state;
};
