/*
* DOM selector
*
* Usage:
* $('div');
* $('#name');
* $('.name');
*
*
* Copyright (C) 2011 Jed Schmidt <http://jed.is> - WTFPL
* More: https://gist.github.com/991057
*
*/

var $ = function(
  a, // take a simple selector like "name", "#name", or ".name", and
  b // an optional context, and
){
  a = a.match(/^(\W)?(.*)/); // split the selector into name and symbol.
  return( // return an element or list, from within the scope of
    b // the passed context
    || document // or document,
  )[
    "getElement" + ( // obtained by the appropriate method calculated by
      a[1]
        ? a[1] == "#"
          ? "ById" // the node by ID,
          : "sByClassName" // the nodes by class name, or
        : "sByTagName" // the nodes by tag name,
    )
  ](
    a[2] // called with the name.
  )
}