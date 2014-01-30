(function () {
    'use strict';

    var serviceId = 'datacontextVisitaRealizada';
    angular.module('app').factory(serviceId,
        ['common', 'AzureMobileClient', datacontextVisitaRealizada]);

    function datacontextVisitaRealizada(common, AzureMobileClient) {
        var $q = common.$q;      
        var item = null;

        var evtVisitasPlaneadasCargadas = document.createEvent("Event");
        evtVisitasPlaneadasCargadas.initEvent("VisitasPlaneadasCargadas", true, true);        
        evtVisitasPlaneadasCargadas.elemento = null;

        var evtEliminarVisitaRealizada = document.createEvent("Event");
        evtEliminarVisitaRealizada.initEvent("eliminarVisitaRealizada", true, true);
        evtEliminarVisitaRealizada.elemento = null;

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
                        observaciones: { field: "observaciones", type: "string", validation: { required: true } },
                        idActividadJustificada: { field: "idActividadJustificada", type: "numeric", validation: { required: true } },
                    }
                }
            },
        });

        var service = {            
            visitaRealizadaDataSource: dataSource           
        };
    

        return service;

        function getVisitaRealizada(options) {
            var deferred = $q.defer();

            if (options.data.filter === undefined) {
                options.data.filter = new Object();
                options.data.filter.filters = new Array();
            }

            if (common.fechaCalculoPlanear === null) {
                var today = new Date();                
                common.fechaCalculoPlanear = today;
            }

            options.data.filter.filters.push({ field: "idCiclo", value: common.ciclo });
            options.data.filter.filters.push({ field: "idUsuario", value: common.Usuario_Logueado.idAntiguo });
            options.data.filter.filters.push({ field: "aniofecha", value: common.fechaCalculoPlanear.getFullYear() });
            options.data.filter.filters.push({ field: "mesfecha", value: common.fechaCalculoPlanear.getMonth() + 1 });
            options.data.filter.filters.push({ field: "diafecha", value: common.fechaCalculoPlanear.getDate() });
            

            AzureMobileClient.getDataFilterskip('tm_visita_realizada', options.data.filter, options.data.take, options.data.skip, options.data.sort).then(
                    function (resultado) {
                        common.convertirDatosExtra(resultado);
                        common.mapearNombres(resultado);
                        resultado.sort(common.sortNombre);
                        deferred.resolve(resultado);                        
                    },
                    function (error) {
                        deferred.reject(error);
                    }
                );

            return deferred.promise;
        }


        function dataSourceRead(options) {
            getVisitaRealizada(options).then(
                        function (result) {                            
                            options.success(result);
                            document.dispatchEvent(evtVisitasPlaneadasCargadas);
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

            AzureMobileClient.addDataAsync("tm_visita_realizada", item).then(
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
            AzureMobileClient.updateDataAsync("tm_visita_realizada", item).then(
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

            AzureMobileClient.deleteDataAsync("tm_visita_realizada", item).then(
                function (result) {
                    options.success(item.id);
                    item.idPanelVisitador = options.data.idPanelVisitador;
                    item["accionEjecutada"] = false;
                    evtEliminarVisitaRealizada.elemento = item;
                    document.dispatchEvent(evtEliminarVisitaRealizada);
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