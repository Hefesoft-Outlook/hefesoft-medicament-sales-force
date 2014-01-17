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

                    var usuario = new Object();
                    usuario.email = "futbolito152@gmail.com";
                    usuario.clave = "iguazo26";
                    usuario.roles = "identificado,administrador";

                    AzureMobileClient.addData('Usuarios', usuario);
                    log('Login activado');

                });
        }
    }
})();