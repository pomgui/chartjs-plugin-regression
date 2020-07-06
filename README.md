# chartjs-plugin-regression
Chart.js plugin to calculate and draw statistical linear, exponential, power, 
logarithmic, and polynomial regressions using chart datasets data.

The plugin, at the current version, uses the [regression](https://www.npmjs.com/package/regression)
npm package as its calculation engine.

### Important
- Only `bar`, `line`, and `scatter` chart types are supported.
- The plugin works just fine since chart.js@2.5.0, however chart.js may have some problems handling certain color configuration (not related with the plugin). No problems have been found since chart.js@2.6.0.
- The plugin does not work with chart.js@3.x

## Demo
For a better understanding of the capabilities of this plugin, please see this 
[Live Demo](https://pomgui.github.io/chartjs-plugin-regression/demo/).

## Download
The [compressed](https://pomgui.github.io/chartjs-plugin-regression/dist/chartjs-plugin-regression-0.2.1.js)
version includes the regression package.

## Installation

    npm install --save chartjs-plugin-regression

## Usage

For a single chart, it needs to be listed in plugins section. 

### Example:

```javaScript
new Chart(ctx, {
  type: 'bar',
  plugins: [
    // This chart will use the plugin
    ChartRegressions
  ],
  data: {
    ...
    datasets: [
      {
        ...
        // Configuration of the plugin per dataset (only will be drawn the datasets with this property) 
        regressions: {
          type: 'linear',
          line: { color: 'red', width: 3},
          ...
        }
      }
    ]
    ...
  }
});
```

Also, it's possible to register the plugin for all the charts:

```Javascript
Chart.plugins.register(ChartRegressions);
```

## Configuration

The plugin has three levels of configuration:

- global (for all the datasets in a chart)
- Per dataset
- Per section

There are common properties that the three levels share, and the priority of them are: section, dataset, and global.

### Common properties

Common to the three levels of configuration.

| Property | Description |
|---|---|
| type | Type of regression to be calculated. It can be 'copy', 'linear', 'exponential', 'power', 'polynomial', 'polynomial3', 'polynomial4', or 'logarithmic'. It also can be an array with a combination of these types, in which case the regression type with the best [_R²_](https://en.wikipedia.org/wiki/Coefficient_of_determination) will be drawn. |
| line | Line configuration for drawing the regression. It has the following properties: `{width, color, dash}` |
| calculation | Precision and polynomial order of the values returned by the regression calculations |
| extendPredictions | Previous sections predictions for the current section will be drawed as dashed lines |
| copy | Only if type=='copy'. Behavior of sections that copy other section's calculation |

Some considerations:

- `type`: polynomial3 and polynomial4 are pseudo-types added for convenience, they allow combinationss where the plugin will draw the regression with bigger R². Example:

```javascript
{
  type: ['polynomial', 'polynomial3', 'polynomial4'],
  calculation: {order 2}
}
```

- `calculation` has the following properties:

| Property | Description |
|---|---|
| `precision` | Determines how many decimals will have the results (default: 2). |
| `order` | Only for `polynomial` regression type, i.e. `polynomial3` and `polynomial4` are not affected by this property. Example: _ax² + bx + c_ has order 2.  |

- `copy` has the following properties:

| Property | Description |
|---|---|
| `overwriteData` | Possible values: 'none', 'all', 'empty', or 'last'. Default: 'none'. It determines how the dataset's data will be overwritten in this section (empty: Only zero, undefined, or null data will be overwriten). **Obs.** the plugin is only prepared to overwrite numerical data arrays, e.g. `[1,2,3,...]`, scatter charts use xy data arrays, e.g. `[{x:1,y:1}, {x:2,y:2},...]`, with them the behavior is undetermined. In these cases it's better use `overwriteData: 'none'`. |
| `minValue` | Minimum value that the predicted value can be written into the data. |
| `maxValue` | Maximum value that the predicted value can be written into the data. |

### Global

The global configuration affects all the regressions calculated for all the datasets in the chart. It contains all the common properties and the following properties:

| Property | Description |
|---|---|
| onCompleteCalculation | Callback called when the regressions for all the datasets in a chart have been calculated |

Example:

```javascript
options: {
  plugins: {
    regressions: {
      type: ['linear', 'polynomial'],
      line: { color: 'blue', width: 3 },
      onCompleteCalculation: function callback(chart){ ... }
    }
  }
}
```

### Per Dataset

It's possible to configure the regressions per dataset. The configuration will contain all the common properties and the following properties:

| Property | Description |
|---|---|
| sections | Array of sections of the data that shall be drawn. If not specified it's assumed `[{start:0,end:data.length-1}]` |

Example:

```javascript
datasets: [
  {
    ...
    // Configuration of the plugin per dataset (only will be drawn the datasets with this property) 
    regressions: {
      type: ['linear','exponential'],
      line: { color: '#ff0', width: 3},
      calculation: { precision: 5 },
      sections: [{startIndex: 10, endIndex: 50}],
      ...
    }
  }
]
```

### Per Section

Each section can be configured independently using all the common properties and the following properties:

| Property | Description |
|---|---|
| startIndex | Start index on dataset's data. Default: 0 |
| endIndex | End index on dataset's data. Default: data.length-1 |
| label | Label that will be drawn in the top of the right border line. Default: xaxis' label |  
| copy.fromSectionIndex | Copy the predictions calculated by other section (the one with index fromSectionIndex) |

Example:

```javascript
datasets: [
  {
    ...
    // Configuration of the plugin per dataset (only will be drawn the datasets with this property) 
    regressions: {
      line: { width: 3 },
      calculation: { precision: 5 },
      sections: [
        {
          type: ['linear','exponential'],
          line: { color: 'red' },
          startIndex: 10, 
          endIndex: 50
        },
        {
          type: 'polynomial',
          line: { color: 'green' },
          startIndex: 50, 
          endIndex: 80,
          calculation: { order: 4 }
        },
      ]
    }
  }
  ...
]
```

## API

### .getDataset(chart, datasetIndex)

Returns the metadata associated to one dataset used internally by the plugin to work.

```javascript
var meta = ChartRegressions.getDataset(chart, datasetIndex);
```

This object provides the following information:

| Property | Description |
|---|---|
| `sections` | array of sections for each dataset (it will contain at least 1 section) |
| `getXY(x, y)` | Returns the canvas coordinates {x,y} for the data point `x, y`. |
| `topY` | Minimum y coordinate in the canvas. |
| `bottomY` | Maximum y coordinate in the canvas. |

### .getSections(chart, datasetIndex)

Returns the sections with all the properties calculated (some with default values, or inherited from dataset's plugin configuration or the global configuration in options).

This object provides the following information:

| Property | Description |
|---|---|
| `type` | array of regression types used to calculate and draw the section. |
| `startIndex` | Index of the dataset's data. |
| `endIndex` | Index of the dataset's data. |
| `line` | Configuration used to draw the lines {color, width, dash}. |
| `result` | Regression calculation result (see [demo](https://pomgui.github.io/chartjs-plugin-regression/demo/)) to see how to use this information. |

## Events

### onCompleteCalculation(chart)

The plugin provides one single event to inform when the calculation of all the regresions for a chart have been conmpleted. 

This callback should be configured in the chart options.

Example:

```javascript
options: {
  plugins: {
    regressions: {
      onCompleteCalculation: function callback(chart){ ... }
    }
  }
}
```

## License
The project is released under the [ISC license](https://github.com/pomgui/chartjs-plugin-regression/blob/master/LICENSE).
