/**
 * Satisfy - made to satisfy CSS selectors
 * Copyright (c) 2009 James Padolsey
 * -------------------------------------------------------
 * Dual licensed under the MIT and GPL licenses.
 *    - http://www.opensource.org/licenses/mit-license.php
 *    - http://www.gnu.org/copyleft/gpl.html
 * -------------------------------------------------------
 * Version: 0.3
 * -------------------------------------------------------
 * (most) Regular Expressions are Copyright (c) John Resig,
 * from the Sizzle Selector Engine.
 */

var satisfy = (function(){
    
    var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,
        exprRegex = {
            ID: /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
            CLASS: /\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
            NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,
            ATTR: /\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/g,
            TAG: /^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,
			CLONE: /\:(\d+)(?=$|[:[])/,
			COMBINATOR: /^[>~+]$/
        },
        exprCallback = {
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
                if ( /^(?:inner)?html$/i.test(match[1]) ) {
                    node.innerHTML = match[4];
                } else {
                    node.setAttribute( match[1], match[4] );
                }
            }
        };
    
    function create(part, n) {
        
        var tag = exprRegex.TAG.exec(part),
            node = document.createElement( tag && tag[1] !== '*' ? tag[1] : 'div' ),
			fragment = document.createDocumentFragment(),
            match, expr, regex, callback;
        
        for (expr in exprCallback) {
			
			regex = exprRegex[expr];
			callback = exprCallback[expr];
	    
			if (exprCallback.hasOwnProperty(expr)) {
				
				if (regex.global) {
					
					while ( (match = regex.exec(part)) !== null ) {
						callback( match, node );
					}
					
					continue;
					
				}
				
				if (match = regex.exec(part)) {
					callback( match, node );
				}
			
			}
            
        }
        
        while (n--) {
            fragment.appendChild( node.cloneNode(true) );
        }
        
        return fragment; 
        
    }
    
    function multiAppend(parents, children) {
		
		parents = parents.childNodes;
        
        var pLen = parents.length,
            i = -1,
            parent;
        
        while ( ++i < pLen ) {
            
            parent = parents[i];
            
            if (parent.nodeName.toLowerCase() === 'table') {
                /* IE requires table to have tbody */
                parent.appendChild(parent = document.createElement('tbody'));
            }
            
			parent.appendChild(children.cloneNode(true));
            
        }
        
    }
    
    function satisfy(selector) {
        
        var selectorParts = [],
            fragment = document.createDocumentFragment(),
			children,
			prevChildren,
            curSelector,
            nClones = 1,
			isSibling = false;
        
		while ( (m = chunker.exec(selector)) !== null ) {
			selectorParts.push(m[1]);
		}
		
		// We're going in reverse
		while (curSelector = selectorParts.pop()) {
			
			if (exprRegex.COMBINATOR.test(curSelector)) {
				isSibling = curSelector === '~' || curSelector === '+';
				continue;
			}
			
			// Number of clones must be an int >= 1
			nClones = ~~(curSelector.match(exprRegex.CLONE)||[,1])[1];
			
			prevChildren = children;
			children = create(curSelector, nClones);
			
			if (prevChildren) {
				
				if (isSibling) {
					children.appendChild(prevChildren);
					isSibling = false;
				} else {
					multiAppend(children, prevChildren);
				}
				
			}
			
		}
		
		fragment.appendChild(children);
        
        return fragment.childNodes;
        
    }
    
    if (window.jQuery !== undefined && jQuery.fn) {
		
        jQuery.satisfy = function(selector) {
            return jQuery(satisfy(selector));
        };
		
    }
    
    return satisfy;
    
})();