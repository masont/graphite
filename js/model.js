Graphite.Model = function() {

    var self = this;

    var data = {
        "color": "red",
        "data": [  ],
        "points": { show: true },
        "lines": { show: false }
    };

    this.data = data;

    this.addPoint = function(p) {
        this.data.data.push([p[0], p[1]]);        
    };

    this.deleteAll = function() {
        this.data.data = [];
    };

    this.deletePoint = function(p) {
        var j = -1;
        $.each(this.data.data, function(i, n) {
            if (p[0] == n[0] && p[1] == n[1]) {
                j = i;
            }
        });
        if (j < 0) return;
        this.data.data.splice(j, 1);
    };

    this.deletePoints = function(ps) {
        $.each(ps, function(i, n) {
            self.deletePoint(n);
        });
    };    

}
