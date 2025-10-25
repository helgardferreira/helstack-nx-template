type ChartMargin = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

type ChartDimensions = {
  boundedHeight: number;
  boundedWidth: number;
  height: number;
  margin: ChartMargin;
  width: number;
};

export type { ChartDimensions, ChartMargin };
