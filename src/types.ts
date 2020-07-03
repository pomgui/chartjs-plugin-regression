import { ChartDataSets } from 'chart.js';
import { MetaSection } from './MetaSection';
import * as regression from 'regression';

export type Type = 'copy' | 'linear' | 'exponential' | 'power' | 'polynomial' | 'logarithmic';
export type OverwritingType = 'none' | 'all' | 'empty' | 'last';

export interface LineOptions {
    width?: number;
    color?: string;
    dash?: number[];
}

export type CalculationOptions = regression.Options;

export interface BasicOptions {
    /** Type of regression to be calculated for all the sections unless they define their own type */
    type?: Type | Type[];
    /** Line configuration for all the sections unless they define their own line */
    line?: LineOptions;
    /** Precision and polynomial order of the values returned by the regression calculations */
    calculation?: CalculationOptions;
    /** Previous sections predictions for the current section will be drawed as dashed lines */
    extendPredictions?: boolean;
    /** 
     * If type=='copy' the dataset's data could be overwriten:
     * none - No data will be overwriten (default)
     * all  - All data will be overwriten.
     * empty- Only zero, undefined, or null data will be overwriten.
     * last - Only the last item (data[endIndex]) will be overwriten.
     */
    copyOverData?: OverwritingType;
}

export interface Section extends BasicOptions {
    startIndex: number;
    endIndex: number;
    /**
     * If type=='copy' no regression will be calculated, but the data will 
     * be filled from the predictions calculated by the regression in 
     * the section with index copySectionIndex
     */
    copySectionIndex?: number;
}

export interface ChartDataSetsEx extends ChartDataSets {
    $$id: number;
    regressions: DatasetConfig
}

export interface DatasetConfig extends BasicOptions {
    /** Sections (index) of the data that shall draw a regression. If not specified it's assumed {start:0,end:data.length-1} */
    sections?: Section[];
}

/** 
 * The options.plugin.regressions have a global configuration that can be override by 
 * the Dataset or Section configuration.
 * Example: If In options is configured a precision, all the datasets and sections will 
 * use it, unless they set their own precision.
 * This hierarchical configuration avoids repetitive configurations
 */
export interface OptionsConfig extends BasicOptions {
    /** 
     * Callback called when the regressions for all the datasets in 
     * a chart have been calculated
     */
    onCompleteCalculation?: (chart: Chart) => void;
}
