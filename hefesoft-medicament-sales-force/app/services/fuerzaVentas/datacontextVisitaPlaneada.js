(function () {
    'use strict';

    var serviceId = 'datacontextVisitaPlaneada';
    angular.module('app').factory(serviceId,
        ['common', 'AzureMobileClient', datacontextVisitaPlaneada]);

    function datacontextVisitaPlaneada(common, AzureMobileClient) {
        var $q = common.$q;      
        var item = null;

        var evtEliminarVisitaPlaneada = document.createEvent("Event");
        evtEliminarVisitaPlaneada.initEvent("eliminarVisitaPlaneada", true, true);        
        evtEliminarVisitaPlaneada.elemento = null;
            


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
                        nombre: { field: "nombre", type: "string", editable: false, validation: { required: false } },
                        idUsuario: { field: "idUsuario", type: "string", validation: { required: true } },
                        idCiclo: { field: "idCiclo", type: "string", validation: { required: true } },
                        idPanelVisitador: { field: "idPanelVisitador", type: "string", validation: { required: true } },
                        fecha: { field: "fecha", type: "date", validation: { required: true } },
                    }
                }
            },
        });

        var service = {            
            visitaPlaneadaDataSource: dataSource,
            getVisitaPlaneadasDia: getVisitaPlaneadasDia
        };
    

        return service;

        function getVisitaPlaneada(options) {
            var deferred = $q.defer();

            if (options.data.filter === undefined) {
                options.data.filter = new Object();
                options.data.filter.filters = new Array();
            }

            if (common.fechaCalculoPlanear === null) {
                var today = new Date();
                var tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);
                common.fechaCalculoPlanear = tomorrow;
            }

            options.data.filter.filters.push({ field: "idCiclo", value: common.ciclo });
            options.data.filter.filters.push({ field: "idUsuario", value: common.Usuario_Logueado.idAntiguo });
            options.data.filter.filters.push({ field: "aniofecha", value: common.fechaCalculoPlanear.getFullYear() });
            options.data.filter.filters.push({ field: "mesfecha", value: common.fechaCalculoPlanear.getMonth() + 1 });
            options.data.filter.filters.push({ field: "diafecha", value: common.fechaCalculoPlanear.getDate() });
            

            AzureMobileClient.getDataFilterskip('tm_visita_planeada', options.data.filter, options.data.take, options.data.skip, options.data.sort).then(
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

        function getVisitaPlaneadasDia(options) {
            var deferred = $q.defer();

            var filter = new Object();
            filter.filters = new Array();
            
            if (common.fechaCalculoPlanear === null) {
                var today = new Date();                
                common.fechaCalculoPlanear = today;
            }

            filter.filters.push({ field: "idCiclo", value: common.ciclo });
            filter.filters.push({ field: "idUsuario", value: common.Usuario_Logueado.idAntiguo });
            filter.filters.push({ field: "aniofecha", value: common.fechaCalculoPlanear.getFullYear() });
            filter.filters.push({ field: "mesfecha", value: common.fechaCalculoPlanear.getMonth() + 1 });
            filter.filters.push({ field: "diafecha", value: common.fechaCalculoPlanear.getDate() });


            AzureMobileClient.getDataFilterskip('tm_visita_planeada', filter, 100, 0).then(
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
            options.data.datosExtra = JSON.stringify(options.data.datosExtra);
            item = options.data;
            generarEnterosFecha();

            AzureMobileClient.addDataAsync("tm_visita_planeada", item).then(
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
            item = options.data;
            generarEnterosFecha();
            AzureMobileClient.updateDataAsync("tm_visita_planeada", item).then(
                function (result) {
                    options.success(result);
                },
                function (err) {
                    options.error();
                }
                );
        };

        function dataSourceDestroy(options) {
            evtEliminarVisitaPlaneada.elemento = options.data;
            var item = new Object();
            item.id = options.data.id;

            AzureMobileClient.deleteDataAsync("tm_visita_planeada", item).then(
                function (result) {
                    options.success(item.id);
                    document.dispatchEvent(evtEliminarVisitaPlaneada);
                },
                function (err) {
                    options.error();
                }
                );
        };       


        function generarEnterosFecha() {
            item.aniofecha = item.fecha.getFullYear();
            item.mesfecha = item.fecha.getMonth() + 1;
            item.diafecha = item.fecha.getDate();
        };
    }
})();