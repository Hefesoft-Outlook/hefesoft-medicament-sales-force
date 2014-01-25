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
        
        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function (result) {                   
                    log('Planear visitas');

                    $("#grid").kendoGrid({
                        dataSource: vm.planecionDataSource,
                        scrollable: {
                            virtual: true
                        },
                        selectable: "row",
                        rowTemplate: kendo.template($("#rowTemplate").html()),
                        altRowTemplate: kendo.template($("#altRowTemplate").html()),
                        height: 600
                    });

                });
        }        
    }
})();