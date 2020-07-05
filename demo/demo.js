var app = angular.module('demoApp', []);
app.controller('DemoController', function () {
    this.groups = demo.groups;
    this.format = helpers.formatJson;
});

app.directive('piChart', function () {
    var me = this;
    return {
        restrict: 'E',
        template:
            '<canvas></canvas>' +

            '<button ng-disabled="btnShuffle!=\'shuffle\'" ng-click="shuffle()" ng-bind="btnShuffle"></button>' +
            '<table class="info">' +
            '  <tr ng-repeat="s in results" ng-style="{color: s.line.color}">' +
            '    <td>{{s.type}}</td>' +
            '    <td>R² = {{s.r2}}</td>' +
            '    <td>{{s.string}}</td>' +
            '  </tr>' +
            '</table>',
        scope: {
            sample: '<'
        },
        link: piChart_LinkFn
    };
});

function piChart_LinkFn($scope, element) {
    $scope.shuffle = shuffle;
    var chart, chartType, isBarChart;
    var numElems = $scope.sample.prediction
        ? demo.NUM_ELEMS_PREDICT : demo.NUM_NORMAL_ELEMS;
    var chartConfig = createChartConfiguration();
    shuffle();
    return;

    function createChartConfiguration() {
        chartType = $scope.sample.chartType;
        if (!chartType)
            chartType = ['bar', 'line'][helpers.rnd(2)];
        isBarChart = chartType == 'bar';

        // Chart.js configuration:
        return {
            type: chartType,
            data: {
                labels: new Array(numElems).fill().map((v, i) => i),
                // helpers.generateLabels(numElems, $scope.sample.prediction),
                datasets: generateDatasets(
                    $scope.sample.numDatasets || 1,
                    $scope.sample.datasetCfg
                )
            },
            plugins: [ChartRegressions],
            options: {
                plugins: {
                    // Global configuration of the plugin for all the datasets 
                    regressions: {
                        onCompleteCalculation: showRegressionResults,
                        ...$scope.sample.optionsCfg
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        };
    }

    /** Change the data, so the regression results may change as well */
    function shuffle() {
        $scope.btnShuffle = 'wait...';
        var s = $scope.sample;
        var dsType = s.datasetCfg.type;
        var opType = s.optionsCfg && s.optionsCfg.type;
        chartConfig.data.datasets.forEach(function (ds) {
            ds.data = helpers.generateRandomData(numElems, dsType || opType, s.prediction);
        });

        // Update or create the chart
        if (chart) chart.update();
        else {
            var canvas = element[0].firstChild;
            chart = new Chart(canvas, chartConfig);
        }
    }

    function generateDatasets(numDatasets, datasetCfg) {
        var ds = [];
        for (var i = 0; i < numDatasets; i++) {
            var color = helpers.rnd(23);
            ds.push({
                label: 'data#' + (i + 1),
                data: undefined, // settled in shuffle() function
                borderColor: helpers.generateColors(numElems, color, 1),
                backgroundColor:
                    !isBarChart ? helpers.color(color, .5) :
                        helpers.generateColors(numElems, color, .5),
                // fill: isBarChart,
                showLine: isBarChart,
                // Configuration of the plugin for the dataset:
                regressions: datasetCfg
            });
        }
        return ds;
    }

    function showRegressionResults(chart2) {
        // $scope.$apply(function () {
        var results = [];
        for (var i = 0; i < ($scope.sample.numDatasets || 1); i++) {
            var sections = ChartRegressions.getSections(chart2, i);
            sections.forEach(function (s) {
                if (s.result.r2) {
                    s = Object.assign({ line: s.line }, s.result);
                    s.r2 = (Math.round(s.r2 * 1000) / 10) + '%';
                    results.push(s);
                }
            });
        }
        $scope.results = results;
        $scope.btnShuffle = 'shuffle';
        // });
    }
}
