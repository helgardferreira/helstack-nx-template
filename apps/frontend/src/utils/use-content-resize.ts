import {
  EMPTY,
  type Observable,
  map,
  from as rxFrom,
  switchMap,
  tap,
} from 'rxjs';
import {
  type Accessor,
  type Setter,
  createSignal,
  observable,
  from as solidFrom,
} from 'solid-js';

import { fromResize } from './observables';

type UseContentResizeResultOptions = {
  onResize?: ResizeObserverCallback;
  onChange?: (contentRect: DOMRectReadOnly, observer: ResizeObserver) => void;
};

type UseContentResizeResult<T extends Element> = [
  setRef: Setter<T | undefined>,
  contentRect: Accessor<DOMRectReadOnly | undefined>,
  contentRect$: Observable<DOMRectReadOnly>,
];

export const useContentResize = <T extends Element>(
  options: UseContentResizeResultOptions = {}
): UseContentResizeResult<T> => {
  const [ref, setRef] = createSignal<T>();

  const contentRect$ = rxFrom(observable(ref)).pipe(
    switchMap((element) =>
      element !== undefined ? fromResize(element) : EMPTY
    ),
    tap(({ entries, observer }) => {
      options.onResize?.(entries, observer);
      options.onChange?.(entries[0].contentRect, observer);
    }),
    map(({ entries }) => entries[0].contentRect)
  );

  const contentRect = solidFrom(contentRect$);

  return [setRef, contentRect, contentRect$];
};
