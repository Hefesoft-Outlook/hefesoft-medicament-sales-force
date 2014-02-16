(function () {
    'use strict';
    var controllerId = 'pais';
    angular.module('app').controller(controllerId, ['common', '$scope', 'datacontextLinea', pais]);

    function pais(common, $scope, datacontextPais) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Pais';
        vm.filaSeleccionada = null;
        vm.paisDataSource = datacontextPais.dataSource;

        vm.columns = [            
            { hidden: true, field: "id" },
            { field: "nombre", title: "Nombre" },
            { field: "nodoPais", title: "Nodo" },
            { command: ["edit", "destroy"] }
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

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function (result) {                   
                    log('Parametrizar Paises');
                });
        }
    }
})();