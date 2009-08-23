Satisfy that selector!
--

***Satisfy*** is a development-only <del>jQuery plugin</del>**\*** that you can use to quickly generate HTML for testing/debugging. The idea is that you provide a CSS selector and then the plugin will "satisfy" it by generating an HTML structure in accordance with that selector.

**\*** - Version 0.2 has no dependencies. If jQuery is laoded then it will be available as a jQuery plugin (like before) otherwise it will work under the `satisfy()` name - this function returns an array of DOM elements.

For example:

    jQuery('div a').satisfy(); // jQuery
    satisfy('div a'); // sans-jQuery

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
