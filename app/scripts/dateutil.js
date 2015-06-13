angular.module('tilosApp').factory('dateUtil', function () {
    return {
        toHourMin: function (epoch) {
            var d = new Date();
            d.setTime(epoch);
            var result = "" + (d.getHours() < 10 ? "0" : "" ) + d.getHours() + ':' + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes() + ":" + (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();
            return result;
        },
        setDate: function (dateEpoch, dateStr) {
            var date = new Date();
            date.setTime(dateEpoch);
            var parts = dateStr.split(':');
            date.setHours(parseInt(parts[0], 10));
            date.setMinutes(parseInt(parts[1], 10));
            if (parts.length > 2) {
                date.setSeconds(parseInt(parts[2], 10));
            }
            return date.getTime();
        }
    };
})
