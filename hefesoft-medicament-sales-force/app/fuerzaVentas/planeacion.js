(function () {
    'use strict';
    var controllerId = 'planeacion';
    angular.module('app').controller(controllerId, ['common', '$scope', 'datacontextPanel', planeacion]);

    function planeacion(common, $scope, datacontextPanel) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Planeacion';
        vm.filaSeleccionada = null;
        vm.planecionDataSource = datacontextPanel.panelDataSource;

        
        vm.columns = [            
            { hidden: true, field: "id" },
            { editable: false, field: "primerNombre", title: "Primer Nombre" },
            { editable: false, field: "contactosCiclo", title: "Contactos Ciclo" },
            { editable: false, field: "contactosPendientes", title: "Contactos Pendientes" },
            { command: ["edit", "destroy"] }
        ];

        vm.gridOpts = {
            columns: vm.columns,            
            scrollable: {
                virtual: true
            },
            sortable: true,
            selectable : "row",            
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
                    log('Planear visitas');
                });
        }        
    }
})();