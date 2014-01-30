(function () {
    'use strict';
    var controllerId = 'ctrActividadJustificada';
    angular.module('app').controller(controllerId, ['common', '$scope', 'datacontextActividadJustificada', ctrActividadJustificada]);

    function ctrActividadJustificada(common, $scope, datacontextActividadJustificada) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var evtActividadJustificadaAgregada = document.createEvent("Event");
        evtActividadJustificadaAgregada.initEvent("actividadJustificadaAgregada", true, true);
        evtActividadJustificadaAgregada.elemento = null;

        var vm = this;
        vm.title = 'Actividad Justificada';
        vm.filaSeleccionada = null;

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function (result) {                   
                    log('Buscar actividades justificadas');

                    var grid = $("#gridBuscadorActividadesJustificadas").kendoGrid({
                        dataSource: datacontextActividadJustificada.actividadJustificadaDataSource,
                        pageable: true,                        
                        columns: [
                            { field: "nombre", title: "Nombre"},                            
                            { command: { text: "Seleccionar", click: showDetails }, title: " ", width: "140px" }]
                    }).data("kendoGrid");
                });
        }// Fin activate

        function showDetails(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            evtActividadJustificadaAgregada.elemento = dataItem;

            document.dispatchEvent(evtActividadJustificadaAgregada);
        }
    }
})();