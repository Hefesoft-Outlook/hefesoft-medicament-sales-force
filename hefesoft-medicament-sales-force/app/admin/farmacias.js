(function () {
    'use strict';
    var controllerId = 'farmacias';
    angular.module('app').controller(controllerId, ['common', '$scope', 'datacontextFarmacias', farmacias]);

    function farmacias(common, $scope, datacontextFarmacias) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'farmacias';
        vm.filaSeleccionada = null;
        vm.farmaciasDataSource = datacontextFarmacias.farmaciasDataSource;

        vm.columns = [            
            { hidden: true, field: "id" },
            { field: "nombre", title: "Nombre" },
            { field: "telefono", title: "Telefono" },
            { field: "direccion", title: "Direccion" },
            { command: ["edit", "destroy"] }
        ];

        vm.gridOpts = {
            columns: vm.columns,
            filterable: { extra: false },
            pageable: false,
            batch: true,
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

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function (result) {                   
                    log('Parametrizar farmacias');
                });
        }
    }
})();