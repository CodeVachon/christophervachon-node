//
//  Gist Extension (WIP)
//  ^^gist:[id]   ->  <script src="https://gist.github.com/[id].js"></script>
//

(function(){
    var gist = function(converter) {
        return [
            {
                type    : 'lang',
                regex   : '\\B(\\\\)?\\^{2}gist\\:([a-zA-Z0-9\\/]+)\\b',
                replace : function (a,b,c) {
                    if (typeof module !== 'undefined') {
                        return b === "\\" ? a : '<scri'+'pt src="https://gist.github.com/'+c+'.js"></scr'+'ipt>';
                    } else {
                        if (b === "\\") {
                            return a;
                        } else {
                            var gistId = c;
                            var _iframeId = gistId.replace(/\W/g,"");
                            var _script = "";
                            _script += "var iframe = document.getElementById('"+_iframeId+"');\n";
                            _script += "var iframeHtml = '<html><head><base target=\"_parent\"><style>body {margin: 0; padding: 0;}</style></head><body onload=\"parent.document.getElementById(\\\'" + _iframeId + "\\\').style.height=document.body.scrollHeight + \\'px\\'\"><scr' + 'ipt type=\"text/javascript\" src=\"https://gist.github.com/" + gistId + ".js\"></sc'+'ript></body></html>';\n";
                            _script += "var doc = iframe.document;";
                            _script += "if (iframe.contentDocument) doc = iframe.contentDocument;\n";
                            _script += "else if (iframe.contentWindow) doc = iframe.contentWindow.document;\n";
                            _script += "doc.open();doc.writeln(iframeHtml);doc.close();";
                            return "<script>"+_script+"</script><iframe id='"+_iframeId+"' frameborder='0' width='100%'></iframe>";
                        }
                    }
                }
            }
        ];
    };

    // Client-side export
    if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) {
        window.Showdown.extensions.gist = gist;
    }
    // Server-side export
    if (typeof module !== 'undefined') {
        module.exports = gist;
    }
}());
