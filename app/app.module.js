/**
 * Created by felix on 13.08.2016.
 */

var app = angular.module('selectApp', [
    'dependentSelect',
]);

app.controller('mainCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {

    // array of registered select elements
    var ctrl = this;
    ctrl.selects = [],

    // load predefined options to choose from
    $http.get('app.options.json')
      .then(function(res){
        $rootScope.data = prepareJSON(res.data);
        $scope.data = $rootScope.data;
    });

    // registers select element to the rootscope for easy handling
    $rootScope.registerSelect = function(select, group) {
        var oldLength = ctrl.selects.length;
        ctrl.selects.push({
            id: oldLength,
            ctrl: select,
            avaOpts: $rootScope.countTo(oldLength),
            group: group
        });
        // update initial availableOptions for each select
        // except the one we are currently adding (bcoz alrdy up2d8)
        doForEverySelectExcept(group, oldLength, function(select) {
            select.avaOpts = $rootScope.countTo(oldLength)
        });
        return oldLength;
    };

    // informs every select about changes in the availableOptions
    // except the signaling one
    $rootScope.signalUpdate = function(selectId, oldO, newO) {
      // free old option for every select except signaling one
      if(!isNaN(oldO)) doForEverySelectExcept(ctrl.selects[selectId].group, selectId, freeOption, oldO);
      // lock new option ...
      if(!isNaN(newO)) doForEverySelectExcept(ctrl.selects[selectId].group, selectId, lockOption, newO);
    }

    // helper function
    // returns array filled with numbers from 0 up to (including) [max]
    $rootScope.countTo = function(max) {
        var res = [];
        for (var i = 0; i <= max; i++) res.push(i);
        return res;
    }

    // frees given option opt and adds it to availableOptions
    // then informs the select's controller via updateOptions()
    function freeOption(select, opt) {
        select.avaOpts.push(opt);
        select.ctrl.updateOptions(select.avaOpts);
    }

    // locks given option opt and removes it from availableOptions
    // then informs the select's controller via updateOptions()
    function lockOption(select, opt) {
        var index = select.avaOpts.indexOf(opt);
        if (index > -1) select.avaOpts.splice(index, 1);
        select.ctrl.updateOptions(select.avaOpts);
    }

    // calls func for every select except the one with selectId as id
    function doForEverySelectExcept(group, selectId, func, args) {
        for (var i = 0; i < ctrl.selects.length; i++)
            if (i != selectId && ctrl.selects[i].group == group)
                func(ctrl.selects[i], args);
    }

    // prepare data from stored json file
    function prepareJSON(rawData) {
      var res = JSON.parse(JSON.stringify(rawData));
      // loop over groups
      for(var gI in res) {
        res[gI].type = gI;
        // loop over options in group and assign ids
        var c = 0;
        for(var oI in res[gI]) {
          res[gI][oI].id = c++;
        }
      }
      return res;
    }
}]);
