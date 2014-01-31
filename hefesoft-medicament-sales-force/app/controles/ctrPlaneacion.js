(function () {
    'use strict';
    var controllerId = 'ctrPlaneacion';
    angular.module('app').controller(controllerId, ['common', '$scope', 'datacontextPanel', '$http', ctrPlaneacion]);

    function ctrPlaneacion(common, $scope, datacontextPanel, $http) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

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
                });
        }

        var eventoEliminarVisita = $scope.$on('eliminarVisitaPlaneada', function (event, e) {
            var item = e;

            if (item.idPanelVisitador !== undefined) {
                var dataItem = vm.planecionDataSource.get(item.idPanelVisitador);
                if (item !== undefined) {

                    vm.planecionDataSource.updateField({ keyField: 'id', keyValue: dataItem.id, updateField: 'contactosPendientes', updateValue: dataItem.contactosPendientes - 1 });

                    var grid = $("#gridPanelVisitador").data("kendoGrid");
                    grid.refresh();

                    datacontextPanel.actualizar(dataItem);
                }
            }
        });

        $scope.$on('exit', function (event, e) {
            eventoEliminarVisita();
        });

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

                for (var i in vm.filaSeleccionada) {

                    //Se valida que no se pueda planear el dia actual
                    if (common.validarSiEsFechaHoy(vm.fechaSeleccionada)) {
                        log("No es posible planear una visita en el dia en curso");
                    }
                    else {
                            if (vm.filaSeleccionada[i].contactosPendientes < vm.filaSeleccionada[i].contactosCiclo) {
                                
                                common.emitirEvento('mostrarBusy', "Agregando contacto");
                                vm.planecionDataSource.updateField({ keyField: 'id', keyValue: vm.filaSeleccionada[i].id, updateField: 'contactosPendientes', updateValue: vm.filaSeleccionada[i].contactosPendientes + 1 });

                                var elemento = new Object();

                                elemento['elemento'] = vm.filaSeleccionada;
                                elemento["accionEjecutada"] = false;

                                common.emitirEvento('agregarContacto', elemento);                             
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