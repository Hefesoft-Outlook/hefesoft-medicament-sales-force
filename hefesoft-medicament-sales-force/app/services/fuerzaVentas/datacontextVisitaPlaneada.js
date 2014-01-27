(function () {
    'use strict';

    var serviceId = 'datacontextVisitaPlaneada';
    angular.module('app').factory(serviceId,
        ['common', 'AzureMobileClient', datacontextVisitaPlaneada]);

    function datacontextVisitaPlaneada(common, AzureMobileClient) {
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
            serverSorting: true
            , schema: {                
                total: function (response) {
                    return response.totalCount; // total is returned in the "total" field of the response
                },
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false, validation: { required: false } },
                        idUsuario: { field: "idUsuario", type: "string", validation: { required: true } },
                        idCiclo: { field: "idCiclo", type: "string", validation: { required: true } },
                        idPanelVisitador: { field: "idPanelVisitador", type: "string", validation: { required: true } },
                        fecha: { field: "fecha", type: "date", validation: { required: true } },
                    }
                }
            },
        });

        var service = {            
            visitaPlaneadaDataSource: dataSource
        };

        return service;

        function getVisitaPlaneada(options) {
            var deferred = $q.defer();

            if (options.data.filter === undefined) {
                options.data.filter = new Object();
                options.data.filter.filters = new Array();
            }

            options.data.filter.filters.push({ field: "idCiclo", value: common.ciclo });
            options.data.filter.filters.push({ field: "idUsuario", value: common.Usuario_Logueado.idAntiguo });

            AzureMobileClient.getDataFilterskip('tm_visita_planeada', options.data.filter, options.data.take, options.data.skip, options.data.sort).then(
                    function (resultado) {
                        convertirDatosExtra(resultado);
                        mapearNombres(resultado);
                        deferred.resolve(resultado);
                    },
                    function (error) {
                        deferred.reject(error);
                    }
                );

            return deferred.promise;
        }


        function dataSourceRead(options) {
            getVisitaPlaneada(options).then(
                        function (result) {                            
                            options.success(result);
                        },
                        function (error) {
                            options.error(error);
                        }
                        );
        };

        function dataSourceCreate(options) {            
            options.data.datosExtra = jsonJSON.stringify(options.data.datosExtra);
            var item = options.data;
            AzureMobileClient.addDataAsync("tm_visita_planeada", item).then(
                function(result){
                    options.success();
                    },
                function (err) {
                     options.error();
                    }
                );            
        };

        function dataSourceUpdate(options) {            
            options.data.datosExtra = JSON.stringify(options.data.datosExtra);
            var item = options.data;
            AzureMobileClient.updateDataAsync("tm_visita_planeada", item).then(
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

            AzureMobileClient.deleteDataAsync("tm_visita_planeada", item).then(
                function (result) {
                    options.success();
                },
                function (err) {
                    options.error();
                }
                );
        };

        function convertirDatosExtra(resultado) {
            for (var i in resultado) {
                try {
                    resultado[i].datosExtra = JSON.parse(resultado[i].datosExtra);
                } catch (e) {

                }
            }
        };

        function mapearNombres(resultado) {
            for (var i in resultado) {
                try {
                    if (resultado[i].datosExtra.primerNombre === undefined){
                        resultado[i]["nombre"] = resultado[i].datosExtra.Nombre;
                        resultado[i]["tipo"] = 2;
                        resultado[i]["tipoNombre"] = "Farmacia";
                    }
                    else {
                        resultado[i]["nombre"] = resultado[i].datosExtra.primerNombre + " " + resultado[i].datosExtra.primerApellido;                       
                        resultado[i]["tipo"] = 1;
                        resultado[i]["tipoNombre"] = "Medico";
                    }

                    resultado[i]["direccion"] = resultado[i].datosExtra.Direccion;

                } catch (e) {

                }
            }
        };
    }
})();