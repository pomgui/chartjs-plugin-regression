'use strict'

var demo = new function () {
    this.NUM_NORMAL_ELEMS = 50;
    this.NUM_ELEMS_2 = (this.NUM_NORMAL_ELEMS / 2) | 0;
    this.NUM_ELEMS_4 = (this.NUM_NORMAL_ELEMS / 4) | 0;
    this.NUM_ELEMS_34 = (3 * this.NUM_NORMAL_ELEMS / 4) | 0;
    this.NUM_ELEMS_PREDICT = this.NUM_NORMAL_ELEMS + 10;

    this.groups = [
        {
            title: 'Single Regression Type',
            samples: [
                {
                    subtitle: 'Linear regression',
                    // optionsCfg: {},
                    datasetCfg: { type: 'linear', line: { color: 'red' } }
                },
                {
                    subtitle: 'Exponential regression',
                    // optionsCfg: {},
                    datasetCfg: { type: 'exponential', line: { color: '#0000ff', width: 3 } }
                },
                {
                    subtitle: 'Polynomial regression',
                    // optionsCfg: {},
                    datasetCfg: { type: 'polynomial', line: { color: '#0000ff', width: 3 }, precision: 10 }
                },
                {
                    subtitle: 'Power regression',
                    // optionsCfg: {},
                    datasetCfg: { type: 'power', line: { color: '#0000ff', width: 3 } }
                },
                {
                    subtitle: 'Logarithmic',
                    // optionsCfg: {},
                    datasetCfg: { type: 'logarithmic', precision: 10, line: { color: '#0000ff', width: 3 } }
                },
            ]
        }, {
            title: 'Drawing the best regression type',
            samples: [
                {
                    subtitle: 'Best R² between Exponential and Polynomial',
                    // optionsCfg: {},
                    datasetCfg: { type: ['exponential', 'polynomial'], line: { color: '#0000ff', width: 3 } }
                },
            ]
        }, {
            title: 'Sections',
            samples: [
                {
                    subtitle: 'Single section of the data',
                    optionsCfg: {
                        line: { color: 'red', width: 3 },
                    },
                    datasetCfg: {
                        type: ['linear', 'exponential', 'polynomial'],
                        sections: [
                            { startIndex: this.NUM_ELEMS_4, endIndex: this.NUM_ELEMS_34 },
                        ]
                    }
                },
                {
                    subtitle: 'Multiple sections extending previous predictions',
                    optionsCfg: {
                        line: { color: 'blue', width: 3 },
                    },
                    datasetCfg: {
                        type: ['linear', 'exponential', 'polynomial'],
                        extendPredictions: true,
                        sections: [
                            { startIndex: 0, endIndex: this.NUM_ELEMS_2, line: { color: 'red' } },
                            { startIndex: this.NUM_ELEMS_2, endIndex: this.NUM_NORMAL_ELEMS - 1 }
                        ]
                    }
                },
            ]
        },
        {
            title: 'Multiple regressions',
            samples: [
                {
                    subtitle: 'One dataset with 3 different regressions',
                    chartType: 'line',
                    // optionsCfg: {},
                    datasetCfg: {
                        line: { width: 3, color: 'blue' },
                        sections: [
                            { type: 'linear', startIndex: 0, endIndex: this.NUM_NORMAL_ELEMS - 1, line: { width: 1.5 } },
                            { type: 'polynomial', startIndex: 0, endIndex: this.NUM_NORMAL_ELEMS - 1, line: { color: 'orange', dash: [8, 2] } },
                            { type: 'exponential', startIndex: 0, endIndex: this.NUM_NORMAL_ELEMS - 1, line: { color: 'red' } },
                        ]
                    }
                },]
        },
        {
            title: 'Using predictions from other section',
            samples: [
                {
                    prediction: 'all',
                    subtitle: 'Overwrites the last section\'s data',
                    chartType: 'bar',
                    // optionsCfg: {},
                    datasetCfg: {
                        type: ['linear', 'exponential', 'polynomial'],
                        line: { color: 'blue', width: 3 },
                        extendPredictions: true,
                        sections: [
                            { startIndex: 0, endIndex: this.NUM_ELEMS_2 },
                            { startIndex: this.NUM_ELEMS_2, endIndex: this.NUM_NORMAL_ELEMS - 1, line: { color: 'orange' } },
                            { type: 'copy', copySectionIndex: 1, copyOverData: 'all', startIndex: this.NUM_NORMAL_ELEMS - 1, endIndex: this.NUM_NORMAL_ELEMS + 9, line: { color: 'purple' } },
                        ]
                    }
                },
                {
                    prediction: 'none',
                    subtitle: 'Without overwriting the last section\'s data',
                    chartType: 'bar',
                    // optionsCfg: {},
                    datasetCfg: {
                        type: ['linear', 'exponential', 'polynomial'],
                        line: { color: 'blue', width: 3 },
                        extendPredictions: true,
                        sections: [
                            { startIndex: 0, endIndex: this.NUM_ELEMS_2 },
                            { startIndex: this.NUM_ELEMS_2, endIndex: this.NUM_NORMAL_ELEMS - 1, line: { color: 'orange' } },
                            { type: 'copy', copySectionIndex: 1, copyOverData: 'none', startIndex: this.NUM_NORMAL_ELEMS - 1, endIndex: this.NUM_NORMAL_ELEMS + 9, line: { color: 'purple' } },
                        ]
                    }
                },
                {
                    prediction: 'last',
                    subtitle: 'Overwrites only the last data item',
                    chartType: 'bar',
                    // optionsCfg: {},
                    datasetCfg: {
                        type: ['linear', 'exponential', 'polynomial'],
                        line: { color: 'blue', width: 3 },
                        extendPredictions: true,
                        sections: [
                            { startIndex: 0, endIndex: this.NUM_ELEMS_2 },
                            { startIndex: this.NUM_ELEMS_2, endIndex: this.NUM_NORMAL_ELEMS - 1, line: { color: 'orange' } },
                            { type: 'copy', copySectionIndex: 1, copyOverData: 'last', startIndex: this.NUM_NORMAL_ELEMS - 1, endIndex: this.NUM_NORMAL_ELEMS + 9, line: { color: 'purple' } },
                        ]
                    }
                },
            ]
        },
        {
            title: 'Configuration inheritance',
            samples: [
                {
                    subtitle: 'Inherits precision',
                    optionsCfg: { precision: 5 },
                    datasetCfg: { type: 'linear' }
                },
                {
                    subtitle: 'Inherits all but sections in two datasets',
                    numDatasets: 2,
                    chartType: 'line',
                    optionsCfg: { type: 'linear', precision: 4 },
                    datasetCfg: {}
                },
                {
                    subtitle: 'Inherits line and overrides type',
                    optionsCfg: { type: 'linear', line: { width: 3, dash: [2, 2], color: '#f00' } },
                    datasetCfg: { type: 'polynomial' }
                }
            ]
        },
    ];
}
