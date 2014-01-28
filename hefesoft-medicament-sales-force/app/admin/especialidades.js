(function () {
    'use strict';
    var controllerId = 'especialidades';
    angular.module('app').controller(controllerId, ['common', '$scope', 'datacontextEspecialidades', especialidades]);

    function especialidades(common, $scope, datacontextEspecialidades) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Especialidades';
        vm.filaSeleccionada = null;
        vm.especialidadesDataSource = datacontextEspecialidades.especialidadesDataSource;

        vm.columns = [            
            { hidden: true, field: "id" },
            { field: "nombre", title: "Nombre" },            
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
                    log('Parametrizar especialidades');
                });
        }
    }
})();