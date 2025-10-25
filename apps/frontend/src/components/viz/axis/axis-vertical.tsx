import { type ScaleLinear, type ScaleTime, format } from 'd3';
import {
  type ComponentProps,
  For,
  Show,
  createMemo,
  mergeProps,
  splitProps,
} from 'solid-js';

import type { ChartDimensions } from '../../../utils';

type AxisVerticalProps<
  Range,
  Output,
  Scale extends ScaleLinear<Range, Output> | ScaleTime<Range, Output>,
> = ComponentProps<'g'> & {
  dimensions: ChartDimensions;
  formatTick?: (tick: ReturnType<Scale['ticks']>[number]) => number | string;
  label?: string;
  scale: Scale;
  ticks?: number[];
};

export function AxisVertical<
  Range,
  Output,
  Scale extends ScaleLinear<Range, Output> | ScaleTime<Range, Output>,
>(props: AxisVerticalProps<Range, Output, Scale>) {
  const merged = mergeProps({ formatTick: format(',') }, props);
  const [local, rest] = splitProps(merged, [
    'dimensions',
    'formatTick',
    'label',
    'scale',
    'ticks',
  ]);

  const numberOfTicks = createMemo(() => local.dimensions.boundedHeight / 70);

  const ticks = createMemo(
    () => local.ticks ?? local.scale.ticks(numberOfTicks())
  );

  return (
    <g {...rest}>
      <line class="stroke-zinc-800" y2={local.dimensions.boundedHeight} />

      <For each={ticks()}>
        {(tick) => (
          <text
            class="font-mono text-xs transition-all duration-300 ease-out"
            dominant-baseline="central"
            text-anchor="end"
            transform={`translate(-8, ${local.scale(tick)})`}
          >
            {local.formatTick(tick)}
          </text>
        )}
      </For>

      <Show when={local.label}>
        <text
          class="text-sm font-medium"
          text-anchor="middle"
          dominant-baseline="central"
          transform={`translate(${-local.dimensions.margin.left + 12}, ${
            local.dimensions.boundedHeight / 2
          }) rotate(-90)`}
        >
          {local.label}
        </text>
      </Show>
    </g>
  );
}
