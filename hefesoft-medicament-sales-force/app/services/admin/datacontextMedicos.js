(function () {
    'use strict';

    var serviceId = 'datacontextMedicos';
    angular.module('app').factory(serviceId,
        ['common', 'AzureMobileClient', 'datacontextUnidadVisita', datacontextMedicos]);

    function datacontextMedicos(common, AzureMobileClient, datacontextUnidadVisita) {
        var $q = common.$q;

        var dataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) { dataSourceRead(options); },
                create: function (options) {
                    dataSourceCreate(options)
                },
                update: function (options) {
                    dataSourceUpdate(options)
                },
                destroy: function (options) { dataSourceDestroy(options) },
            },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false, validation: { required: false } },
                        primerNombre: { type: "string", validation: { required: true } },
                        segundoNombre: { type: "string", validation: { required: true } },
                        primerApellido: { type: "string", validation: { required: true } },
                        segundoApellido: { type: "string", validation: { required: true } }, 
                        cumpleanios: { type: "date", validation: { required: false } },
                        especialidadId: { type: "numeric", validation: { required: false } },
                    }
                }
            }
        });

        var service = {
            getMedicos: getMedicos,
            medicosDataSource: dataSource
        };

        return service;

        function getMedicos() {            
            var deferred = $q.defer();
            AzureMobileClient.getAllData('TP_Medicos', 50).then(
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
            getMedicos().then(
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
            AzureMobileClient.addDataAsync("TP_Medicos", item).then(
                function(result){
                    options.success();

                    item = result;
                    var unidadVisita = new Object();
                    unidadVisita.data = new Object();
                    unidadVisita.data.idUnidadVisita = item.id;
                    unidadVisita.data.tipo = 1;
                    unidadVisita.data.datosExtra = JSON.stringify(item);
                    datacontextUnidadVisita.dataSourceCreate(unidadVisita);

                    },
                function (err) {
                     options.error();
                    }
                );            
        };

        function dataSourceUpdate(options) {
            var item = options.data;            
            AzureMobileClient.updateDataAsync("TP_Medicos", item).then(
                function (result) {
                    options.success();

                    datacontextUnidadVisita.getUnidadVisitaById(result.id).then(
                        function (unidadVisita) {
                            unidadVisita.datosExtra = JSON.stringify(result);
                            var options = new Object();
                            options.data = new Object();
                            options.data = unidadVisita;
                            datacontextUnidadVisita.dataSourceUpdate(unidadVisita);
                        },
                        function (error) {

                        }
                        );
                },
                function (err) {
                    options.error();
                }
                );
        };

        function dataSourceDestroy(options) {
            var item = new Object();
            item.id = options.data.id;

            AzureMobileClient.deleteDataAsync("TP_Medicos", item).then(
                function (result) {
                    options.success();

                    datacontextUnidadVisita.getUnidadVisitaById(result.id).then(
                        function (unidadVisita) {
                            unidadVisita.datosExtra = JSON.stringify(result);
                            var options = new Object();
                            options.data = new Object();
                            options.data = unidadVisita;
                            datacontextUnidadVisita.dataSourceDestroy(unidadVisita);
                        },
                        function (error) {

                        }
                        );
                },
                function (err) {
                    options.error();
                }
                );
        };
    }
})();