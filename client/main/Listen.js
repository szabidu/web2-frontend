var angularModule = require("main/Main");

require("main/Listen.css");

angularModule.component('listenNow', {
    template: '<div class="panel panel-default listen-panel">\
               <div class="panel-heading">Hallgass</div>\
               <div class="panel-body">\
               <a href="http://stream.tilos.hu/citadella" class="btn btn-lg col-xs-12 btn-danger">Élő adás (256)</a>\
               <a href="/podcast" class="btn btn-lg col-xs-12 rss btn-danger">Podcast <span class="icon-rss-alt"></a>\
               <a href="/archive" class="btn btn-lg col-xs-12 btn-info">Archívum</a>\
               <p>További streamek:</p>\
               <a href="http://stream.tilos.hu/mese" class="btn btn-lg col-xs-12 btn-danger">Tilos Mesék </a>\
               <a href="http://stream.tilos.hu/tordas_radio_online" class="btn btn-lg col-xs-12 btn-danger">Tordas Rádió </a>\
               </div>\
               </div>\
               </div>',
    controller: function () {
    }
});
