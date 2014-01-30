(function () {
    'use strict';

    // Define the common module 
    // Contains services:
    //  - common
    //  - logger
    //  - spinner
    var commonModule = angular.module('common', []);

    // Must configure the common service and set its 
    // events via the commonConfigProvider
    commonModule.provider('commonConfig', function () {
        this.config = {
            // These are the properties we need to set
            //controllerActivateSuccessEvent: '',
            //spinnerToggleEvent: ''
        };

        this.$get = function () {
            return {
                config: this.config
            };
        };
    });

    commonModule.factory('common',
        ['$q', '$rootScope', '$timeout', 'commonConfig', 'logger', '$cookieStore', common]);

    function common($q, $rootScope, $timeout, commonConfig, logger, $cookieStore) {
        var throttles = {};

        var service = {
            // common angular dependencies
            $broadcast: $broadcast,
            $q: $q,
            $timeout: $timeout,
            // generic
            activateController: activateController,
            createSearchThrottle: createSearchThrottle,
            debouncedThrottle: debouncedThrottle,
            isNumber: isNumber,
            logger: logger, // for accessibility
            textContains: textContains,
            $cookieStore: $cookieStore,
            sidebar : null,
            Usuario_Logueado: null,
            ciclo: 'D43B7F8D-DB0D-4784-92AC-F62DB01B6041',
            fechaCalculoPlanear: null,
            validarSiEsFechaHoy: validarSiEsFechaHoy,
            convertirDatosExtra: convertirDatosExtra,
            mapearNombres: mapearNombres,
            timeEditor: timeEditor,
            sortNombre: sortNombre,
            eliminarControles: eliminarControles,
            eliminarEventos: eliminarEventos
        };

        return service;

        function activateController(promises, controllerId) {
            return $q.all(promises).then(function (eventArgs) {                
                var data = { controllerId: controllerId };                
                $broadcast(commonConfig.config.controllerActivateSuccessEvent, data);
            });
        }       

        function eliminarControles() {
            try {
                $("#gridPanelVisitador").remove();
                $("#gridBuscadorActividadesJustificadas").remove();                
            } catch (e) {

            }
        }


        function eliminarEventos() {
            try { document.removeEventListener("eliminarVisitaPlaneada", visitaPlaneadaEliminada, false); } catch (e) { };
            try { document.removeEventListener("eliminarVisitaRealizada", visitaPlaneadaEliminada, false); } catch (e) { };
            try { document.removeEventListener("VisitasPlaneadasCargadas", visitasPlaneadasCargadas, false); } catch (e) { };
            try { document.removeEventListener("contactoAgregado", visitasPlaneadasCargadas, false); } catch (e) { };
            try { document.removeEventListener("actividadJustificadaAgregada", visitasPlaneadasCargadas, false); } catch (e) { };            
        }


        function $broadcast() {
            return $rootScope.$broadcast.apply($rootScope, arguments);
        }

        function createSearchThrottle(viewmodel, list, filteredList, filter, delay) {
            // custom delay or use default
            delay = +delay || 300;
            // if only vm and list parameters were passed, set others by naming convention 
            if (!filteredList) {
                // assuming list is named sessions,
                // filteredList is filteredSessions
                filteredList = 'filtered' + list[0].toUpperCase() + list.substr(1).toLowerCase(); // string
                // filter function is named sessionFilter
                filter = list + 'Filter'; // function in string form
            }

            // create the filtering function we will call from here
            var filterFn = function () {
                // translates to ...
                // vm.filteredSessions 
                //      = vm.sessions.filter(function(item( { returns vm.sessionFilter (item) } );
                viewmodel[filteredList] = viewmodel[list].filter(function(item) {
                    return viewmodel[filter](item);
                });
            };

            return (function () {
                // Wrapped in outer IFFE so we can use closure 
                // over filterInputTimeout which references the timeout
                var filterInputTimeout;

                // return what becomes the 'applyFilter' function in the controller
                return function(searchNow) {
                    if (filterInputTimeout) {
                        $timeout.cancel(filterInputTimeout);
                        filterInputTimeout = null;
                    }
                    if (searchNow || !delay) {
                        filterFn();
                    } else {
                        filterInputTimeout = $timeout(filterFn, delay);
                    }
                };
            })();
        }

        function debouncedThrottle(key, callback, delay, immediate) {
            var defaultDelay = 1000;
            delay = delay || defaultDelay;
            if (throttles[key]) {
                $timeout.cancel(throttles[key]);
                throttles[key] = undefined;
            }
            if (immediate) {
                callback();
            } else {
                throttles[key] = $timeout(callback, delay);
            }
        }

        function isNumber(val) {
            // negative or positive
            return /^[-]?\d+$/.test(val);
        }

        function textContains(text, searchText) {
            return text && -1 !== text.toLowerCase().indexOf(searchText.toLowerCase());
        }

        function validarSiEsFechaHoy(fechaSeleccionada) {
            var today = new Date();
            if (fechaSeleccionada.getFullYear() == today.getFullYear() && fechaSeleccionada.getMonth() + 1 == today.getMonth() + 1 && fechaSeleccionada.getDate() == today.getDate()) {
                return true;
            }
            else {
                return false;
            }
        }

        function convertirDatosExtra(resultado) {
            for (var i in resultado) {
                try {
                    // Revizarlo
                    while (!(resultado[i].datosExtra instanceof Array)) {
                        resultado[i].datosExtra = JSON.parse(resultado[i].datosExtra);
                    }
                } catch (e) {

                }
            }
        };

        function mapearNombres(resultado) {
            for (var i in resultado) {
                try {
                    if (resultado[i].datosExtra.primerNombre === undefined) {
                        if (resultado[i].datosExtra.Nombre !== undefined) {
                            resultado[i]["nombre"] = resultado[i].datosExtra.Nombre;
                            resultado[i]["tipo"] = 2;
                            resultado[i]["tipoNombre"] = "Farmacia";
                        }
                        else {
                            resultado[i]["nombre"] = resultado[i].datosExtra.nombre;
                            resultado[i]["tipo"] = 3;
                            resultado[i]["tipoNombre"] = "Actividad Justificada";
                        }
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

        function timeEditor(container, options) {
            $('<input data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '" data-format="' + options.format + '"/>')
                    .appendTo(container)
                    .kendoTimePicker({});
        }

        function sortNombre(a, b) {
            if (a.nombre < b.nombre)
                return -1;
            if (a.nombre > b.nombre)
                return 1;
            return 0;
        }

    }
})();