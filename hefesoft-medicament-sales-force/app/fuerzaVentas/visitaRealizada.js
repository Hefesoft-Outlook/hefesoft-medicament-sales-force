(function () {
    'use strict';
    var controllerId = 'visitaRealizada';
    angular.module('app').controller(controllerId, ['common', '$scope', 'datacontextVisitaPlaneada', 'datacontextVisitaRealizada', '$http', visitaRealizada]);

    function visitaRealizada(common, $scope, datacontextVisitaPlaneada, datacontextVisitaRealizada) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var win = null;
        
        var vm = this;        
        vm.title = 'Registro';       

        vm.visitaPlaneadaDataSource = datacontextVisitaPlaneada.visitaPlaneadaDataSource;
        vm.visitaRealizadaDataSource = datacontextVisitaRealizada.visitaRealizadaDataSource;

        vm.buscar = function (e) {            
            win.center();
            win.open();
        }
      
        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function (result) {
                    inicializarElementos();

                    win = $("#popUpPanel").kendoWindow({
                        height: "400px",
                        title: "Panel Visitador",
                        visible: false,
                        width: "800px"
                    }).data("kendoWindow");

                    document.addEventListener("contactoAgregado", contactoAgregado, false);

                    log('Registro visitas');
                });
        }


        function contactoAgregado(e) {
            vm.filaSeleccionada = e.elemento[0];           

            datacontextVisitaRealizada.visitaRealizadaDataSource.insert(
            {
                nombre: vm.filaSeleccionada.nombre,
                fecha: new Date(),
                datosExtra: vm.filaSeleccionada.datosExtra,
                idPanelVisitador: vm.filaSeleccionada.id,
                idCiclo: common.ciclo,
                idUsuario: common.Usuario_Logueado.idAntiguo
            });

            var grid = $("#gridRegistroVisita").data("kendoGrid");
            grid.saveChanges();

        }


        function visitasPlaneadasCargadas() {
            document.removeEventListener("VisitasPlaneadasCargadas", visitasPlaneadasCargadas, false);
            datacontextVisitaPlaneada.getVisitaPlaneadasDia().then(
                            function (result) {
                                if (datacontextVisitaRealizada.visitaRealizadaDataSource._data.length === 0) {
                                    insertarRegistroDataSource(result);
                                }
                            }
                        );
        };

        function insertarRegistroDataSource(result) {
            var resultado = new Array();
            for (var i in result) {

                if (result[i].nombre !== undefined) {

                    var elementoEncontrado = datacontextVisitaRealizada.visitaRealizadaDataSource.existeElemento({ keyField: 'idPanelVisitador', keyValue: result[i].idPanelVisitador });

                    if (!elementoEncontrado) {
                        datacontextVisitaRealizada.visitaRealizadaDataSource.insert(
                        {
                            nombre: result[i].nombre,
                            fecha: result[i].fecha,
                            datosExtra: result[i].datosExtra,
                            idPanelVisitador: result[i].idPanelVisitador,
                            idCiclo: common.ciclo,
                            idUsuario: common.Usuario_Logueado.idAntiguo
                        });
                    }
                }
            }

            var grid = $("#gridRegistroVisita").data("kendoGrid");
            grid.saveChanges();
        }

        function inicializarElementos() {
            $("#gridRegistroVisita").kendoGrid({
                dataSource: datacontextVisitaRealizada.visitaRealizadaDataSource,
                editable: {
                    mode: "popup",
                    //createAt: "top"
                },
                columns: [
                    { field: "nombre", title: "Nombre" },
                    { field: "fecha", title: "Hora", format: "{0:HH:mm}", editor: common.timeEditor },
                    { command: ["edit", "destroy"] }
                ],
                selectable: "row",
                height: 600
            });

            document.addEventListener("VisitasPlaneadasCargadas", visitasPlaneadasCargadas, false);
        }

    }
})();