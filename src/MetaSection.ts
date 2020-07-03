import * as regression from "regression";
import { Section, Type, LineOptions, ChartDataSetsEx, BasicOptions, OverwritingType } from "./types";
import { MetaDataSet } from "./MetaData";
import { deepCopy } from "./tools";

const
    defaultOptions: BasicOptions = {
        type: "linear",
        precision: 2,
        line: {
            width: 2,
            color: '#000',
            dash: []
        },
        extendPredictions: false
    };

export interface Result extends regression.Result {
    type: Type;
}

export class MetaSection implements Section, BasicOptions {
    type: Type[];
    startIndex: number;
    endIndex: number;
    line: LineOptions;
    extendPredictions: boolean;
    copySectionIndex?: number;
    result?: regression.Result;
    copyOverData?: OverwritingType;
    private _regressionOptions: regression.Options;

    constructor(sec: Section, private _meta: MetaDataSet) {
        const chart = _meta.chart;
        const ds = _meta.dataset;
        // Copying from user config
        this.startIndex = sec.startIndex;
        this.endIndex = sec.endIndex;
        this.copySectionIndex = sec.copySectionIndex;
        this.copyOverData = sec.copyOverData;
        // Calculate inherited configuration 
        const globalOpts = getGlobalOptions();
        const cfg = simpleMerge('type,precision,extendPredictions', defaultOptions, globalOpts, ds.regressions, sec);
        this.line = simpleMerge('color,width,dash', defaultOptions.line, globalOpts.line, ds.regressions.line, sec.line);
        this.type = Array.isArray(cfg.type) ? cfg.type : [cfg.type];
        this._regressionOptions = { precision: cfg.precision || 2 };
        this.extendPredictions = cfg.extendPredictions;
        validate(this.type);

        // --- constructor helpers

        function getGlobalOptions() {
            let o, p;
            return (o = chart.config.options) && (p = o.plugins) && p.regressions || {};
        }
        function validate(type: Type[]) {
            if (type.length > 1 && type.includes('copy'))
                throw Error('Invalid regression type:' + cfg.type + '. "none" cannot be combined with other type!');
        }
        function simpleMerge(fieldNames: string, ...objs: any[]): any {
            const fields = fieldNames.split(',');
            const ret: any = {};
            for (const obj of objs) {
                if (!obj) continue;
                const o = deepCopy(obj, fields);
                for (const f of fields) {
                    if (typeof o[f] != 'undefined') ret[f] = o[f];
                }
            };
            return ret;
        }
    }

    calculate(ds: ChartDataSetsEx, meta: MetaDataSet) {
        const sectionData = meta.points.slice(this.startIndex, this.endIndex + 1);
        if (this.type[0] != 'copy') {
            this.result = this.type.reduce((max: any, type) => {
                const r: Result = (regression as any)[type](sectionData, this._regressionOptions);
                r.type = type;
                return (!max || max.r2 < r.r2) ? r : max;
            }, null);
        } else if (this.copySectionIndex) {
            const
                from = meta.sections[this.copySectionIndex],
                r = this.result = Object.assign({}, from.result),
                overwrite = this.copyOverData,
                data = ds.data!;
            r.points = sectionData.map(p => r.predict(p[0])) as any;
            delete r.r2;
            r.points.forEach(([index, value]) => {
                if (
                    (index < from.startIndex || index > from.endIndex) &&
                    (
                        overwrite == 'all' ||
                        overwrite == 'last' && index == this.endIndex ||
                        overwrite == 'empty' && !data[index]
                    )
                )
                    data[index] = value;
            });
        }
    }

    drawVerticalLine(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        this._setLineAttrs(ctx);
        ctx.setLineDash([10, 2]);
        ctx.lineWidth = 2;
        // Print vertical line
        const p = this._meta.getXY(this.endIndex, 0);
        ctx.moveTo(p.x, this._meta.topY!);
        ctx.lineTo(p.x, this._meta.bottomY!);
        // ctx.fillText(xScale.getLabelForIndex(this.end), p.x, yScale.top);
        ctx.fillText(this._meta.chart.data.labels![this.endIndex] as string, p.x, this._meta.topY!);
        ctx.stroke();
    }

    drawRegression(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        this._setLineAttrs(ctx);
        const points = this.result!.points;
        if (!points.length) return;
        let p = this._meta.getXY(this.startIndex, points[0][1]);
        ctx.moveTo(p.x, p.y);
        for (let k = 1, j = this.startIndex + 1; j <= this.endIndex; j++, k++) {
            // const y = this.result!.predict(j)[1];
            const y = (k < points.length ? points[k] : this.result!.predict(j))[1];
            p = this._meta.getXY(j, y);
            ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
    }

    private _setLineAttrs(ctx: CanvasRenderingContext2D) {
        if (this.line.width)
            ctx.lineWidth = this.line.width;
        if (this.line.color)
            ctx.strokeStyle = this.line.color;
        if (this.line.dash)
            ctx.setLineDash(this.line.dash);
    }

}