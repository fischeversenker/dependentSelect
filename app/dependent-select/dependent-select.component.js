/**
 * Created by felix on 02.10.2016.
 */

angular.module('dependentSelect')
    // filters the options using the availableOptions array
    // given as argument in template
    .filter('optionfilter', function() {
        return function(opts, availableOptions) {
            var filtered = [];
            angular.forEach(opts, function(opt) {
                if (typeof availableOptions !== "undefined" && availableOptions.indexOf(opt.id) >= 0) filtered.push(opt);
            });
            return filtered;
        };
    })
    .component('dependentSelect', {
        templateUrl: 'dependent-select/dependent-select.template.html',
        controller: ['$scope', '$rootScope', function depSelController($scope, $rootScope) {
            // get an id for this select element by registering at the mainCtrl
            var ctrl = this;
            ctrl.selectId = $rootScope.registerSelect(ctrl, this.type);

            $scope.opts = $rootScope.data[this.type];
            $scope.myOpt = null;
            $scope.availableOptions = $rootScope.countTo($scope.opts.length - 1);

            // default option to show if nothing is selected yet
            $scope.defaultOpt = {
                text: ">-- choooooose --<"
            };

            // watches $scope.myOpt for changes and informs mainCtrl
            $scope.$watch("myOpt", function(newOpt, oldOpt) {
                $rootScope.signalUpdate(ctrl.selectId, parseInt(oldOpt), parseInt(newOpt));
            });

            // receives updated availableOptions from mainctrl
            ctrl.updateOptions = function(avaOpts) {
              $scope.availableOptions = avaOpts;
            }
        }],
        bindings: {
            type: '@'
        }
    });
