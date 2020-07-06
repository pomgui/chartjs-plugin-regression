import { Options, DataPoint } from 'regression';
import { Section, LineOptions, ChartDataSetsEx, DatasetConfig } from './types';
import { Point } from 'chart.js';
import { MetaSection } from './MetaSection';

type GetXY = (x: number, y: number) => Point;

export class MetaDataSet {
  chart: Chart;
  dataset: ChartDataSetsEx;

  /** Sections */
  sections: MetaSection[];

  /** Scales wil be initialized in beforeDraw hook */
  getXY: GetXY = undefined as any;
  topY?: number;
  bottomY?: number;

  /** Normalized dataset's data */
  normalizedData: DataPoint[];
  /** Is the dataset's data an array of {x,y}? */
  isXY = false;

  constructor(chart: Chart, ds: ChartDataSetsEx) {
    const cfg = ds.regressions;
    this.chart = chart;
    this.dataset = ds;
    this.normalizedData = this._normalizeData(ds.data!);
    this.sections = this._createMetaSections(cfg);
    this._calculate();
  }

  /**
   * Normalize data to DataPoint[]
   * Only supports number[] and {x:number,y:number}
   */
  _normalizeData(data: any[]): DataPoint[] {
    return data.map((value: any, index: number) => {
      let p: DataPoint;
      if (typeof value == 'number' || value == null || value === undefined) {
        p = [index, value];
      } else {
        this.isXY = true;
        p = [value.x as number, value.y as number];
      }
      return p;
    });
  }

  /** @private */
  _createMetaSections(cfg: DatasetConfig): MetaSection[] {
    const source = cfg.sections || [
      { startIndex: 0, endIndex: this.dataset.data!.length - 1 }
    ];
    return source.map((s: Section) => new MetaSection(s, this));
  }

  /** @private */
  _calculate() {
    this.sections.forEach(section => section.calculate()); // Calculate Section Results
  }

  adjustScales() {
    if (this.topY !== undefined) return;
    let xScale: any;
    let yScale: any;
    const scales = (this.chart as any).scales;
    Object.keys(scales).forEach(
      k => (k[0] == 'x' && (xScale = scales[k])) || (yScale = scales[k])
    );
    this.topY = yScale.top;
    this.bottomY = yScale.bottom;
    this.getXY = (x: number, y: number) => ({
      x: xScale.getPixelForValue(x, undefined, undefined, true),
      y: yScale.getPixelForValue(y)
    });
  }

  drawRegressions() {
    const ctx: CanvasRenderingContext2D = (this.chart as any).chart.ctx;
    ctx.save();
    try {
      this.sections.forEach(section => section.drawRegressions(ctx));
    } finally {
      ctx.restore();
    }
  }

  drawRightBorders() {
    const ctx: CanvasRenderingContext2D = (this.chart as any).chart.ctx;
    ctx.save();
    try {
      for (let i = 0; i < this.sections.length - 1; i++)
        this.sections[i].drawRightBorder(ctx);
    } finally {
      ctx.restore();
    }
  }
}
