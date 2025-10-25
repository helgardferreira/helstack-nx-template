import type { ScaleLinear, ScaleTime } from 'd3';
import { type ComponentProps, Show, mergeProps, splitProps } from 'solid-js';

import type { ChartDimensions } from '../../../utils';

import { AxisHorizontal } from './axis-horizontal';
import { AxisVertical } from './axis-vertical';

type AxisProps<
  Range,
  Output,
  Scale extends ScaleLinear<Range, Output> | ScaleTime<Range, Output>,
> = ComponentProps<'g'> & {
  axis?: 'x' | 'y';
  dimensions: ChartDimensions;
  formatTick?: (tick: ReturnType<Scale['ticks']>[number]) => number | string;
  label?: string;
  scale: Scale;
  ticks?: number[];
};

export function Axis<
  Range,
  Output,
  Scale extends ScaleLinear<Range, Output> | ScaleTime<Range, Output>,
>(props: AxisProps<Range, Output, Scale>) {
  const merged = mergeProps({ axis: 'x' as 'x' | 'y' }, props);
  const [local, rest] = splitProps(merged, ['axis']);

  return (
    <Show when={local.axis === 'x'} fallback={<AxisVertical {...rest} />}>
      <AxisHorizontal {...rest} />
    </Show>
  );
}
