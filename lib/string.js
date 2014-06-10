var bindable = require("bindable");

module.exports = function (elements) {
  return elements.__noselector || (elements.__noselector = selector(elements));
}

/**
 */

function selector (element) {
  return triggers(common({ target: element }));
}

/**
 */

function common ($elements) {
  $elements.attr = $elements.prop = function (name) {
    return $elements.target.getAttribute(name);
  }

  $elements.is = function (property) {

  }

  return $elements;
}


/**
 */

function triggers ($elements) {
  var events = new bindable.Object();


  $elements.bind = function (eventNames, listener) {
    eventNames.split(" ").forEach(function (eventName) {
      events.on(eventName, listener);
    });
    return $element;
  };

  $elements.unbind = function (eventNames, listener) {
    eventNames.split(" ").forEach(function (eventName) {
      events.off(eventName, listener);
    });
    return $element;
  };

  $elements.trigger = function (event) {
    if (typeof event === "string") {
      event = new Event(event);
    }
    events.emit(event.name, event);
  }

  return $elements;
}



function Event (name) {
  this.name = name;
}

function getFirstOccurrence ($elements, filter) {
  var v;
  for (var i = 0, n = $elements.length; i < n; i++) {
    if (v = filter($elements[i])) return v;
  }
}

function each ($elements, iterator) {
  
}
