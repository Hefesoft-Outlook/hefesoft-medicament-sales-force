(function () {
    'use strict';

    var serviceId = 'datacontextAdmin';
    angular.module('app').factory(serviceId,
        ['common', 'AzureMobileClient', datacontextAdmin]);

    function datacontextAdmin(common, AzureMobileClient) {
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
                        fechaInicial: { type: "date", validation: { required: true } },
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
            AzureMobileClient.getAllData('Ciclos',50).then(
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
                            var item = [{ id: 1, fechaInicial: new Date(), fechaFinal: new Date(), activo: true }];
                            result = item;
                            options.success(result);
                        },
                        function (error) {
                            options.error(error);
                        }
                        );
        };

        function dataSourceCreate(options) {
            var item = options.data;
            options.success();
        };

        function dataSourceUpdate(options) {
            var item = options.data;
            options.success();
        };

        function dataSourceDestroy(options) {
            var item = options.data;
            options.success();
        };
    }
})();