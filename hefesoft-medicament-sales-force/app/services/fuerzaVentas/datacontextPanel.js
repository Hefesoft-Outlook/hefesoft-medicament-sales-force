(function () {
    'use strict';

    var serviceId = 'datacontextPanel';
    angular.module('app').factory(serviceId,
        ['common', 'AzureMobileClient', datacontextPanel]);

    function datacontextPanel(common, AzureMobileClient) {
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
            autoSync: false,
            pageSize: 400,
            serverPaging: true,            
            serverSorting: true
            , schema: {
                //id: "id",
                //data : "datosExtra",
                total: function (response) {
                    return response.totalCount; // total is returned in the "total" field of the response
                },
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false, validation: { required: false } },
                        nombre: { field: "nombre", type: "string", validation: { required: true } },
                        contactosCiclo: { field: "contactosCiclo", type: "numeric", validation: { required: true } },
                        contactosPendientes: { field: "contactosPendientes", type: "numeric", validation: { required: true } },
                        direccion: { field: "direccion", type: "string", validation: { required: true } },
                        tipoNombre: { field: "tipoNombre", type: "string", validation: { required: true } },
                    }
                }
            },
        });

        var service = {
            getPanel: getPanel,
            panelDataSource: dataSource,
            actualizar: actualizar
        };

        return service;

        function getPanel(options) {
            var deferred = $q.defer();

            if (options.data.sort === undefined) {
                options.data.sort = new Array();
                options.data.sort.push({ dir: 'asc', field: 'nombre' });
            }            

            if (options.data.filter === undefined) {
                options.data.filter = new Object();
                options.data.filter.filters = new Array();
            }

            options.data.filter.filters.push({ field: "idCiclo", value: common.ciclo });
            options.data.filter.filters.push({ field: "idUsuario", value: common.Usuario_Logueado.idAntiguo });

            AzureMobileClient.getDataFilterskip('TM_Panel_Visitador', options.data.filter, options.data.take, options.data.skip, options.data.sort).then(
                    function (resultado) {
                        common.convertirDatosExtra(resultado);
                        common.mapearNombres(resultado);
                        deferred.resolve(resultado);
                    },
                    function (error) {
                        deferred.reject(error);
                    }
                );

            return deferred.promise;
        }


        function dataSourceRead(options) {

            getPanel(options).then(
                        function (result) {                            
                            options.success(result);
                        },
                        function (error) {
                            options.error(error);
                        }
                        );
        };

        function dataSourceCreate(options) {            
            options.data.datosExtra = JSON.stringify(options.data.datosExtra);
            var item = options.data;
            AzureMobileClient.addDataAsync("TM_Panel_Visitador", item).then(
                function(result){
                    options.success(result);
                    },
                function (err) {
                     options.error();
                    }
                );            
        };

        function dataSourceUpdate(options) {            
            options.data.datosExtra = JSON.stringify(options.data.datosExtra);
            var item = options.data;
            AzureMobileClient.updateDataAsync("TM_Panel_Visitador", item).then(
                function (result) {
                    options.success(result);
                },
                function (err) {
                    options.error();
                }
                );
        };

        function actualizar(item) {
            item.datosExtra = JSON.stringify(item.datosExtra);            
            AzureMobileClient.updateDataAsync("TM_Panel_Visitador", item).then(
                function (result) {
                    result;
                },
                function (err) {
                    
                }
                );
        };

        function dataSourceDestroy(options) {
            var item = new Object();
            item.id = options.data.id;

            AzureMobileClient.deleteDataAsync("TM_Panel_Visitador", item).then(
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