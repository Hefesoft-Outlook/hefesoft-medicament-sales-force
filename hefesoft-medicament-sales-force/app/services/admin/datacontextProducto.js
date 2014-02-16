(function () {
    'use strict';

    var serviceId = 'datacontextProducto';
    angular.module('app').factory(serviceId,
        ['common', 'AzureMobileClient', datacontextProducto]);

    function datacontextProducto(common, AzureMobileClient) {
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
                        MercadoRelevante: { type: "string", validation: { required: true } },
                        Alias: { type: "string", validation: { required: true } },
                        IdProductoMarca: { type: "numeric", validation: { required: false } },
                        IdProductoCampo: { type: "numeric", validation: { required: false } },
                        IdProductoPrincipioActivo: { type: "numeric", validation: { required: false } },
                        IdProductoFormaFarmaceutica: { type: "numeric", validation: { required: false } },
                        IdProductoUnidadMedida: { type: "numeric", validation: { required: false } },
                        IdProductoPresentacionComercial: { type: "numeric", validation: { required: false } },
                        IdProductoInformacionAdicional: { type: "numeric", validation: { required: false } },
                        //IdLinea: { type: "numeric", validation: { required: false } },
                        IdPais: { type: "numeric", validation: { required: false } },
                    }
                }
            }
        });

        var service = {            
            dataSource: dataSource
        };

        return service;

        function get() {
            var deferred = $q.defer();
            AzureMobileClient.getAllData('tp_productos', 50).then(
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
            get().then(
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
            AzureMobileClient.addDataAsync("tp_productos", item).then(
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
            AzureMobileClient.updateDataAsync("tp_productos", item).then(
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

            AzureMobileClient.deleteDataAsync("tp_productos", item).then(
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