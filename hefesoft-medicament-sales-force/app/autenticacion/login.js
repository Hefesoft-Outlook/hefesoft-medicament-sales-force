(function () {
    'use strict';
    var controllerId = 'login';
    angular.module('app').controller(controllerId, ['common', 'AzureMobileClient', login]);

    function login(common, AzureMobileClient) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Login';

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () {

                });
        }
    }
})();