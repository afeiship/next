define(["model/data","view/view0"],function(data, view) {
    var init = function() {
        var body = document.getElementsByTagName("body")[0];
        var aBtn = document.getElementsByTagName("button");
        for(var i=0; i< aBtn.length; i++) {
            aBtn[i].onclick = (function(i) {
                return function() {
                    body.appendChild( view.getView(data[i]) );
                };
            })(i);
        };
    };
    return {
        init : init
    };
});