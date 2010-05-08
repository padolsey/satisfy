var tags = ["a", "abbr", "acronym", "address", "applet", "area", "b", "base", "basefont", "bdo", "big", "blockquote", "body", "br", "button", "caption", "center", "cite", "code", "col", "colgroup", "dd", "del", "dfn", "dir", "div", "dl", "dt", "em", "fieldset", "font", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "hr", "html", "i", "iframe", "img", "input", "ins", "isindex", "kbd", "label", "legend", "li", "link", "map", "menu", "meta", "noframes", "noscript", "object", "ol", "optgroup", "option", "p", "param", "pre", "q", "s", "samp", "script", "select", "small", "span", "strike", "strong", "style", "sub", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "title", "tr", "tt", "u", "ul", "var"];
var len = tags.length;

/** TESTS **/

test('Single elements', function(){
    
    expect(len);
    
    var e;
    
    for (var i = 0; i < len; ++i) {
        e = satisfy(tags[i]);
        ok(
            e && e.length === 1 &&
            e[0] && e[0].nodeType === 1 &&
            e[0].nodeName.toLowerCase() === tags[i],
            '<' + tags[i] + '> element created'
        );
    }
    
});

test('Common selectors', function(){
    
    var selectors = {
        'div ul li': '<div><ul><li></li></ul></div>',
        'div ul:2 li:3': '<div><ul><li></li><li></li><li></li></ul><ul><li></li><li></li><li></li></ul></div>',
        'a + span': '<a></a><span></span>',
        'div:2 ul ~ ul li:2': '<div><ul></ul><ul><li></li><li></li></ul></div><div><ul></ul><ul><li></li><li></li></ul></div>',
        'div.list ol li span a[href=http://x.com/f]': '<div class="list"><ol><li><span><a href="http://x.com/f"></a></span></li></ol></div>',
        'script': [document.createElement('script')],
        'strong b i q a': '<strong><b><i><q><a></a></q></i></b></strong>',
        'div a[innerHTML=foo][href="http://foo.foo/foo"]': '<div><a href="http://foo.foo/foo">foo</a></div>',
        'a.a.b.c.d.e': '<a class="a b c d e"></a>',
        'label[for=b]': '<label for="b"></label>',
        'label[for=foo][html=foo] + input[name=foo]#foo': '<label for="foo">foo</label><input name="foo" id="foo"/>',
        'table tr td[html=foo]': '<table><tr><td>foo</td></tr></table>',
        'select option:2': '<select><option></option><option></option></select>',
        'div#a.b': '<div id="a" class="b"></div>',
        'a[title="a b c"]': '<a title="a b c"></a>',
        'div#container ul#nav li:3 > span[html=test]': '<div id="container"><ul id="nav"><li><span>test</span></li><li><span>test</span></li><li><span>test</span></li></ul></div>',
        'div + div ~ div + div': '<div></div><div></div><div></div><div></div>'
    };
    
    for (var i in selectors) {
        ok(
            compareNodeLists(
                typeof selectors[i] === 'string' ? create(selectors[i]) : selectors[i],
                satisfy(i)
            ),
            'selector: ' + i
        );
    }
    
});

/** Functions **/

function create(html) {
    var d = document.createElement('div'),
        f = document.createDocumentFragment();
    d.innerHTML = html;
    while (d.firstChild) f.appendChild(d.firstChild);
    return f.childNodes;
}

function compareNodes(node1, node2) {
    
    if (!node1 || !node2) {
        return false;
    }
    
    for (var i in node1) {
        try {
            // Do a fuzzy check to make sure properties are similar
            if (!/outerHTML|innerHTML|parentNode/.test(i) && String(node1[i]) !== String(node2[i])) {
                console.log(i, node1[i], node2[i]);
                return false;
            }
        } catch(e) {}
    }
    
    var aNode = node1.firstChild,
        bNode = node2.firstChild;
        
    if (aNode && bNode) {
        do {
            
            if (!compareNodes(aNode, bNode)) {
                console.log(aNode, bNode, 'aaa');
                return false;
            }
            
            aNode = aNode.nextSibling;
            bNode = bNode.nextSibling;
            
            if (!!aNode === !!bNode) {
                // They both either exist or do not exist
                if (aNode) continue;
                else break;
            } else {
                return false;
            }
            
        } while(true);
    } else if (!!aNode !== !!bNode) {
        
        return false;
    }
    
    return true;
            
}

function compareNodeLists(dom1, dom2) {
    
    if (!dom1 || !dom2 || dom1.length !== dom2.length) { return false; }
    
    for (var i = 0, l = dom1.length; i < l; ++i) {
        if (!compareNodes(dom1[i], dom2[i])) {
            return false;
        }
    }
    
    return true;
    
}