import { MetaDataSet } from './MetaData';
import {
  PluginServiceGlobalRegistration,
  PluginServiceRegistrationOptions,
  Easing
} from 'chart.js';
import { MetaSection } from './MetaSection';
import { ChartDataSetsEx, OptionsConfig } from './types';

// Cache for all plugins' metadata
var _metadataMap: any = {};
var _chartId = 0;

interface ChartEx extends Chart {
  $$id: number;
}

class Plugin
  implements PluginServiceGlobalRegistration, PluginServiceRegistrationOptions
{
  id = 'regressions';

  beforeInit(chart: any) {
    chart.$$id = ++_chartId;
  }

  /**
   * Called after update (when the chart is created and when chart.update() is called)
   * @param chart
   */
  beforeUpdate?(chart: Chart, options?: any): void {
    let o, p, r: OptionsConfig;
    const onComplete =
      (o = chart.config.options) &&
      (p = o.plugins) &&
      (r = p.regressions) &&
      r.onCompleteCalculation;

    forEach(chart, (ds, meta, datasetIndex) => {
      meta = new MetaDataSet(chart, ds);
      const id = (chart as ChartEx).$$id * 1000 + datasetIndex;
      _metadataMap[id] = meta;
    });
    if (onComplete) onComplete(chart);
  }

  /**
   * It's called once before all the drawing
   * @param chart
   */
  beforeRender(chart: Chart, options?: any): void {
    forEach(chart, (ds, meta) => meta.adjustScales());
  }

  /** Draws the vertical lines before the datasets are drawn */
  beforeDatasetsDraw(chart: Chart, easing: Easing, options?: any): void {
    forEach(chart, (ds, meta) => meta.drawRightBorders());
  }

  /** Draws the regression lines */
  afterDatasetsDraw(chart: Chart, easing: Easing, options?: any): void {
    forEach(chart, (ds, meta) => meta.drawRegressions());
  }

  destroy(chart: Chart): void {
    Object.keys(_metadataMap)
      .filter((k: any) => (k / 1000) >> 0 == (chart as ChartEx).$$id)
      .forEach(k => delete _metadataMap[k]);
  }

  /** Get dataset's meta data */
  getDataset(chart: ChartEx, datasetIndex: number): MetaDataSet {
    const id = chart.$$id * 1000 + datasetIndex;
    return _metadataMap[id];
  }

  /** Get dataset's meta sections */
  getSections(chart: ChartEx, datasetIndex: number): MetaSection[] {
    const ds = this.getDataset(chart, datasetIndex);
    return ds && ds.sections;
  }
}

function forEach(
  chart: any,
  fn: (ds: ChartDataSetsEx, meta: MetaDataSet, datasetIndex: number) => void
) {
  chart.data.datasets.forEach((ds: ChartDataSetsEx, i: number) => {
    if (ds.regressions && chart.isDatasetVisible(i)) {
      const meta = ChartRegressions.getDataset(chart, i);
      fn(ds, meta, i);
    }
  });
}

export const ChartRegressions = new Plugin();

declare var window: any;
window.ChartRegressions = ChartRegressions;
