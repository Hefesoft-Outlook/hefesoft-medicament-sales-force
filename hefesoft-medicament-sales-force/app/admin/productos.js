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
            'datacontextProducto',
            'datacontextLinea',
            'datacontextPais',
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
            datacontextProductoInformacionAdicional,
            datacontextProducto,
            datacontextLinea,
            datacontextPais
        ) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Productos';
        vm.filaSeleccionada = null;
        vm.productosDataSource = datacontextProducto.dataSource;
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

        vm.columnsProductos = [
            { hidden: true, field: "id" },
            { field: "nombre", title: "Nombre" },
            { field: "MercadoRelevante", title: "Mercado Relevante" },
            { field: "Alias", title: "Alias" },
            { field: "IdProductoMarca", title: "Marca" },
            { field: "IdProductoCampo", title: "Campo" },
            { field: "IdProductoPrincipioActivo", title: "Principio activo" },
            { field: "IdProductoFormaFarmaceutica", title: "Forma Farmaceutica" },
            { field: "IdProductoUnidadMedida", title: "Unidad de medida" },
            { field: "IdProductoPresentacionComercial", title: "Presentacion comercial" },
            { field: "IdProductoInformacionAdicional", title: "Informacion adicional" },
            //{ field: "IdLinea", title: "Linea" },
            { field: "IdPais", title: "Pais" },
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
        
        vm.gridOptsProductos = {
            columns: vm.columnsProductos,
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            filterable: { extra: false },
            pageable: true,
            selectable: "row",
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

        vm.rowSelected = function (e) {
            var grid = e.sender;
            var contador = -1;
            var numeroColumna = _.find(grid.columns, function (columna) { contador++; return columna.field == "IdProductoMarca"; });
            grid.columns[contador].editor = DropDownMarca;

            contador = -1;
            var numeroColumna = _.find(grid.columns, function (columna) { contador++; return columna.field == "IdProductoCampo"; });
            grid.columns[contador].editor = DropDownCampo;

            contador = -1;
            var numeroColumna = _.find(grid.columns, function (columna) { contador++; return columna.field == "IdProductoPrincipioActivo"; });
            grid.columns[contador].editor = DropDownPrincipioActivo;

            contador = -1;
            var numeroColumna = _.find(grid.columns, function (columna) { contador++; return columna.field == "IdProductoFormaFarmaceutica"; });
            grid.columns[contador].editor = DropDownFormaFarmaceutica;

            contador = -1;
            var numeroColumna = _.find(grid.columns, function (columna) { contador++; return columna.field == "IdProductoUnidadMedida"; });
            grid.columns[contador].editor = DropDownUnidadMedida;

            contador = -1;
            var numeroColumna = _.find(grid.columns, function (columna) { contador++; return columna.field == "IdProductoPresentacionComercial"; });
            grid.columns[contador].editor = DropDownPresentacionComercial;

            contador = -1;
            var numeroColumna = _.find(grid.columns, function (columna) { contador++; return columna.field == "IdProductoInformacionAdicional"; });
            grid.columns[contador].editor = DropDownInformacionAdicional;

            //contador = -1;
            //var numeroColumna = _.find(grid.columns, function (columna) { contador++; return columna.field == "IdLinea"; });
            //grid.columns[contador].editor = DropDownLinea;

            contador = -1;
            var numeroColumna = _.find(grid.columns, function (columna) { contador++; return columna.field == "IdPais"; });
            grid.columns[contador].editor = DropDownPais;
        };

        function DropDownMarca(container, options) {
            $('<input required data-text-field="nombre" data-value-field="IdProductoMarca" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: false,
                    dataSource: datacontextProductoMarca.dataSource
                });
        };

        function DropDownCampo(container, options) {
            $('<input required data-text-field="nombre" data-value-field="IdProductoCampo" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: false,
                    dataSource: datacontextProductoCampo.dataSource
                });
        };

        function DropDownPrincipioActivo(container, options) {
            $('<input required data-text-field="nombre" data-value-field="IdProductoPrincipioActivo" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: false,
                    dataSource: datacontextProductoPrincipioActivo.dataSource
                });
        };

        function DropDownFormaFarmaceutica(container, options) {
            $('<input required data-text-field="nombre" data-value-field="IdProductoFormaFarmaceutica" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: false,
                    dataSource: datacontextProductoFormaFarmaceutica.dataSource
                });
        };
        
        function DropDownUnidadMedida(container, options) {
            $('<input required data-text-field="nombre" data-value-field="IdProductoUnidadMedida" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: false,
                    dataSource: datacontextProductoUnidadMedida.dataSource
                });
        };
        
        function DropDownPresentacionComercial(container, options) {
            $('<input required data-text-field="nombre" data-value-field="IdProductoPresentacionComercial" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: false,
                    dataSource: datacontextProductoPresentacionComercial.dataSource
                });
        };

        function DropDownInformacionAdicional(container, options) {
            $('<input required data-text-field="nombre" data-value-field="IdProductoInformacionAdicional" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: false,
                    dataSource: datacontextProductoInformacionAdicional.dataSource
                });
        };
        
        //function DropDownLinea(container, options) {
        //    $('<input required data-text-field="nombre" data-value-field="IdLinea" data-bind="value:' + options.field + '"/>')
        //        .appendTo(container)
        //        .kendoDropDownList({
        //            autoBind: false,
        //            dataSource: datacontextLinea.dataSource
        //        });
        //};
        
        function DropDownPais(container, options) {
            $('<input required data-text-field="nombre" data-value-field="IdPais" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: false,
                    dataSource: datacontextLinea.dataSource
                });
        };
    }
})();