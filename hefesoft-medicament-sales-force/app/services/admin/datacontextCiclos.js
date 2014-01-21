(function () {
    'use strict';

    var serviceId = 'datacontextCiclos';
    angular.module('app').factory(serviceId,
        ['common', 'AzureMobileClient', datacontextCiclos]);

    function datacontextCiclos(common, AzureMobileClient) {
        var $q = common.$q;

        var dataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) { dataSourceRead(options); },
                create: function (options) { dataSourceCreate(options) },
                update: function (options) { dataSourceUpdate(options) },
                destroy: function (options) { dataSourceDestroy(options) },
            },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false, validation: { required: false } },
                        fechaInicial: {
                            type: "date",
                            validation: {
                                required: true,
                               // fechaInicialMayor: function (input) { fechaInicialMayor(input) }
                            }
                        },
                        diasCiclo: { type: "number", validation: { required: true } },
                        fechaFinal: { type: "date", validation: { required: true } },
                        activo: { type: "boolean" },
                    }
                }
            }
        });

        var service = {
            getCiclos: getCiclos,
            ciclosDataSource: dataSource
        };

        return service;

        function getCiclos() {            
            var deferred = $q.defer();
            AzureMobileClient.getAllData('TP_Ciclos', 50).then(
                    function (resultado) {
                        deferred.resolve(resultado);
                    },
                    function (error) {
                        deferred.reject(error);
                    }
                );

            return deferred.promise;
        }


        function dataSourceRead(options) {
            getCiclos().then(
                        function (result) {                            
                            options.success(result);
                        },
                        function (error) {
                            options.error(error);
                        }
                        );
        };

        function dataSourceCreate(options) {
            var item = options.data;

            item.diaFechaInicial = item.fechaInicial.getFullYear();
            item.mesFechaInicial = item.fechaInicial.getMonth()+1;
            item.anioFechaInicial = item.fechaInicial.getDate();

            item.diaFechaFinal = item.fechaFinal.getFullYear();
            item.mesFechaFinal = item.fechaFinal.getMonth()+1;
            item.anioFechaFinal = item.fechaFinal.getDate();

            AzureMobileClient.addDataAsync("TP_Ciclos", item).then(
                function(result){
                        options.success();
                    },
                function (err) {
                     options.error();
                    }
                );            
        };

        function dataSourceUpdate(options) {
            var item = options.data;            
            AzureMobileClient.updateDataAsync("TP_Ciclos", item).then(
                function (result) {
                    options.success();
                },
                function (err) {
                    options.error();
                }
                );
        };

        function dataSourceDestroy(options) {
            var item = new Object();
            item.id = options.data.id;

            AzureMobileClient.deleteDataAsync("TP_Ciclos", item).then(
                function (result) {
                    options.success();
                },
                function (err) {
                    options.error();
                }
                );
        };

        function fechaInicialMayor(input) {
            input.attr("data-custom-msg", "Birthday cannot be in the future");
            var startDate = input.closest(".k-edit-form-container").find("input[name=fechaInicial]").val();
            var endDate = input.closest(".k-edit-form-container").find("input[name=fechaFinal]").val();

            if (startDate > endDate) {
                return false;
            }
            else {
                return true;
            }
        };
    }
})();