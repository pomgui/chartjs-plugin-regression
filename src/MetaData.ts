import { Options, DataPoint } from 'regression';
import { Section, LineOptions, ChartDataSetsEx, DatasetConfig } from './types';
import { Point } from 'chart.js';
import { MetaSection } from './MetaSection';

type GetXY = (index: number, y: number) => Point;

export class MetaDataSet {
    chart: Chart;
    dataset: ChartDataSetsEx;

    /** Sections */
    sections: MetaSection[];

    /** Scales wil be initialized in beforeDraw hook */
    getXY: GetXY = undefined as any;
    topY?: number;
    bottomY?: number;

    constructor(chart: Chart, ds: ChartDataSetsEx) {
        const cfg = ds.regressions;
        this.chart = chart;
        this.dataset = ds;
        this.sections = this._createMetaSections(cfg);
        this._calculate();
    }

    /** @private */
    _createMetaSections(cfg: DatasetConfig): MetaSection[] {
        const source = cfg.sections || [{ startIndex: 0, endIndex: this.dataset.data!.length - 1 }];
        return source.map((s: Section) => new MetaSection(s, this));
    }

    /** @private */
    _calculate() {
        this.sections.forEach(section => section.calculate(this.dataset, this));  // Calculate Section Results
    }

    adjustScales() {
        if (this.topY !== undefined) return;
        let xScale: any;
        let yScale: any;
        const scales = (this.chart as any).scales;
        Object.keys(scales).forEach(k => k[0] == 'x' && (xScale = scales[k]) || (yScale = scales[k]));
        this.topY = yScale.top;
        this.bottomY = yScale.bottom;
        this.getXY =
            (index: number, y: number) =>
                ({
                    x: xScale.getPixelForValue(undefined, index, undefined, true),
                    y: yScale.getPixelForValue(y)
                });
    }

    draw() {
        const ctx: CanvasRenderingContext2D = (this.chart as any).chart.ctx;
        ctx.save();
        try {
            this.sections.forEach(section => section.drawRegressions(ctx));
        } finally {
            ctx.restore();
        }
    }
}
