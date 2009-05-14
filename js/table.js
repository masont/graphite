$(document).ready(function() {

    $("#add-row-form").submit(function() {
        var rowForm = $("#add-row-form");
        var x = $("#add-x").val();
        var y = $("#add-y").val();

        graphiteController.addPoint([x, y]);

        $("#add-x").val("");
        $("#add-y").val("");
        return false;
    });


});

