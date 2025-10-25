import type { ChartDimensions, ChartMargin } from './types';

type ComputeChartDimensionsOptions = {
  contentRect?: DOMRectReadOnly;
  height?: number;
  margin?: Partial<ChartMargin>;
  width?: number;
};

export const computeChartDimensions = (
  options: ComputeChartDimensionsOptions = {}
): ChartDimensions => {
  const height = options.height ?? options.contentRect?.height ?? 0;
  const width = options.width ?? options.contentRect?.width ?? 0;

  const margin: ChartMargin = {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    ...options.margin,
  };

  const boundedHeight = Math.max(height - margin.top - margin.bottom, 0);
  const boundedWidth = Math.max(width - margin.left - margin.right, 0);

  return {
    boundedHeight,
    boundedWidth,
    height,
    margin,
    width,
  };
};
