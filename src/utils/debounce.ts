export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  timeout = 300
) {
  let timer: number;

  return function <U>(context: U) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context);
    }, timeout);
  };
}
