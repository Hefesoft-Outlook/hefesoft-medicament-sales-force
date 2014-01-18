(function () {
    'use strict';

    var serviceId = 'datacontextFarmacias';
    angular.module('app').factory(serviceId,
        ['common', 'AzureMobileClient', datacontextFarmacias]);

    function datacontextFarmacias(common, AzureMobileClient) {
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
            AzureMobileClient.getAllData('farmacias',50).then(
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
            AzureMobileClient.addDataAsync("farmacias", item).then(
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
            AzureMobileClient.updateDataAsync("farmacias", item).then(
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

            AzureMobileClient.deleteDataAsync("farmacias", item).then(
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