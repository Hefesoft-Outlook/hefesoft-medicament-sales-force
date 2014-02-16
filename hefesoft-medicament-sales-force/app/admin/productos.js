(function () {
    'use strict';
    var controllerId = 'productos';
    angular.module('app').controller(controllerId,
        [
            'common',
            '$scope',
            'datacontextProductoMarca',
            'datacontextProductoCampo',
            'datacontextProductoPrincipioActivo',
            'datacontextProductoFormaFarmaceutica',
            'datacontextProductoUnidadMedida',
            'datacontextProductoPresentacionComercial',
            'datacontextProductoInformacionAdicional',
            productos
        ]);

    function productos(
            common,
            $scope,
            datacontextProductoMarca,
            datacontextProductoCampo,
            datacontextProductoPrincipioActivo,
            datacontextProductoFormaFarmaceutica,
            datacontextProductoUnidadMedida,
            datacontextProductoPresentacionComercial,
            datacontextProductoInformacionAdicional
        ) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Productos';
        vm.filaSeleccionada = null;
        vm.marcasDataSource = datacontextProductoMarca.dataSource;
        vm.campoDataSource = datacontextProductoCampo.dataSource;
        vm.principioActivoDataSource = datacontextProductoPrincipioActivo.dataSource;
        vm.formaFarmaceuticaDataSource = datacontextProductoFormaFarmaceutica.dataSource;
        vm.productoUnidadMedidaDataSource = datacontextProductoUnidadMedida.dataSource;
        vm.productoPresentacionComercialDataSource = datacontextProductoPresentacionComercial.dataSource;
        vm.productoInformacionAdicionalDataSource = datacontextProductoInformacionAdicional.dataSource;
        

        vm.columns = [            
            { hidden: true, field: "id" },
            { field: "nombre", title: "Nombre" },            
            { command: ["edit", "destroy"] }
        ];

        vm.gridOpts = {
            columns: vm.columns,
            filterable: { extra: false },
            pageable: false,          
            reorderable: true,
            sortable: true,
            editable: {
                mode: "popup",
                //createAt: "top"
            },
            mobile: true,
            height: "24em",
            resizable: true,
            toolbar: [
                { name: "create" }                
            ]        
        };

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function (result) {                   
                    log('Parametrizar productos');
                });
        }
    }
})();