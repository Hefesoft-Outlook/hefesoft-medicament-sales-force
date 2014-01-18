(function () {
    'use strict';

    var serviceId = 'datacontextMedicos';
    angular.module('app').factory(serviceId,
        ['common', 'AzureMobileClient', datacontextMedicos]);

    function datacontextMedicos(common, AzureMobileClient) {
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
                        primerNombre: { type: "string", validation: { required: true } },
                        segundoNombre: { type: "string", validation: { required: true } },
                        primerApellido: { type: "string", validation: { required: true } },
                        segundoApellido: { type: "string", validation: { required: true } },                        
                        cumpleanios: { type: "date" },
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
            AzureMobileClient.getAllData('Medicos',50).then(
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
            AzureMobileClient.addDataAsync("Medicos", item).then(
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
            AzureMobileClient.updateDataAsync("Medicos", item).then(
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

            AzureMobileClient.deleteDataAsync("Medicos", item).then(
                function (result) {
                    options.success();
                },
                function (err) {
                    options.error();
                }
                );
        };
    }
})();