(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());
    
    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {

        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

    // Define the routes 
    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="icon-dashboard"></i> Dashboard',
                        rol: ['admin']
                    }
                }
            }, {
                url: '/ciclos',
                config: {
                    title: 'ciclos',
                    templateUrl: 'app/admin/ciclos.html',
                    settings: {
                        nav: 3,
                        content: '<i class="icon-lock"></i> ciclos',
                        rol: ['admin']
                    }
                }
            }, {
                url: '/medicos',
                config: {
                    title: 'medicos',
                    templateUrl: 'app/admin/medicos.html',
                    settings: {
                        nav: 4,
                        content: '<i class="icon-lock"></i> medicos',
                        rol: ['admin']
                    }
                }
            }, {
                url: '/farmacias',
                config: {
                    title: 'farmacias',
                    templateUrl: 'app/admin/farmacias.html',
                    settings: {
                        nav: 4,
                        content: '<i class="icon-lock"></i> farmacias',
                        rol: ['admin']
                    }
                }
            }, {
                url: '/especialidades',
                config: {
                    title: 'especialidades',
                    templateUrl: 'app/admin/especialidades.html',
                    settings: {
                        nav: 4,
                        content: '<i class="icon-lock"></i> especialidades',
                        rol: ['admin']
                    }
                }
            }, {
                url: '/roles',
                config: {
                    title: 'roles',
                    templateUrl: 'app/admin/roles.html',
                    settings: {
                        nav: 5,
                        content: '<i class="icon-lock"></i> roles',
                        rol: ['admin']
                    }
                }
            }, {
                url: '/usuarios',
                config: {
                    title: 'usuarios',
                    templateUrl: 'app/admin/usuarios.html',
                    settings: {
                        nav: 6,
                        content: '<i class="icon-lock"></i> usuarios',
                        rol: ['Identificados']
                    }
                }
            }
        ];
    }
})();