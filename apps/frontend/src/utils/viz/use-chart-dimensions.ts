import { isEqual } from 'lodash';
import {
  type Observable,
  combineLatestWith,
  distinctUntilChanged,
  map,
  from as rxFrom,
} from 'rxjs';
import {
  type Accessor,
  type Setter,
  observable,
  from as solidFrom,
} from 'solid-js';

import { useContentResize } from '../use-content-resize';

import { computeChartDimensions } from './compute-chart-dimensions';
import type { ChartDimensions, ChartMargin } from './types';

type UseChartDimensionsOptions = {
  height?: number;
  margin?: Partial<ChartMargin>;
  width?: number;
};

type UseChartDimensionsResult<T extends Element> = [
  setRef: Setter<T | undefined>,
  contentRect: Accessor<ChartDimensions>,
  contentRect$: Observable<ChartDimensions>,
];

export const useChartDimensions = <T extends Element>(
  options: () => UseChartDimensionsOptions
): UseChartDimensionsResult<T> => {
  const [setRef, _, contentRect$] = useContentResize<T>();

  const options$ = rxFrom(observable(options));

  const dimensions$ = contentRect$.pipe(
    combineLatestWith(options$),
    map(([contentRect, options]) =>
      computeChartDimensions({
        contentRect,
        height: options.height,
        margin: options.margin,
        width: options.width,
      })
    ),
    distinctUntilChanged((a, b) => isEqual(a, b))
  );

  const dimensions = solidFrom(dimensions$, computeChartDimensions(options()));

  return [setRef, dimensions, dimensions$];
};
