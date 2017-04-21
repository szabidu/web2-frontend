var angular = require("angular");

var tilosApp = angular.module('tilosApp');

tilosApp.factory('Meta', MetaService);

function MetaService($rootScope) {
    return {
       setTitle: function (newTitle) {
           var title = 'Tilos Rádió 90.3';
           if (!!newTitle) {
                title += ' - ' + newTitle;
           }
            $rootScope.pageTitle = title;
        },
        setDescription: function (newDesc) {
            var desc = 'A Tilos Rádió egy budapesti nonprofit rádió. A műsorkészítők a legkülönbözőbb polgári foglalkozásúak, talán éppen újságíróból és médiaszakemberből van köztük a legkevesebb. A rádió hallgatottsága pontosan nem ismert, de az elmúlt években több rádióhallgatási szokásokat vizsgáló közvélemény kutatásba is bekerült a Tilos Rádió. Ennek alapján a Tilos hallgatottság folyamatosan emelkedik és napi szinten 30 000 hallgatóval, havi szinten pedig 100 000-nél is több egyedi hallgatóval rendelkezik.';

            if (!!newDesc) {
                desc = newDesc;
            }

            $rootScope.pageDescription = desc;
        }
   };
   
}