(function () {
    'use strict';
    
    var app = angular.module('app', [
        // Angular modules 
        'kendo.directives',
        'ngCookies',
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)

        // Custom modules 
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions

        // 3rd Party Modules
        'ui.bootstrap'      // ui-bootstrap (ex: carousel, pagination, dialog)
    ]);
    
    // Handle routing errors and success events
    app.run(['$route', '$rootScope', function ($route, $rootScope, $cookieStore) {
        $rootScope.azureURL = 'https://hefesoft-medicament-sales-force.azure-mobile.net/';
        $rootScope.azureAppKey = 'KPtpYTfuLvrhWBkSCcxADFVOmUNleG14';
    }]);
})();