(function () {
    'use strict';

    var serviceId = 'AzureMobileClient';
    angular.module('app').factory(serviceId,
        ['common', '$rootScope', constructor]);

    function constructor(common, $rootScope) {
        var $cookieStore = common.$cookieStore;
        var azureMobileClient = {};
        azureMobileClient.isLoggedIn = false;
        azureMobileClient.azureError = "";
        azureMobileClient.azureMSC = new WindowsAzure.MobileServiceClient($rootScope.azureURL, $rootScope.azureAppKey);

        // Login to Azure method. Takes a string (socialMediaService) with the social media service being used (Facebook, Twitter, etc.)
        // Returns a boolean value indicating success or failure
        azureMobileClient.login = function (socialMediaService) {
            return azureMobileClient.azureMSC.login(socialMediaService).then(
              function (user) {
                  $cookieStore.put("azureUser", user);
              }
              );
        };


        // Logs out from the Azure service
        azureMobileClient.logout = function () {
            azureMobileClient.getUser();
            azureMobileClient.azureMSC.logout();
            $cookieStore.remove("azureUser");
        };

        // Get all data using the read method of the Azure service. Take a string (tableName) indicating the table to get data from
        azureMobileClient.getAllData = function (tableName, numberRows) {
            return azureMobileClient.prepService(tableName).take(numberRows).read();
        };

        azureMobileClient.getDataFilter = function (tableName, data, numberRows) {
            return azureMobileClient.prepService(tableName).take(numberRows).where(data).read();
        };

        azureMobileClient.getDataParameter = function (tableName, data, numberRows) {
            return azureMobileClient.prepService(tableName).take(numberRows).read(data);
        };

        // Adds a data row (data) to the specified table (tableName). 
        // If success, returns the new object that was created.
        // If failure, returns the error text on failure.
        azureMobileClient.addData = function (tableName, data) {
            return azureMobileClient.prepService(tableName).insert(data);
        };

        azureMobileClient.updateData = function (tableName, data) {
            return azureMobileClient.prepService(tableName).update(data);
        };

        azureMobileClient.deleteData = function (tableName, data) {
            return azureMobileClient.prepService(tableName).del(data);
        };

        // Gets the currentUser back from the cookieStore if the currentUser object is null
        azureMobileClient.getUser = function () {
            if (azureMobileClient.azureMSC.currentUser === null) {
                azureMobileClient.azureMSC.currentUser = $cookieStore.get("azureUser");
            }
        };

        // Sets the correct user and gets the appropriate table from Azure. Used in each call above to simplify methods
        azureMobileClient.prepService = function (tableName) {
            azureMobileClient.getUser();
            return azureMobileClient.azureMSC.getTable(tableName);
        };

        return azureMobileClient;
    }
})();