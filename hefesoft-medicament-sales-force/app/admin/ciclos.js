(function () {
    'use strict';
    var controllerId = 'ciclos';
    angular.module('app').controller(controllerId, ['common', '$scope', 'datacontextAdmin', ciclos]);

    function ciclos(common, $scope, datacontextAdmin) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Ciclos';
        vm.filaSeleccionada = null;
        vm.ciclosDataSource = datacontextAdmin.ciclosDataSource;

        

        vm.columns = [            
            { hidden: true, field: "id" },
            { field: "fechaInicial", title: "Fecha Inicial", format: "{0: dd-MM-yyyy}" },
            { field: "fechaFinal", title: "Fecha Final", format: "{0: dd-MM-yyyy}" },
            { field: "activo", title: "Activo" },
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
            mobile: "phone",
            height: "24em",
            resizable: true,
            toolbar: [
                { name: "create" },
                { name: "save" },
                { name: "cancel" }
            ]        
        };

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function (result) {                   
                    log('Parametrizacion de ciclos');
                });
        }
    }
})();