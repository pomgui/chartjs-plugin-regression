import { MetaDataSet } from './MetaData';
import { PluginServiceGlobalRegistration, PluginServiceRegistrationOptions } from 'chart.js';
import { MetaSection } from './MetaSection';
import { ChartDataSetsEx, OptionsConfig } from './types';

interface ChartEx extends Chart {
    $$id: number;
}

class Plugin implements PluginServiceGlobalRegistration, PluginServiceRegistrationOptions {
    id = 'regressions';

    private _chartId = 0;
    private _metadataMap = new Map<number, MetaDataSet>();

    beforeInit(chart: any) {
        chart.$$id = ++this._chartId;
    }

    /**
     * Called after update (when the chart is created and when chart.update() is called)
     * @param chart 
     */
    beforeUpdate(chart: ChartEx) {
        let o, p, r: OptionsConfig;
        const onComplete = (o = chart.config.options) && (p = o.plugins)
            && (r = p.regressions) && r.onCompleteCalculation;

        forEach(chart, (ds, meta, datasetIndex) => {
            meta = new MetaDataSet(chart, ds);
            const id = chart.$$id * 1000 + datasetIndex;
            this._metadataMap.set(id, meta);
        });
        if (onComplete)
            onComplete(chart);
    }

    /**
     * It's called once before all the drawing
     * @param chart 
     */
    beforeRender(chart: ChartEx) {
        forEach(chart, (ds, meta) => meta.adjustScales());
    }

    afterDatasetsDraw(chart: ChartEx) {
        forEach(chart, (ds, meta) => meta.draw());
    }

    destroy(chart: ChartEx) {
        Array.from(this._metadataMap.keys())
            .filter(k => (k / 1000) >> 0 == chart.$$id)
            .forEach(k => this._metadataMap.delete(k));
    }

    /** Get dataset's meta data */
    getDataset(chart: ChartEx, datasetIndex: number): MetaDataSet {
        const id = chart.$$id * 1000 + datasetIndex;
        return this._metadataMap.get(id)!;
    }

    /** Get dataset's meta sections */
    getSections(chart: ChartEx, datasetIndex: number): MetaSection[] {
        const ds = this.getDataset(chart, datasetIndex);
        return ds && ds.sections;
    }
}

function forEach(chart: any, fn: (ds: ChartDataSetsEx, meta: MetaDataSet, datasetIndex: number) => void) {
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
