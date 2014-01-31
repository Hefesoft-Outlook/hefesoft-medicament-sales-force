(function () {
    'use strict';
    var controllerId = 'ctrPlaneacion';
    angular.module('app').controller(controllerId, ['common', '$scope', 'datacontextPanel', '$http', 'spinner', ctrPlaneacion]);

    function ctrPlaneacion(common, $scope, datacontextPanel, $http, spinner) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var evtContactoAgregado = document.createEvent("Event");
        evtContactoAgregado.initEvent("contactoAgregado", true, true);
        evtContactoAgregado.elemento = null;

        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);       

        var vm = this;
        vm.fechaSeleccionada = tomorrow;
        vm.title = 'Planeacion';
        vm.filaSeleccionada = null;
        vm.planecionDataSource = datacontextPanel.panelDataSource;
      
        activate();

        function activate() {
            common.activateController([cargarTemplate()], controllerId)
                .then(function (result) {                   
                    log('Planear visitas');

                    // Inicializa los elementos para el panel visistado lo muevo a una funcion por orden
                    gridPanelVisitador();
                    document.addEventListener("eliminarVisitaPlaneada", visitaPlaneadaEliminada, false);
                    document.addEventListener("eliminarVisitaRealizada", visitaPlaneadaEliminada, false);
                });
        }

        function visitaPlaneadaEliminada(e) {
            var item = e.elemento;

            var dataItem = vm.planecionDataSource.get(item.idPanelVisitador);
            if (item !== undefined && item.accionEjecutada === false) {

                e.elemento.accionEjecutada = true;

                vm.planecionDataSource.updateField({ keyField: 'id', keyValue: dataItem.id, updateField: 'contactosPendientes', updateValue: dataItem.contactosPendientes - 1 });

                var grid = $("#gridPanelVisitador").data("kendoGrid");
                grid.refresh();

                datacontextPanel.actualizar(dataItem);                
            }
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
        }

        function gridPanelVisitador() {

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

            $("#gridPanelVisitador").on("click", ".k-grid-agregar", function () {
                evtContactoAgregado.elemento = vm.filaSeleccionada;
                evtContactoAgregado.elemento["accionEjecutada"] = false;

                for (var i in vm.filaSeleccionada) {

                    //Se valida que no se pueda planear el dia actual
                    if (common.validarSiEsFechaHoy(vm.fechaSeleccionada)) {
                        log("No es posible planear una visita en el dia en curso");
                    }
                    else {
                            if (vm.filaSeleccionada[i].contactosPendientes < vm.filaSeleccionada[i].contactosCiclo) {
                                // Actualiza el registro
                                vm.planecionDataSource.updateField({ keyField: 'id', keyValue: vm.filaSeleccionada[i].id, updateField: 'contactosPendientes', updateValue: vm.filaSeleccionada[i].contactosPendientes + 1 });

                                common.emitirEvento('agregarContacto', evtContactoAgregado);

                                // Aca va un evento
                                document.dispatchEvent(evtContactoAgregado);
                                spinner.spinnerShow();
                            }
                            else {
                                log("Numero de contactos superados");
                            }
                        }
                };


                var grid = $("#gridPanelVisitador").data("kendoGrid");
                grid.refresh();



                vm.planecionDataSource.sync();
                var dataItem = vm.planecionDataSource.get(vm.filaSeleccionada[0].id);
                datacontextPanel.actualizar(dataItem);

            });

        }
     
    }
})();