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


                    datacontextVisitaPlaneada.getVisitaPlaneadasDia().then(
                            function (result) {
                                result;
                            }
                        );


                });
        }
    }
})();