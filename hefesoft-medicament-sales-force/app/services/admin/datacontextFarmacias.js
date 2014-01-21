(function () {
    'use strict';

    var serviceId = 'datacontextFarmacias';
    angular.module('app').factory(serviceId,
        ['common', 'AzureMobileClient', 'datacontextUnidadVisita', datacontextFarmacias]);

    function datacontextFarmacias(common, AzureMobileClient, datacontextUnidadVisita) {
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
                        nombre: { type: "string", validation: { required: true } },
                        telefono: { type: "string", validation: { required: true } },
                        direccion: { type: "string", validation: { required: true } },                        
                    }
                }
            }
        });

        var service = {
            getfarmacias: getfarmacias,
            farmaciasDataSource: dataSource
        };

        return service;

        function getfarmacias() {            
            var deferred = $q.defer();
            AzureMobileClient.getAllData('TP_Farmacias',50).then(
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
            getfarmacias().then(
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
            AzureMobileClient.addDataAsync("TP_Farmacias", item).then(
                function(result){
                    options.success();

                    item = result;
                    var unidadVisita = new Object();
                    unidadVisita.data = new Object();
                    unidadVisita.data.idUnidadVisita = item.id;
                    unidadVisita.data.tipo = 2;
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
            AzureMobileClient.updateDataAsync("TP_Farmacias", item).then(
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

            AzureMobileClient.deleteDataAsync("TP_Farmacias", item).then(
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