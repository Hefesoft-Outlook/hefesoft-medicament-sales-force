(function () {
    'use strict';
    var controllerId = 'planeacion';
    angular.module('app').controller(controllerId, ['common', '$scope', 'datacontextPanel', 'datacontextVisitaPlaneada', '$http', planeacion]);

    function planeacion(common, $scope, datacontextPanel, datacontextVisitaPlaneada, $http) {
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
        vm.visitaPlaneadaDataSource = datacontextVisitaPlaneada.visitaPlaneadaDataSource;
        datacontextVisitaPlaneada.fechaCalculo = vm.fechaSeleccionada;
        
        activate();

        function activate() {
            common.activateController([cargarTemplate()], controllerId)
                .then(function (result) {                   
                    log('Planear visitas');

                    // Inicializa los elementos para el panel visistado lo muevo a una funcion por orden
                    gridPanelVisitador();
                    gridVisitaPlaneadaVisitador();
                    dataPickerFecha();

                    document.addEventListener("eliminarVisitaPlaneada", visitaPlaneadaEliminada, false);

                });
        }

        function visitaPlaneadaEliminada(e) {
            var item = e.elemento;

            var dataItem = vm.planecionDataSource.get(item.idPanelVisitador);
            vm.planecionDataSource.updateField({ keyField: 'id', keyValue: dataItem.id, updateField: 'contactosPendientes', updateValue: dataItem.contactosPendientes - 1 });

            var grid = $("#gridPanelVisitador").data("kendoGrid");            
            grid.refresh();

           
            datacontextPanel.actualizar(dataItem);
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

                for (var i in vm.filaSeleccionada) {

                    //Se valida que no se pueda planear el dia actual
                    if (common.validarSiEsFechaHoy(vm.fechaSeleccionada)){
                        log("No es posible planear una visita en el dia en curso");                    
                    }
                    else {

                        // Validar que el elemento no se encuentre en el listado
                        var existe = vm.visitaPlaneadaDataSource.existeElemento({ keyField: 'idPanelVisitador', keyValue: vm.filaSeleccionada[i].id});

                        if (!existe) {

                            if (vm.filaSeleccionada[i].contactosPendientes <= vm.filaSeleccionada[i].contactosCiclo) {
                                // Actualiza el registro
                                vm.planecionDataSource.updateField({ keyField: 'id', keyValue: vm.filaSeleccionada[i].id, updateField: 'contactosPendientes', updateValue: vm.filaSeleccionada[i].contactosPendientes + 1 });

                                // Inserta el registro en visita planeada
                                vm.visitaPlaneadaDataSource.insert({ nombre: vm.filaSeleccionada[i].nombre, idUsuario: common.Usuario_Logueado.idAntiguo, idCiclo: common.ciclo, idPanelVisitador: vm.filaSeleccionada[i].id, fecha: vm.fechaSeleccionada, datosExtra: vm.filaSeleccionada[i].datosExtra });
                            }
                            else {
                                log("Numero de contactos superados");
                            }
                        }
                        else {
                            log("El elemento ya se encuentra para esta fecha");
                        }
                    }
                };
                

                var grid = $("#gridPanelVisitador").data("kendoGrid");
                var gridVisitaPlaneada = $("#gridVisitaPlaneada").data("kendoGrid");
                gridVisitaPlaneada.saveChanges();               
                grid.refresh();

                vm.planecionDataSource.sync();
                var dataItem = vm.planecionDataSource.get(vm.filaSeleccionada[i].id);
                datacontextPanel.actualizar(dataItem);

            });

        }

        function gridVisitaPlaneadaVisitador() {

            $("#gridVisitaPlaneada").kendoGrid({
                dataSource: vm.visitaPlaneadaDataSource,
                scrollable: {
                    virtual: true
                },
                editable: {
                    mode: "popup",
                    //createAt: "top"
                },
                columns:[                    
                    { field: "nombre", title: "Nombre"},
                    { field: "fecha", title: "Hora", format: "{0:HH:mm}", editor: timeEditor },
                    { command: ["edit", "destroy"] }
                ],
                selectable: "row",
                change: agregarContacto,
                dataBound: function (e) {
                    if (common.validarSiEsFechaHoy(vm.fechaSeleccionada)) {
                        $(".k-grid-delete").hide();
                        $(".k-grid-edit").hide();
                    }
                },
                height: 600
            });          

        }

        function dataPickerFecha() {
            //Data Picker
            $("#datepickerFechaPlaneacion").kendoDatePicker({
                min: today,
                value: tomorrow,
                culture: "es-CO",
                change: function () {
                    vm.fechaSeleccionada = this.value();
                    common.fechaCalculoPlanear = vm.fechaSeleccionada;
                    vm.visitaPlaneadaDataSource.read();
                }
            });
        }

        function timeEditor(container, options) {
            $('<input data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '" data-format="' + options.format + '"/>')
                    .appendTo(container)
                    .kendoTimePicker({});
        }
    }
})();