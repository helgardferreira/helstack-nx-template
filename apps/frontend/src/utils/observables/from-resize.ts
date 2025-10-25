import { Observable } from 'rxjs';

export type ResizeObservable = Observable<{
  entries: ResizeObserverEntry[];
  observer: ResizeObserver;
}>;

export const fromResize = (
  target: Element,
  options?: ResizeObserverOptions
): ResizeObservable => {
  return new Observable((subscriber) => {
    const resizeObserver = new ResizeObserver((entries, observer) =>
      subscriber.next({ entries, observer })
    );

    resizeObserver.observe(target, options);

    return () => resizeObserver.disconnect();
  });
};
