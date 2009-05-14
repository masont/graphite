var selection = null;

$(document).ready(function() {

    
    $("#add-row-form").submit(function() {
        var x = $("#add-x").val();
        var y = $("#add-y").val();

        graphiteController.addPoint([x, y]);

        $("#add-x").val("");
        $("#add-y").val("");
        return false;
    });
  

});

Graphite.Controller = function() {

    var self = this;

    var model = new Graphite.Model();

    var selection;
    
    var plotOptions = {
        selection: {
            mode: "xy"
        },
        crosshair: {
            mode: "xy",
            color: "black"
        },
        grid: {
            clickable: true,
            hoverable: true
        }    
    };

    var clone = function(obj) { return $.extend(true, {}, obj); };

    var history = [];

    var plot = $.plot($("#flot-root"), [model.data], plotOptions);    

    var bindHandlers = function() {
        $("#flot-root").bind("plotselected", function(event, ranges) {
            selection = {};
            selection.ranges = ranges;
            selection.points = [];
            for (i = 0; i < model.data.data.length; i++) {
                var point = model.data.data[i];
                var x = point[0]; var y = point[1];
                if (x >= ranges.xaxis.from && x <= ranges.xaxis.to &&
                    y >= ranges.yaxis.from && y <= ranges.yaxis.to) {
                    // plot.highlight(0, i);
                    selection.points.push(point);
                }
            }
        });

        $("#flot-root").bind("plotunselected", function(event) {
            selection = null;
            for (i = 0; i < model.data.data.length; i++) {
                plot.unhighlight(0, i);
            }
        });

        $("#flot-root").bind("plotclick", function(event, pos, point) {
            self.addPoint([pos.x, pos.y]);
        });

    };

    var updateTable = function() {
        $("#data-table tbody").empty();
        $.each(model.data.data, function(i, n) {
            var makeAction = function() {
                return $('<a>Delete</a>')
                           .wrap("<td></td>") 
                           .attr("href", "#")
                           .addClass("delete-row")
                           .click(function(evt) {
                               self.deletePoint(model.data.data[i]);  
                               return false;
                           })
                           .parent();
            };
            var row = $("<tr></tr>")
                          .append("<td>" + n[0] + "</td>")
                          .append("<td>" + n[1] + "</td>")
                          .append(makeAction()) 
                          .appendTo("#data-table tbody")
                          .attr("id", "row-" + i);

            if (i % 2 == 1) row.addClass("even"); 
        });
    };

    var updatePlot = function() {
        plot.setData([model.data]);
        plot.setupGrid();
        plot.draw();
    };

    var saveState = function() {
        var state = {
            model: clone(model),
            plotOptions: clone(model)
        };
        history.push(state);
        console.log(history);
    };

    var updateAll = function() {
        updateTable();
        updatePlot();
    };

    var commands = {
        add: function(kvs) {
            var x = kvs.x;
            var y = kvs.y;
            self.addPoint([x, y]);            
        },
        zoom: function(kvs) {
            var direction = kvs.direction;
            if (direction == 0) {
                self.zoomReset();
            } else if (direction == 1  && selection.ranges) {
                var ranges = selection.ranges;
                self.zoomToRange(ranges.xaxis.from, ranges.xaxis.to,
                                 ranges.yaxis.from, ranges.yaxis.to);
            } else if (direction == 1) {

            } else if (direction == 2) {

            }
            
        },
        delete: function(kvs) {
            var extent = kvs.extent;
            if (extent == 2 && selection) {
                self.deletePoints(selection.points);                
            } else {
                self.deleteAll();
            }
        },
        undo: function(kvs) {
            if (history.length > 0) {
                var state = history.pop();
                model = state.model;
                plotOptions = state.plotOptions;
                updateAll();
            }
        },
        invert: function(kvs) {
            self.invert();
        },
        color: function(kvs) {

        }
    };

    this.handle = function(kvs) {
        if (commands[kvs.command]) {
            return commands[kvs.command](kvs);
        } else {
            return false;
        }
    };

    this.addPoint = function(p) {
        saveState();
        model.addPoint(p);
        updateAll();
    };

    this.deleteAll = function() {
        saveState();
        model.deleteAll();
        updateAll();
    };

    this.deletePoint = function(p) {
        saveState();
        model.deletePoint(p);
        updateAll();
    };

    this.deletePoints = function(ps) {
        saveState();
        model.deletePoints(ps);
        updateAll();
    };

    this.zoomReset = function() {
        plotOptions.xaxis = { min: null, max: null };
        plotOptions.yaxis = { min: null, max: null };
        plot = $.plot($("#flot-root"), [model.data], plotOptions);    
    };

    this.zoomToRange = function(xmin, xmax, ymin, ymax) {
        plotOptions.xaxis = { min: xmin, max: xmax };
        plotOptions.yaxis = { min: ymin, max: ymax };
        plot = $.plot($("#flot-root"), [model.data], plotOptions);    
    };

    this.invert = function() {
        saveState();
        $.each(model.data.data, function(i, n) {
            var x = n[0]; var y = n[1];
            model.data.data[i] = [n[1], n[0]];
        });
        updateAll();
    };

    bindHandlers();
    updateAll();

};

