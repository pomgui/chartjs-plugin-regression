# chartjs-plugin-regression
Chart.js 2.9+ plugin to calculate and display regressions.

## Demo
[Live Demo](https://pomgui.github.io/chartjs-plugin-regression/demo/)

## Download
[Compress](https://pomgui.github.io/chartjs-plugin-regression/dist/chartjs-plugin-regression.js)

## Installation

    npm install chartjs-plugin-regression

## Usage
JavaScript
```JavaScript
new Chart(ctx, {
  type: type,
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
  },
  options: {
    plugins: {
      regressions: {
        // Global configuration of the plugin, these values will be used unless each dataset defines their own
        type, line, precision, extendPredictions,
        // Callback function to know when the calculation have been completed for all the datasets.
        onCompleteCalculation: (chart)=> ...
      }
    }
  }
});
```
## License
The project is released under the [ISC license](https://github.com/pomgui/chartjs-plugin-regression/blob/master/LICENSE).

## Contact
Author: Wilfredo Pomier (wpomier@pomgui.com)
