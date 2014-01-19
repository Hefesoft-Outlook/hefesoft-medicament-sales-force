(function () {
    'use strict';
    var controllerId = 'ciclos';
    angular.module('app').controller(controllerId, ['common', '$scope', 'datacontextCiclos', ciclos]);

    function ciclos(common, $scope, datacontextCiclos) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Ciclos';
        vm.filaSeleccionada = null;
                
        function inicializarComponentes() {
            vm.ciclosDataSource = datacontextCiclos.ciclosDataSource;
            vm.columns = [
                { hidden: true, field: "id" },
                { field: "diasCiclo", title: "Dias de Ciclo" },
                { field: "fechaInicial", title: "Fecha Inicial", format: "{0: dd-MM-yyyy}" },
                { field: "fechaFinal", title: "Fecha Final", format: "{0: dd-MM-yyyy}" },
                { field: "activo", title: "Activo", template: "#=activoTemplate(activo)#"},
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
        }

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function (result) {                   
                    log('Parametrizacion de ciclos');
                    inicializarComponentes();
                });
        }
    }
})();