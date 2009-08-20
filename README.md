jQuery.fn.satisfy
--

***Satisfy*** is a development-only jQuery plugin that you can use to quickly generate HTML for testing/debugging. The idea is that you provide a CSS selector and then the plugin will "satisfy" it by generating an HTML structure in accordance with that selector.

For example:

    jQuery('div a').satisfy();

This would return the following HTML structure:

    <div>
        <a></a>
    </div>

Then, as usual, you can append it to the body (or any element) like this:

    jQuery('div a').satisfy().appendTo('body');
    
It only works with "normal" selectors. **It ignores combinators (+|~|>) and pseudo-classes (:pseudo)**.

It does work with type-selectors though! - 

    jQuery('ul li a[href="http://google.com"]').satisfy();

It also supports one custom pseudo-expression - a colon and number following any portion of a selector - this number signifies how many elements of this type you need:

    jQuery('ul li:5 span[innerHTML="link"]').satisfy();
    
This would produce the following HTML:

    <ul>
        <li><span>link</span></li>
        <li><span>link</span></li>
        <li><span>link</span></li>
        <li><span>link</span></li>
        <li><span>link</span></li>
    </ul>
