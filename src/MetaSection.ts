import * as regression from 'regression';
import {
  Section,
  Type,
  LineOptions,
  BasicOptions,
  CalculationOptions,
  CopyOptionsEx
} from './types';
import { MetaDataSet } from './MetaData';

const defaultConfig: BasicOptions = {
  type: 'linear',
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
  result?: regression.Result;
  copy: CopyOptionsEx;
  calculation: CalculationOptions;
  label: string;

  constructor(sec: Section, private _meta: MetaDataSet) {
    const chart = _meta.chart;
    const ds = _meta.dataset;
    const cfg = getConfig([
      'type',
      'calculation',
      'line',
      'extendPredictions',
      'copy'
    ]);
    this.startIndex = sec.startIndex || 0;
    this.endIndex = sec.endIndex || ds.data!.length - 1;
    this.type = Array.isArray(cfg.type) ? cfg.type : [cfg.type];
    this.line = cfg.line;
    this.calculation = cfg.calculation;
    this.extendPredictions = cfg.extendPredictions;
    this.copy = cfg.copy;
    this.label =
      sec.label || (this._meta.chart.data.labels![this.endIndex] as string);
    this._validateType();

    // --- constructor helpers

    /**
     * Calculate the inherited configuration from defaultConfig, globalConfig,
     * dataset config, and section config (in that order)
     */
    function getConfig(fields: string[]): any {
      let o, p;
      const globalConfig =
        ((o = chart.config.options) && (p = o.plugins) && p.regressions) || {};
      return configMerge(
        fields,
        defaultConfig,
        globalConfig,
        ds.regressions,
        sec
      );

      /** merge the config objects */
      function configMerge(fields: string[], ...cfgList: any[]): any {
        const dstConfig: any = {};
        fields.forEach(f => {
          cfgList.forEach(srcConfig => {
            const o = srcConfig[f];
            const t = typeof o;
            if (t != 'undefined') {
              if (Array.isArray(o) || t != 'object' || o == null)
                dstConfig[f] = o;
              else
                dstConfig[f] = Object.assign(
                  {},
                  dstConfig[f],
                  configMerge(Object.keys(o), o)
                );
            }
          });
        });
        return dstConfig;
      }
    }
  }
  /** Validates the type to avoid inconsistences */
  _validateType() {
    if (this.type.length > 1 && this.type.includes('copy'))
      throw Error(
        'Invalid regression type:' +
          this.type +
          '. "none" cannot be combined with other type!'
      );
  }

  /** Calculates the regression(s) and sets the result objects */
  calculate() {
    const sectionData = this._meta.normalizedData.slice(
      this.startIndex,
      this.endIndex + 1
    );
    if (this.type[0] == 'copy') this._calculateCopySection(sectionData);
    else this._calculateBestR2(sectionData);
  }

  private _calculateBestR2(sectionData: regression.DataPoint[]) {
    this.result = this.type.reduce((max: any, type) => {
      let calculation = Object.assign({}, this.calculation);
      let realType = type;
      if (/polynomial[34]$/.test(type)) {
        calculation.order = parseInt(type.substr(10));
        realType = type.substr(0, 10) as Type;
      }
      const r: Result = (regression as any)[realType](sectionData, calculation);
      r.type = type;
      return !max || max.r2 < r.r2 ? r : max;
    }, null);
  }

  private _calculateCopySection(sectionData: regression.DataPoint[]) {
    const from = this._meta.sections[this.copy.fromSectionIndex!];
    const r = (this.result = Object.assign({}, from.result));
    const overwrite = this.copy.overwriteData;
    const data = this._meta.normalizedData;

    r.points = sectionData.map(p => r.predict(p[0])) as any;
    delete (r as any).r2;
    
    if (overwrite != 'none') {
      const dsdata = this._meta.dataset.data!;
      const isXY = this._meta.isXY;

      r.points.forEach(([x, y], i) => {
        const index = i + this.startIndex;
        if (
          (index < from.startIndex || index > from.endIndex) &&
          (overwrite == 'all' ||
            (overwrite == 'last' && index == this.endIndex) ||
            (overwrite == 'empty' && !data[index]))
        ) {
          if (this.copy.maxValue) y = Math.min(this.copy.maxValue, y);
          if (this.copy.minValue !== undefined)
            y = Math.max(this.copy.minValue, y);
          dsdata[index] = isXY ? { x, y } : y;
        }
      });
    }
  }

  drawRightBorder(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    this._setLineAttrs(ctx);
    ctx.setLineDash([10, 2]);
    ctx.lineWidth = 2;
    // Print vertical line
    const p = this._meta.getXY(this.endIndex, 0);
    ctx.moveTo(p.x, this._meta.topY!);
    ctx.lineTo(p.x, this._meta.bottomY!);
    ctx.fillStyle = this.line.color!;
    ctx.fillText(this.label, p.x, this._meta.topY!);
    ctx.stroke();
  }

  drawRegressions(ctx: CanvasRenderingContext2D): void {
    for (let i = 0, len = this._meta.sections.length; i < len; i++) {
      const section = this._meta.sections[i];
      const isMe = section == this;
      if (
        (isMe && this.type[0] != 'copy') ||
        (!isMe && this.extendPredictions)
      ) {
        section.drawRange(ctx, this.startIndex, this.endIndex, !isMe);
      }
      if (isMe) break;
    }
  }

  drawRange(
    ctx: CanvasRenderingContext2D,
    startIndex: number,
    endIndex: number,
    forceDash: boolean
  ): void {
    ctx.beginPath();
    this._setLineAttrs(ctx);
    if (forceDash) ctx.setLineDash([5, 5]);
    const predict = this.result!.predict;
    const f = (x: number) => this._meta.getXY(x, predict(x)[1]);
    let p = f(startIndex);
    ctx.moveTo(p.x, p.y);
    for (let x = startIndex + 1; x <= endIndex; x++) {
      p = f(x);
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }

  private _setLineAttrs(ctx: CanvasRenderingContext2D) {
    if (this.line.width) ctx.lineWidth = this.line.width;
    if (this.line.color) ctx.strokeStyle = this.line.color;
    if (this.line.dash) ctx.setLineDash(this.line.dash);
  }
}
