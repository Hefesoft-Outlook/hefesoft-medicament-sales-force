(function () {
    'use strict';
    var controllerId = 'visitaRealizada';
    angular.module('app').controller(controllerId, ['common', '$scope', 'datacontextVisitaPlaneada', 'datacontextVisitaRealizada', '$http', visitaRealizada]);

    function visitaRealizada(common, $scope, datacontextVisitaPlaneada, datacontextVisitaRealizada) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        
        var vm = this;        
        vm.title = 'Registro';       

        vm.visitaPlaneadaDataSource = datacontextVisitaPlaneada.visitaPlaneadaDataSource;
        vm.visitaRealizadaDataSource = datacontextVisitaRealizada.visitaRealizadaDataSource;
        
        
        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function (result) {                   
                    log('Registro visitas');

                    $("#gridRegistroVisita").kendoGrid({
                        dataSource: datacontextVisitaRealizada.visitaRealizadaDataSource,
                        editable: {
                            mode: "popup",
                            //createAt: "top"
                        },
                        columns: [
                            { field: "nombre", title: "Nombre" },
                            { field: "fecha", title: "Hora", format: "{0:HH:mm}", editor: common.timeEditor },
                        ],
                        selectable: "row",                                              
                        height: 600
                    });

                    document.addEventListener("VisitasPlaneadasCargadas", visitasPlaneadasCargadas, false);
                });
        }

        function visitasPlaneadasCargadas() {

            document.removeEventListener("VisitasPlaneadasCargadas", visitasPlaneadasCargadas, false);
            datacontextVisitaPlaneada.getVisitaPlaneadasDia().then(
                            function (result) {

                                var resultado = new Array();
                                for (var i in result) {

                                    if (result[i].nombre !== undefined) {

                                        

                                        datacontextVisitaRealizada.visitaRealizadaDataSource.insert(
                                        {
                                            nombre: result[i].nombre,
                                            fecha: result[i].fecha,
                                            datosExtra: result[i].datosExtra,
                                        }
                                        );
                                    }
                                }
                            }
                        );
        };

        vm.salvar = function () {
            var grid = $("#gridRegistroVisita").data("kendoGrid");
            grid.saveChanges();
        };

    }
})();