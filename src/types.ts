import { ChartDataSets } from 'chart.js';
import * as regression from 'regression';

export type Type = 'copy' | 'linear' | 'exponential' | 'power' | 'polynomial' | 'logarithmic';
export type OverwritingType = 'none' | 'all' | 'empty' | 'last';

export interface LineOptions {
    width?: number;
    color?: string;
    dash?: number[];
}

export type CalculationOptions = regression.Options;

export interface CopyOptions {
    /** 
     * none - No data will be overwriten (default)
     * all  - All data will be overwriten.
     * empty- Only zero, undefined, or null data will be overwriten.
     * last - Only the last item (data[endIndex]) will be overwriten.
     */
    overwriteData?: OverwritingType;
    /** Minimum value that the predicted value can be written into the data */
    minValue?: number;
    /** Maximum value that the predicted value can be written into the data */
    maxValue?: number;
}

export interface BasicOptions {
    /** Type of regression to be calculated for all the sections unless they define their own type */
    type?: Type | Type[];
    /** Line configuration for all the sections unless they define their own line */
    line?: LineOptions;
    /** Precision and polynomial order of the values returned by the regression calculations */
    calculation?: CalculationOptions;
    /** Previous sections predictions for the current section will be drawed as dashed lines */
    extendPredictions?: boolean;
    /** * Only if type=='copy' */
    copy?: CopyOptions;
}

export interface CopyOptionsEx extends CopyOptions {
    /** Copy the predictions calculated by the section with index fromSectionIndex */
    fromSectionIndex?: number;
}

export interface Section extends BasicOptions {
    /** Start index on dataset's data. Default: 0 */
    startIndex?: number;
    /** End index on dataset's data. Default: data.length-1 */
    endIndex?: number;
    /** If type=='copy' the section can be configured with this extended options for copy */
    copy?: CopyOptionsEx;
    /** Label that will be drawn in the top of the right border line. Default: xaxis' label */
    label?: string;
}

export interface ChartDataSetsEx extends ChartDataSets {
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
