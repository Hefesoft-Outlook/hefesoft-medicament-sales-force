(function () {
    'use strict';
    var controllerId = 'planeacion';
    angular.module('app').controller(controllerId, ['common', '$scope', 'datacontextPanel', 'datacontextVisitaPlaneada', '$http', planeacion]);

    function planeacion(common, $scope, datacontextPanel, datacontextVisitaPlaneada, $http) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Planeacion';
        vm.filaSeleccionada = null;
        vm.planecionDataSource = datacontextPanel.panelDataSource;
        vm.visitaPlaneadaDataSource = datacontextVisitaPlaneada.visitaPlaneadaDataSource;

        
        activate();

        function activate() {
            common.activateController([cargarTemplate()], controllerId)
                .then(function (result) {                   
                    log('Planear visitas');

                    $("#gridPanelVisitador").kendoGrid({
                        dataSource: vm.planecionDataSource,
                        scrollable: {
                            virtual: true
                        },
                        selectable: "row",
                        change: agregarContacto,
                        rowTemplate: kendo.template($("#rowTemplate").html()),
                        altRowTemplate: kendo.template($("#altRowTemplate").html()),
                        height: 600
                    });
                });
        }


        function cargarTemplate() {
            var $q = common.$q;
            var deferred = $q.defer();
            $http.get('/app/templates/planeacion.html').
                 success(function (data) {
                     $("#templates").html('');
                     $("#templates").html(data);
                     deferred.resolve(data);
                 });

            return deferred.promise;
        }

        function agregarContacto(e) {
            var selectedRows = this.select();
            var selectedDataItems = [];
            for (var i = 0; i < selectedRows.length; i++) {
                var dataItem = this.dataItem(selectedRows[i]);
                selectedDataItems.push(dataItem);
            }

            vm.filaSeleccionada = selectedDataItems;

            for (var i in vm.filaSeleccionada) {
                vm.planecionDataSource.updateField({ keyField: 'id', keyValue: vm.filaSeleccionada[i].id, updateField: 'contactosPendientes', updateValue: vm.filaSeleccionada[i].contactosPendientes + 1 });
            };

            var grid = $("#gridPanelVisitador").data("kendoGrid");
            grid.refresh();
        }

    }
})();