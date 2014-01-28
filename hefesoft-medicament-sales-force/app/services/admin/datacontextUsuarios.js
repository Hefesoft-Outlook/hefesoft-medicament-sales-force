(function () {
    'use strict';

    var serviceId = 'datacontextUsuarios';
    angular.module('app').factory(serviceId,
        ['common', 'AzureMobileClient', datacontextUsuarios]);

    function datacontextUsuarios(common, AzureMobileClient) {
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
                        email: { type: "string", validation: { required: true } },
                        clave: { type: "string", validation: { required: true } },
                        roles: { type: "string", validation: { required: true } },
                    }
                }
            }
        });

        var service = {
            getUsuarios: getUsuarios,
            usuariosDataSource: dataSource
        };

        return service;

        function getUsuarios() {
            var deferred = $q.defer();
            AzureMobileClient.getAllData('usuarios',50).then(
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
            getUsuarios().then(
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
            AzureMobileClient.addDataAsync("usuarios", item).then(
                function(result){
                    options.success(result);
                    },
                function (err) {
                     options.error();
                    }
                );            
        };

        function dataSourceUpdate(options) {
            var item = options.data;            
            AzureMobileClient.updateDataAsync("usuarios", item).then(
                function (result) {
                    options.success(result);
                },
                function (err) {
                    options.error();
                }
                );
        };

        function dataSourceDestroy(options) {
            var item = new Object();
            item.id = options.data.id;

            AzureMobileClient.deleteDataAsync("usuarios", item).then(
                function (result) {
                    options.success(item.id);
                },
                function (err) {
                    options.error();
                }
                );
        };
    }
})();