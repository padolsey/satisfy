/**
 * jQuery.fn.satisfy - made to satisfy CSS selectors
 * Copyright (c) 2009 James Padolsey
 * -------------------------------------------------------
 * Dual licensed under the MIT and GPL licenses.
 *    - http://www.opensource.org/licenses/mit-license.php
 *    - http://www.gnu.org/copyleft/gpl.html
 * -------------------------------------------------------
 * Version: 0.1
 * -------------------------------------------------------
 * "chunker" regex is Copyright (c) John Resig,
 * from the Sizzle Selector Engine.
 */

(function($){
    
    var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,
        exprMatches = jQuery.expr.match,
        nRegex = /\:(\d+)$/,
        portionDealer = {
            ID: function(match, node) {
                node.id = match[1];
            },
            CLASS: function(match, node) {
                node.className += ' ' + match[1];
            },
            NAME: function(match, node) {
                node.name = match[1];
            },
            ATTR: function(match, node) {
                $(node).attr( match[1], match[4] );
            }
        };
	
    exprMatches.ATTR = RegExp( exprMatches.ATTR.source, 'g' );
    
    function build(part, n) {
        
        var tag = exprMatches.TAG.exec(part),
            node = document.createElement( tag && tag[1] !== '*' ? tag[1] : 'div' ),
            match, i, temp = $('<div/>');
        
        for (i in portionDealer) {
            
	    if (exprMatches[i].global) {
		while ( (match = exprMatches[i].exec(part)) !== null ) {
		    portionDealer[i]( match, node );
		}
		continue;
	    }
	    
            match = exprMatches[i].exec(part);
            
            if (match) {
                portionDealer[i]( match, node );
            }
            
        }
        
        while (n--) {
            temp.append( node.cloneNode(true) );
        }
        
        return temp.children().clone();
        
    }
    
    $.fn.satisfy = function() {
        
        var parts = [],
            selector = this.selector,
            wrap = $('<div/>'),
            parent = wrap,
            cloneN = 1;
        
	while ( (m = chunker.exec(selector)) !== null ) {
            
            if (/^[>~+]$/.test(m[1])) {
                continue;
            }
            
            cloneN = nRegex.test(m[1]) ? +m[1].match(nRegex)[1] : 1;
            parent = $(parent).append(build(m[1], cloneN)).children();
                
	}
        
        return $(wrap).children();
        
    };
    
})(jQuery);