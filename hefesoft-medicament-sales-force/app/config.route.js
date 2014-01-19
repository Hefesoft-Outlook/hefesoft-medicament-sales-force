﻿(function () {
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
                        rol: ['Identificados']
                    }
                }
            }, {
                url: '/admin',
                config: {
                    title: 'admin',
                    templateUrl: 'app/admin/admin.html',
                    settings: {
                        nav: 2,
                        content: '<i class="icon-lock"></i> Admin',
                        rol: ['Identificados']
                    }
                }
            },{
                url: '/autenticacion',
                config: {
                    title: 'login',
                    templateUrl: 'app/autenticacion/login.html',
                    settings: {
                        nav: 3,
                        content: '<i class="icon-lock"></i> login',
                        rol: ['Identificados']
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
                        rol: ['No_identificados']
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
                        rol: ['No_identificados']
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
                        rol: ['No_identificados']
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
                        rol: ['No_identificados']
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
                        rol: ['No_identificados']
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
                        rol: ['No_identificados']
                    }
                }
            }
        ];
    }
})();