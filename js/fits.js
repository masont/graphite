(function() {
 
 var mean = Graphite.Utils.mean;
 var sum = Graphite.Utils.sum;
 var first = Graphite.Utils.getter(0);
 var second = Graphite.Utils.getter(1);
 var square = function(x) { return Math.pow(x, 2); };

 Graphite.Fits = {
     linear: function(ps) {
         var xs = $.map(ps, first); var ys = $.map(ps, second);
         var meanX = mean(xs); var meanY = mean(ys);

         var ssXX = sum($.map(xs, function(x) { return square(x - meanX);}));
         var ssYY = sum($.map(ys, function(y) { return square(y - meanY);}));
         var ssXY = sum($.map(ps, function(p) { 
             return (p[0] - meanX) * (p[1] - meanY);
         }));

         var b = ssXY / ssXX;
         var a = meanY - b * meanX;  
         var r = square(ssXY) / (ssXX * ssYY);

         return [a, b, r];
     }    
 };


})();
