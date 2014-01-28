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
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true
            , schema: {
                total: function (response) {
                    return response.totalCount; // total is returned in the "total" field of the response
                },
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false, validation: { required: false } },
                        primerNombre: { type: "string", validation: { required: true } },
                        segundoNombre: { type: "string", validation: { required: true } },
                        primerApellido: { type: "string", validation: { required: true } },
                        segundoApellido: { type: "string", validation: { required: true } }, 
                        cumpleanios: { type: "date", validation: { required: false } },
                        //especialidadId: { type: "numeric", validation: { required: false } },
                    }
                }
            },
        });

        var service = {
            getMedicos: getMedicos,
            medicosDataSource: dataSource
        };

        return service;

        function getMedicos(options) {
            var deferred = $q.defer();
            AzureMobileClient.getDataFilterskip('TP_Medicos', options.data.filter, options.data.take, options.data.skip, options.data.sort).then(
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

            getMedicos(options).then(
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
                    options.success(result);

                    item = result;
                    var unidadVisita = new Object();
                    unidadVisita.data = new Object();
                    unidadVisita.data.idUnidadVisita = item.id;
                    unidadVisita.data.tipo = 1;
                    unidadVisita.data.nombreMostrar = item.primerNombre + ' ' + item.segundoNombre + ' ' + item.primerApellido + ' ' + item.segundoApellido;
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
                    options.success(result);

                    datacontextUnidadVisita.getUnidadVisitaById(result.id).then(
                        function (unidadVisita) {
                            unidadVisita.datosExtra = JSON.stringify(result);
                            var options = new Object();
                            options.data = new Object();
                            options.data = unidadVisita;
                            unidadVisita.data.nombreMostrar = item.primerNombre + ' ' + item.segundoNombre + ' ' + item.primerApellido + ' ' + item.segundoApellido;
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
                    options.success(item.id);

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