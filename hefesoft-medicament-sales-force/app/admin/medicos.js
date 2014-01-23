(function () {
    'use strict';
    var controllerId = 'medicos';
    angular.module('app').controller(controllerId, ['common', '$scope', 'datacontextMedicos', 'datacontextEspecialidades', medicos]);

    function medicos(common, $scope, datacontextMedicos, datacontextEspecialidades) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Medicos';
        vm.filaSeleccionada = null;
        vm.medicosDataSource = datacontextMedicos.medicosDataSource;

        vm.rowSelected = function (e) {
            //var grid = e.sender;
            //var contador = -1;            
            //var numeroColumna = _.find(grid.columns, function (columna) { contador++; return columna.field == "especialidad"; });
            //grid.columns[contador].editor = categoryDropDownEditor;
        };

        vm.columns = [            
            { hidden: true, field: "id" },
            { field: "primerNombre", title: "Primer Nombre" },
            { field: "segundoNombre", title: "Segundo Nombre" },
            { field: "primerApellido", title: "Primer Apellido" },
            { field: "segundoApellido", title: "Segundo Apellido" },
            { field: "cumpleanios", title: "Cumpleaños", format: "{0: dd-MM-yyyy}" },
            //{ field: "especialidad", title: "Especialidad"},
            { command: ["edit", "destroy"] }
        ];

        vm.gridOpts = {
            columns: vm.columns,
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            filterable: { extra: false },
            pageable: true,
            selectable : "row",
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
                    log('Parametrizar Medicos');
                });
        }

        function categoryDropDownEditor(container, options) {
            $('<input required data-text-field="nombre" data-value-field="especialidadId" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: false,
                    dataSource: datacontextEspecialidades.especialidadesDataSource
                });
        };
    }
})();