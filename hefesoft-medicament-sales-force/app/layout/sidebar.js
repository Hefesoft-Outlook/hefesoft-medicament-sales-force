(function () { 
    'use strict';
    
    var controllerId = 'sidebar';
    angular.module('app').controller(controllerId,
        ['$route', 'config', 'routes', sidebar]);

    function sidebar($route, config, routes) {
        var vm = this;

        vm.isCurrent = isCurrent;

        activate();

        function activate() { getNavRoutes(); }

        vm.reloadMenu = function (rolesUsuario) {
            getNavRoutesRol(rolesUsuario);
            $route.reload();
        };

        // Valida Contra  los roles
        function getNavRoutesRol(rolesUsuario) {
            vm.navRoutes = routes.filter(function (r) {
                if (r.config.settings && r.config.settings.nav) {
                    var valorRetornar = false;
                    var x = null;
                    for (x in r.config.settings.rol) {

                        var rolMenu = r.config.settings.rol[x];
                        var y = null;

                        // Aca voy a iterar contra los que vienen de la bd
                        for (y in rolesUsuario) {
                            if (rolesUsuario[y] == rolMenu) {
                                valorRetornar = true;
                            }
                        }
                    }
                    return valorRetornar;
                } else {
                    return false;
                }
            }).sort(function (r1, r2) {
                return r1.config.settings.nav > r2.config.settings.nav;
            });
        }
        
        function getNavRoutes() {
            vm.navRoutes = routes.filter(function (r) {
                if (r.config.settings && r.config.settings.nav) {
                    var valorRetornar = false;
                    var x = null;

                    for (x in r.config.settings.rol) {

                        if (r.config.settings.rol[x] == "No_identificados") {
                            valorRetornar = true;
                            break;
                        }
                    }
                    return valorRetornar;
                } else {
                    return false;
                }
            }).sort(function (r1, r2) {
                return r1.config.settings.nav > r2.config.settings.nav;
            });
        }
        
        function isCurrent(route) {
            if (!route.config.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.config.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }
    };
})();