/**
 * Satisfy - made to satisfy CSS selectors
 * Copyright (c) 2009 James Padolsey
 * -------------------------------------------------------
 * Dual licensed under the MIT and GPL licenses.
 *    - http://www.opensource.org/licenses/mit-license.php
 *    - http://www.gnu.org/copyleft/gpl.html
 * -------------------------------------------------------
 * Version: 0.2
 * -------------------------------------------------------
 * (most) Regular Expressions are Copyright (c) John Resig,
 * from the Sizzle Selector Engine.
 */

var satisfy = (function(){
    
    var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,
        exprMatches = {
            ID: /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
            CLASS: /\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
            NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,
            ATTR: /\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/g,
            TAG: /^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/
        },
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
                if ( 'innerHTML' === match[1] ) {
                    node[match[1]] = match[4];
                } else {
                    node.setAttribute( match[1], match[4] );
                }
            }
        };
    
    function create(part, n) {
        
        var tag = exprMatches.TAG.exec(part),
            node = document.createElement( tag && tag[1] !== '*' ? tag[1] : 'div' ),
            match, i, temp = document.createElement('div');
        
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
            temp.appendChild( node.cloneNode(true) );
        }
        
        return clone(temp.childNodes); // clone?
        
    }
    
    function clone(nodes) {
        
        var ret = [],
            len = nodes.length,
            i = 0;
            
        for ( ; i < len; ++i ) {
            ret[i] = nodes[i].cloneNode(true);
        }
        
        return ret;
    }
    
    function multiAppend(parents, children) {
        
        var pLen = parents.length,
            cLen = children.length,
            pIndex = 0,
            cIndex = 0,
            frag = document.createDocumentFragment(),
            clonedChildCollection = [],
            ccc = 0,
            parent;
        
        for ( ; pIndex < pLen; ++pIndex ) {
            
            parent = parents[pIndex];
            
            if (parent.nodeName.toLowerCase() === 'table') {
                /* IE requires table to have tbody */
                parent.appendChild(parent = document.createElement('tbody'));
            }
            
            for ( cIndex = 0; cIndex < cLen; ++cIndex ) {
                parent.appendChild(
                    clonedChildCollection[ccc++] = children[cIndex].cloneNode(true)
                );
            }
            
        }
        
        return clonedChildCollection;
        
    }
    
    function satisfy(selector) {
        
        var selectorParts = [],
            elWrapper = document.createElement('div'),
            curParents = [elWrapper],
            curChilren = [],
            curSelector,
            nClones = 1;
        
	while ( (m = chunker.exec(selector)) !== null ) {
            
            curSelector = m[1];
            
            if (/^[>~+]$/.test(curSelector)) {
                continue;
            }
	    
            nClones = /\:(\d+)$/.test(curSelector) ? +curSelector.match(/\:(\d+)$/)[1] : nClones;
            
            curParents = multiAppend(
                curParents,
                curChildren = create(curSelector, nClones)
            );
            
	}
        
        return elWrapper.childNodes;
        
    };
    
    if (window.jQuery !== undefined && jQuery.fn) {
        jQuery.fn.satisfy = function() {
            return $(satisfy(this.selector));
        };
    }
    
    return satisfy;
    
})();