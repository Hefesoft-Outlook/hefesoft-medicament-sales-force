(function () {
    'use strict';
    var controllerId = 'usuarios';
    angular.module('app').controller(controllerId, ['common', '$scope', 'datacontextUsuarios', 'AzureMobileClient', 'datacontextRoles', usuarios]);

    function usuarios(common, $scope, datacontextUsuarios, AzureMobileClient, datacontextRoles) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'usuarios';
        vm.filaSeleccionada = null;
        vm.rolseleccionado = null;
        vm.usuariosDataSource = datacontextUsuarios.usuariosDataSource;
        vm.things = datacontextRoles.rolesDataSource;

        vm.columns = [            
            { hidden: true, field: "id" },            
            { field: "email", title: "Email" },
            { field: "clave", title: "Clave" },            
            { command: ["edit", "destroy"] },
            { template: '<button class=\'btn btn-small\' data-ng-click=\'vm.mostrarVentanaRoles()\'><i class="icon-edit"></i> Roles</button>' },

        ];

        vm.gridOpts = {
            columns: vm.columns,
            filterable: { extra: false },
            pageable: false,           
            reorderable: true,
            sortable: true,
            editable: {
                mode: "popup",
                //createAt: "top"
            },
            mobile: true,
            height: "24em",
            resizable: true,
            toolbar: [
                { name: "create" }
            ]
        };

        vm.mostrarVentanaRoles = function () {
            var item = vm.filaSeleccionada;            
            vm.filaSeleccionada.roles = JSON.parse(vm.filaSeleccionada.roles);
            $scope.modal.center().open();
        };

        vm.eliminarRol = function (rol) {
            var item = vm.filaSeleccionada;
            var index = vm.filaSeleccionada.roles.indexOf(rol);

            if (index > -1) {
                vm.filaSeleccionada.roles.splice(index, 1);
            }

            vm.filaSeleccionada.roles = JSON.stringify(vm.filaSeleccionada.roles);
            AzureMobileClient.updateDataAsync("usuarios", vm.filaSeleccionada);            
            $scope.$apply();
        };

        vm.rolChange = function (e) {
            console.log(e.sender.text());
            vm.rolseleccionado = e.sender.text();            
        };

        vm.adicionarRol = function () {
            var item = vm.rolseleccionado;
            vm.filaSeleccionada.roles.push(item);

            vm.filaSeleccionada.roles = JSON.stringify(vm.filaSeleccionada.roles);
            AzureMobileClient.updateDataAsync("usuarios", vm.filaSeleccionada);
            $scope.$apply();
        };

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function (result) {                   
                    log('Parametrizar usuarios');
                });
        }
    }
})();