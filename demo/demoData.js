'use strict';

var demo = new (function () {
  this.NUM_NORMAL_ELEMS = 50;
  this.NUM_ELEMS_2 = (this.NUM_NORMAL_ELEMS / 2) | 0;
  this.NUM_ELEMS_4 = (this.NUM_NORMAL_ELEMS / 4) | 0;
  this.NUM_ELEMS_34 = ((3 * this.NUM_NORMAL_ELEMS) / 4) | 0;
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
          datasetCfg: {
            type: 'exponential',
            line: { color: '#0000ff', width: 3 }
          }
        },
        {
          subtitle: 'Polynomial regression',
          // optionsCfg: {},
          datasetCfg: {
            type: 'polynomial',
            line: { color: '#0000ff', width: 3 },
            calculation: { precision: 10, order: 4 }
          }
        },
        {
          subtitle: 'Power regression',
          // optionsCfg: {},
          datasetCfg: { type: 'power', line: { color: '#0000ff', width: 3 } }
        },
        {
          subtitle: 'Logarithmic',
          // optionsCfg: {},
          datasetCfg: {
            type: 'logarithmic',
            calculation: { precision: 10 },
            line: { color: '#0000ff', width: 3 }
          }
        }
      ]
    },
    {
      title: 'Drawing the best regression type',
      samples: [
        {
          subtitle: 'Best R² between Exponential and Polynomial',
          // optionsCfg: {},
          datasetCfg: {
            type: ['exponential', 'polynomial'],
            line: { color: '#0000ff', width: 3 },
            calculation: { order: 3 }
          }
        }
      ]
    },
    {
      title: 'Sections',
      samples: [
        {
          subtitle: 'Single section of the data',
          optionsCfg: {
            line: { color: 'red', width: 3 }
          },
          datasetCfg: {
            type: ['linear', 'exponential', 'polynomial'],
            sections: [
              { startIndex: this.NUM_ELEMS_4, endIndex: this.NUM_ELEMS_34 }
            ]
          }
        },
        {
          subtitle: 'Multiple sections extending previous predictions',
          optionsCfg: {
            line: { color: 'blue', width: 3 }
          },
          datasetCfg: {
            type: ['linear', 'exponential', 'polynomial'],
            extendPredictions: true,
            sections: [
              { endIndex: this.NUM_ELEMS_2, line: { color: 'red' } },
              {
                startIndex: this.NUM_ELEMS_2,
                endIndex: this.NUM_NORMAL_ELEMS - 1
              }
            ]
          }
        },
        {
          subtitle: 'Multiple sections with custom label on right border',
          optionsCfg: {
            line: { color: 'blue', width: 3 }
          },
          datasetCfg: {
            type: ['linear', 'exponential', 'polynomial'],
            extendPredictions: true,
            sections: [
              {
                endIndex: this.NUM_ELEMS_2,
                line: { color: 'red' },
                label: 'custom text'
              },
              {
                startIndex: this.NUM_ELEMS_2,
                endIndex: this.NUM_NORMAL_ELEMS - 1
              }
            ]
          }
        }
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
              { type: 'linear', line: { width: 1.5 } },
              { type: 'polynomial', line: { color: 'orange', dash: [8, 2] } },
              { type: 'exponential', line: { color: 'red' } }
            ]
          }
        },
        {
          subtitle: 'One dataset with 3 polynomial with different order',
          chartType: 'line',
          optionsCfg: { type: 'polynomial', line: { width: 3, color: 'blue' } },
          datasetCfg: {
            sections: [
              { calculation: { order: 2 }, line: { width: 1.5 } },
              {
                calculation: { order: 3 },
                line: { color: 'orange', dash: [8, 2] }
              },
              { calculation: { order: 4 }, line: { color: 'red' } }
            ]
          }
        }
      ]
    },
    {
      title: "Drawing predictions using other section's regression",
      samples: [
        {
          prediction: 'none',
          subtitle: "Without overwriting the last section's data",
          chartType: 'bar',
          // optionsCfg: {},
          datasetCfg: {
            type: ['linear', 'exponential', 'polynomial'],
            line: { color: 'blue', width: 3 },
            extendPredictions: true,
            sections: [
              { endIndex: this.NUM_ELEMS_2 },
              {
                startIndex: this.NUM_ELEMS_2,
                endIndex: this.NUM_NORMAL_ELEMS - 1,
                line: { color: 'red' }
              },
              {
                type: 'copy',
                copy: { fromSectionIndex: 1, overwriteData: 'none' },
                startIndex: this.NUM_NORMAL_ELEMS - 1
              }
            ]
          }
        },
        {
          prediction: 'all',
          subtitle: "Overwrites the last section's data",
          chartType: 'bar',
          // optionsCfg: {},
          datasetCfg: {
            type: ['linear', 'exponential', 'polynomial'],
            line: { color: 'blue', width: 3 },
            extendPredictions: true,
            sections: [
              { endIndex: this.NUM_ELEMS_2 },
              {
                startIndex: this.NUM_ELEMS_2,
                endIndex: this.NUM_NORMAL_ELEMS - 1,
                line: { color: 'red' }
              },
              {
                type: 'copy',
                copy: { fromSectionIndex: 1, overwriteData: 'all' },
                startIndex: this.NUM_NORMAL_ELEMS - 1
              }
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
              { endIndex: this.NUM_ELEMS_2 },
              {
                startIndex: this.NUM_ELEMS_2,
                endIndex: this.NUM_NORMAL_ELEMS - 1,
                line: { color: 'red' }
              },
              {
                type: 'copy',
                copy: { fromSectionIndex: 1, overwriteData: 'last' },
                startIndex: this.NUM_NORMAL_ELEMS - 1
              }
            ]
          }
        }
      ]
    },
    {
      title: 'Configuration inheritance',
      samples: [
        {
          subtitle: 'Inherits calculation: precision',
          optionsCfg: { calculation: { precision: 5 } },
          datasetCfg: { type: 'linear' }
        },
        {
          subtitle: 'Inherits all in two different datasets',
          numDatasets: 2,
          chartType: 'line',
          optionsCfg: { type: 'linear', calculation: { precision: 4 } },
          datasetCfg: {}
        },
        {
          subtitle:
            'Inherits line and polynomial order, but overrides type and precision',
          optionsCfg: {
            type: 'linear',
            line: { width: 3, dash: [2, 2], color: '#f00' },
            calculation: { precision: 5, order: 4 }
          },
          datasetCfg: { type: 'polynomial', calculation: { precision: 3 } }
        }
      ]
    }
  ];
})();
