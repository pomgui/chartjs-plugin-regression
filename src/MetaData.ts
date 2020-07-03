import { Options, DataPoint } from 'regression';
import { Section, LineOptions, ChartDataSetsEx } from './types';
import { Point } from 'chart.js';
import { MetaSection } from './MetaSection';

type GetXY = (index: number, y: number) => Point;

export class MetaDataSet {
    chart: Chart;
    dataset: ChartDataSetsEx;
    points: DataPoint[];

    /** Sections */
    sections: MetaSection[];

    /** Scales wil be initialized in beforeDraw hook */
    getXY: GetXY = undefined as any;
    topY?: number;
    bottomY?: number;

    constructor(chart: Chart, ds: ChartDataSetsEx) {
        const cfg = ds.regressions;
        const me = this;
        this.chart = chart;
        this.dataset = ds;
        this.sections = (cfg.sections || [{ startIndex: 0, endIndex: ds.data!.length - 1 }])
            .map((s: Section) => new MetaSection(s, this));
        this.points = (ds.data! as number[]).map((v, i) => [i, !i ? null : !v ? null : v]) as DataPoint[];

        me.sections.forEach(section => section.calculate(ds, this));  // Calculate Section Results
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
        const me = this;
        ctx.save();
        try {
            if (this.dataset.regressions.extendPredictions)
                _drawPredictions();
            for (let i = 0; i < this.sections.length; i++) {
                const section = this.sections[i];
                section.drawRegression(ctx);
                // if (i < this.sections.length - 1)
                //     section.drawVerticalLine(ctx);
            }
        } finally {
            ctx.restore();
        }
        return;


        /**
         * Draws the previous sections predictions as a dashed thin line
         */
        function _drawPredictions() {
            ctx.setLineDash([5, 5]);
            for (let i = 1; i < me.sections.length; i++) {
                const section = me.sections[i];
                for (let r = 0; r < i; r++) {
                    ctx.beginPath();
                    _setLineAttrs(me.sections[r].line!);
                    // ctx.lineWidth = 1; // overrides the width to a thin line
                    const fn = me.sections[r].result!.predict;
                    const calcXY = (index: number) => me.getXY(index, fn(index)[1]);
                    let p = calcXY(section.startIndex);
                    ctx.moveTo(p.x, p.y);
                    for (let j = section.startIndex + 1; j < section.endIndex + 1; j++) {
                        p = calcXY(j);
                        ctx.lineTo(p.x, p.y);
                    }
                    ctx.stroke();
                }
            }
        }

        function _setLineAttrs(line: LineOptions) {
            if (line.width)
                ctx.lineWidth = line.width;
            if (line.color)
                ctx.strokeStyle = line.color;
        }
    }
}
