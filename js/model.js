Graphite.Model = function() {

    var self = this;

    this.data = {
        color: "red",
        data: [  ],
        points: { show: true },
        lines: { show: false }
    };

    this.fit = {
        type: "off",
        color: "#eee",
        data: [],
        points: { show: false },
        lines: { show: true }   
    };

    this.addPoint = function(p) {
        this.data.data.push([p[0], p[1]]);        
        this.fit();
    };

    this.deleteAll = function() {
        this.data.data = [];
        this.fit();
    };

    this.deletePoint = function(p) {
        var j = -1;
        $.each(this.data.data, function(i, n) {
            if (p[0] == n[0] && p[1] == n[1]) {
                j = i;
            }
        });
        if (j < 0) { return; }
        this.data.data.splice(j, 1);
        this.fit();
    };

    this.deletePoints = function(ps) {
        $.each(ps, function(i, n) {
            self.deletePoint(n);
        });
    };    

    this.invert = function() {
        var inverted = $.map(this.data.data, function(p) {
            return [[p[1], p[0]]];
        });
        this.data.data = inverted;
        this.fit();
    };

    this.fit = function(type) {
        if (type === null) {
            type = this.fit.type;
        } else {
            this.fit.type = type;
        }

        if (type == "off") {
            this.fit.data = [];
        } else if (type == "linear" ) {
            if (this.data.data.length < 2) {
                this.fit.data = [];
                return;
            }
            var coeffs = Graphite.Fits.linear(this.data.data);
            
            var a = coeffs[0]; var b = coeffs[1];
            this.fit.data = $.map(this.data.data, function(p) {
                return [[p[0], a + b *  p[0]]];
            });
        }
    };

    this.find = function(type) {
        var ps = this.data.data;
        if (ps.length < 1) { return null; }
        if (type == "max") {
            var j = 0; 
            var max = ps[j][1];
            for (i = 1; i < ps.length; i++) {
                if (ps[i][1] > max) {
                    j = i;
                    max = ps[j][1];
                }
            }
            return j;
        } else if (type == "min") {
            var j = 0; 
            var min = ps[j][1];
            for (i = 1; i < ps.length; i++) {
                if (ps[i][1] < min) {
                    j = i;
                    min = ps[j][1];
                }
            }
            return j;
        }
    };

};
