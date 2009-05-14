(function() {
 
 var sum = function(ns) {
     var x = 0;
     $.each(ns, function(i, n) {
         x += n;
     });
     return x;
 };


 Graphite.Utils = {
     sum: sum,

     mean: function(ns) {
         return sum(ns) / ns.length;
     },

     getter: function(i) {
         return function(ns) { return ns[i]; };
     }
 };

})();
