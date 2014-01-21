(function () {
    'use strict';

    var serviceId = 'datacontextUnidadVisita';
    angular.module('app').factory(serviceId,
        ['common', 'AzureMobileClient', datacontextUnidadVisita]);

    function datacontextUnidadVisita(common, AzureMobileClient) {
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
                        nombreMostrar: { type: "string", validation: { required: true } },
                        idUnidadVisitaTabla: { type: "string", validation: { required: true } },
                        tipo: { type: "string", validation: { required: true } },
                        datosAdicionales: { type: "string", validation: { required: true } },
                    }
                }
            }
        });

        var service = {
            getUnidadVisita: getUnidadVisita,
            unidadVisitaDataSource: dataSource,
            dataSourceDestroy: dataSourceDestroy,
            dataSourceUpdate: dataSourceUpdate,
            dataSourceCreate: dataSourceCreate,
            getUnidadVisitaById: getUnidadVisitaById
        };

        return service;

        function getUnidadVisita() {
            var deferred = $q.defer();
            AzureMobileClient.getAllData('TM_Unidad_Visita', 50).then(
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
            getUnidadVisita().then(
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

            AzureMobileClient.addDataAsync("TM_Unidad_Visita", item).then(
                function(result){
                        
                    },
                function (err) {
                     
                    }
                );            
        };

        function dataSourceUpdate(options) {
            var item = options.data;            
            AzureMobileClient.updateDataAsync("TM_Unidad_Visita", item).then(
                function (result) {
                    
                },
                function (err) {
                    
                }
                );
        };

        function dataSourceDestroy(options) {
            var item = new Object();
            item.id = options.data.id;

            AzureMobileClient.deleteDataAsync("TM_Unidad_Visita", item).then(
                function (result) {
                    
                },
                function (err) {
                    
                }
                );
        };

        function getUnidadVisitaById(id) {
            var deferred = $q.defer();
            AzureMobileClient.getDataFilter('TM_Unidad_Visita', { idUnidadVisita: id, tipo: 1 }, 1).then(
                function (result) {
                    if (result.lenght > 0) {
                    }
                    deferred.resolve(result);
                },
                function (error) {
                    deferred.reject(err);
                }
            );

            return deferred.promise;
        }
    }
})();