import * as regression from "regression";
import { Section, Type, LineOptions, ChartDataSetsEx, BasicOptions, OverwritingType, CalculationOptions, CopyOptions } from "./types";
import { MetaDataSet } from "./MetaData";

const
    defaultConfig: BasicOptions = {
        type: "linear",
        calculation: {
            precision: 2,
            order: 2
        },
        line: {
            width: 2,
            color: '#000',
            dash: []
        },
        extendPredictions: false,
        copy: {
            overwriteData: 'none'
        }
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
    copy: CopyOptions;
    calculation: CalculationOptions;

    constructor(sec: Section, private _meta: MetaDataSet) {
        const chart = _meta.chart;
        const ds = _meta.dataset;
        // Copying from user config
        this.copySectionIndex = sec.copySectionIndex;
        // Calculate inherited configuration
        const cfg = getConfig(['type', 'calculation', 'line', 'extendPredictions', 'copy']);
        this.startIndex = sec.startIndex || 0;
        this.endIndex = sec.endIndex || ds.data!.length - 1;
        this.type = Array.isArray(cfg.type) ? cfg.type : [cfg.type];
        this.line = cfg.line;
        this.calculation = cfg.calculation;
        this.extendPredictions = cfg.extendPredictions;
        this.copy = cfg.copy;
        validate(this.type);

        // --- constructor helpers

        function getConfig(fields: string[]): any {
            let o, p;
            const globalConfig = (o = chart.config.options) && (p = o.plugins) && p.regressions || {};
            return configMerge(fields, defaultConfig, globalConfig, ds.regressions, sec);
        }
        function configMerge(fields: string[], ...cfgList: any[]): any {
            const dstConfig: any = {};
            fields.forEach(f => {
                cfgList.forEach(srcConfig => {
                    const o = srcConfig[f];
                    const t = typeof o;
                    if (t != 'undefined') {
                        if (Array.isArray(o) || t != 'object' || o == null) dstConfig[f] = o;
                        else dstConfig[f] = Object.assign({}, dstConfig[f], configMerge(Object.keys(o), o));
                    }
                });
            });
            return dstConfig;
        }
        function validate(type: Type[]) {
            if (type.length > 1 && type.includes('copy'))
                throw Error('Invalid regression type:' + cfg.type + '. "none" cannot be combined with other type!');
        }
    }

    calculate(ds: ChartDataSetsEx, meta: MetaDataSet) {
        const sectionData = meta.points.slice(this.startIndex, this.endIndex + 1);
        if (this.type[0] != 'copy') {
            this.result = this.type.reduce((max: any, type) => {
                const r: Result = (regression as any)[type](sectionData, this.calculation);
                r.type = type;
                return (!max || max.r2 < r.r2) ? r : max;
            }, null);
        } else if (this.copySectionIndex) {
            const
                from = meta.sections[this.copySectionIndex],
                r = this.result = Object.assign({}, from.result),
                overwrite = this.copy.overwriteData,
                data = ds.data!;
            r.points = sectionData.map(p => r.predict(p[0])) as any;
            delete r.r2;
            if (overwrite != 'none')
                r.points.forEach(([index, value]) => {
                    if (
                        (index < from.startIndex || index > from.endIndex) &&
                        (
                            overwrite == 'all' ||
                            overwrite == 'last' && index == this.endIndex ||
                            overwrite == 'empty' && !data[index]
                        )
                    ) {
                        if (this.copy.maxValue) value = Math.min(this.copy.maxValue, value);
                        if (this.copy.minValue) value = Math.max(this.copy.minValue, value);
                        data[index] = value;
                    }
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