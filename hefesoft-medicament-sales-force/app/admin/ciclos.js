(function () {
    'use strict';
    var controllerId = 'ciclos';
    angular.module('app').controller(controllerId, ['common', ciclos]);

    function ciclos(common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Ciclos';

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () { log('Parametrizacion de ciclos'); });
        }
    }
})();