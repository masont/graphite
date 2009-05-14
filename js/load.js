$(document).ready(function() {
    
    graphiteController = new Graphite.Controller();
        
    var onReady = function() {

    };

    var onRecognitionResult = function(result) {
        $("#recognition-result").html("<p>" + result.hyps[0].text + "</p>");
        var kvs = result.hyps[0].aggregate.kvs;
        graphiteController.handle(kvs);        
    };

    var loadWami = function(grammar) {
        var wamiResponseHandlers = {
            onReady: onReady,
            onRecognitionResult: onRecognitionResult,
            onTimeout: null,
            onError: null
        };
        var audioOptions = {
            useSpeechDetector: false
        };
        var configOptions = {
            sendIncrementalResults: false,
            sendAggregates: true,
            splitTag: "command"
        };
        var grammarOptions = {
            language: "en-us",
            grammar: grammar,
            type: "jsgf"
        };
        var wamiRoot = document.getElementById("wami-root");
        var wamiApp = new WamiApp(
            wamiRoot, 
            wamiResponseHandlers,
            "json",
            audioOptions,
            configOptions,
            grammarOptions
        );
    }
    
    $.get("jsgf.txt", {}, loadWami, "text");

});
