define(function() {
    return {
        getView : function(data) {
            var frag = document.createDocumentFragment();
                frag.appendChild( document.createTextNode( data.name + " ") );
            return frag;
        }
    }
});