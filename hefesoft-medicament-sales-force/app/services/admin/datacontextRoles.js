(function () {
    'use strict';

    var serviceId = 'datacontextRoles';
    angular.module('app').factory(serviceId,
        ['common', 'AzureMobileClient', datacontextRoles]);

    function datacontextRoles(common, AzureMobileClient) {
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
                    }
                }
            }
        });

        var service = {
            getRoles: getRoles,
            rolesDataSource: dataSource
        };

        return service;

        function getRoles() {
            var deferred = $q.defer();
            AzureMobileClient.getAllData('roles',50).then(
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
            getRoles().then(
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
            AzureMobileClient.addDataAsync("roles", item).then(
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
            AzureMobileClient.updateDataAsync("roles", item).then(
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

            AzureMobileClient.deleteDataAsync("roles", item).then(
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