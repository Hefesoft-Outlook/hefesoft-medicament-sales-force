(function () { 
    'use strict';
    
    var controllerId = 'topnav';
    angular.module('app').controller(controllerId, ['common', '$scope', '$modal', 'AzureMobileClient', topnav]);

    function topnav(common, $scope, $modal, AzureMobileClient) {
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var log = getLogFn(controllerId);
        var Usuario_A_Crear = null;
        var Usuario_A_Ingresar = null;
       

        $scope.open = function() {
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    items: function() {
                        return $scope.usuario;
                    }
                }
            });

            modalInstance.result.then(function() {
               
            }, function() {
               
            });
        };
        
        $scope.openRegistro = function () {
            var modalInstance = $modal.open({
                templateUrl: 'registrarse.html',
                controller: ModalInstanceCtrlRegistro,
                resolve: {
                    items: function () {
                        
                    }
                }
            });

            modalInstance.result.then(function () {
            }, function () {
                
            });
        };

        var ModalInstanceCtrl = function ($scope, $modalInstance) {

            $scope.usuario = new Object();
            $scope.usuario = { email: null, clave: null, Recuerdame: null };

            $scope.ok = function () {
                
                delete $scope.usuario['Recuerdame'];

                AzureMobileClient.getDataFilter('Usuarios', $scope.usuario, 300).then(
                    function (resultado) {
                        if (resultado.length > 0) {
                            $modalInstance.close($scope.usuario);
                            logSuccess('Bienvenido ' + $scope.usuario.email, null, true);
                            common.Usuario_Logueado = resultado[0];

                            var roles = JSON.parse(resultado[0].roles);
                            common.sidebar.reloadMenu(roles);
                        }
                    },
                    function (error) {
                        log('Usuario o contraseña incorrectos');
                    }
                );
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
        
        var ModalInstanceCtrlRegistro = function ($scope, $modalInstance) {

            $scope.usuario = new Object();
            $scope.usuario = { email: null, clave: null };

            $scope.ok = function () {
                Usuario_A_Crear = $scope.usuario;
                $modalInstance.close($scope.usuario);
                AzureMobileClient.getDataFilter('Usuarios', $scope.usuario, 300).then(crearUsuario, erroresAzureMobileServices);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };


        function crearUsuario(resultado) {
            if (resultado.length == 0) {
                Usuario_A_Crear.Roles = JSON.stringify(['Identificados', 'No_identificados']);

                AzureMobileClient.addData('Usuarios', Usuario_A_Crear);
                logSuccess('Usuario creado');
                common.Usuario_Logueado = resultado[0];

            } else {
                log('El usuario ya se encuentra en el sistema');
            }
        };

        function erroresAzureMobileServices(error) {

        };

        activate();

        function activate() {

        }
    };
})();