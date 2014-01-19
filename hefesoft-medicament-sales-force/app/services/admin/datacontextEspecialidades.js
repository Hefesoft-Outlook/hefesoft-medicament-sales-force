(function () {
    'use strict';

    var serviceId = 'datacontextEspecialidades';
    angular.module('app').factory(serviceId,
        ['common', 'AzureMobileClient', datacontextEspecialidades]);

    function datacontextEspecialidades(common, AzureMobileClient) {
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
            getEspecialidades: getEspecialidades,
            especialidadesDataSource: dataSource
        };

        return service;

        function getEspecialidades() {
            var deferred = $q.defer();
            AzureMobileClient.getAllData('especialidades',50).then(
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
            getEspecialidades().then(
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
            AzureMobileClient.addDataAsync("especialidades", item).then(
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
            AzureMobileClient.updateDataAsync("especialidades", item).then(
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

            AzureMobileClient.deleteDataAsync("especialidades", item).then(
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