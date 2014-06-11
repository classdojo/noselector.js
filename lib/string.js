var bindable = require("bindable"),
_            = require("lodash"),
toarray      = require("toarray");

module.exports = selector;

function selector (els, parent) {

  if (!els) els = [];
  if (els._selector) return els._selector;


  var $elements = els._selector = toarray(els).concat();


  _.extend($elements, {

    /**
     */

    parent  : parent,

    /**
     */

    each : function (iterator) {
      _.each(this, function (v, k) {
        iterator.call(v, k, v);
      });
      return this
    },

    /**
     */

    find: function (query) {
      var tester = elementTester(query),
      found = [];
      this.traverse(function (element) {
        if (tester(element)) {
          found.push(element);
        }
      });

      return selector(found);
    },

    /**
     */

    eq: function (index) {
      return selector(this[index]);
    },

    /**
     */

    filter: function (filter) {
      if (!filter) return this;
      if (typeof filter === "string") filter = elementTester(filter);
      return selector(_.filter(this, filter), this.parent);
    },

    /**
     */

    first: function () {
      return selector(this[0]);
    },

    /**
     */

    andSelf: function () {
      if (!this.parent) return this;
      return selector(_.uniq(this.concat(this.parent)), this);
    },

    /**
     */

    attr: function (name, value) {
      if (!this.length) return;
      if (arguments.length === 1) {
        return (this.length && this[0].getAttribute ? this[0].getAttribute(name) : void 0) || "";
      } else {
        this.each(function (index) {
          this.setAttribute(name, value);
        });
      }
    },

    /**
     */

    html: function () {
      return this.length ? this[0].toString() : void 0;
    },

    /**
     */

    text: function () {
      var buffer = [];
      this.traverse(function () {
        if (this.nodeType === 3 && this.nodeValue && this.nodeValue.length) {
          buffer.push(this.nodeValue);
        }
      });
      return buffer.join(" ");
    },

    /**
     */

    traverse: function (iterator) {
      this.each(function () {
        iterator.call(this, this);
        selector(this.childNodes).traverse(iterator);
      });
    },

    /**
     */

    prop: function (name) {
      return this.attr.apply(this, arguments);
    },

    /**
     */

    bind: function (eventNames, listener) {
      var self = this;
      eventNames.split(" ").forEach(function (eventName) {
        self.each(function () {
          this._emitter.on(eventName, listener);
        })
      });
      return this;
    },

    /**
     */

    unbind: function (eventNames, listener) {
      var self = this;
      eventNames.split(" ").forEach(function (eventName) {
        self.each(function () {
          this._emitter.off(eventName, listener);
        })
      });
      return this;
    },

    /**
     */

    trigger: function (event) {
      if (typeof event === "string") {
        event = new Event(event);
      }
      this.each(function () {
        this._emitter.emit(event.name, event);
      });
    }
  });


  $elements.each(function () {
    this._emitter = new bindable.Object();
  })

  return $elements;
}

function Event (name, options) {
  this.name = name;
}


function elementTester (query) {
  if (query.substr(0, 1) === "#") return idTester(query);
  if (query.substr(0, 1) === ".") return classTester(query);
  return nameTester(query);
}

function idTester (query) {
  return function (element) {
    return selector(element).attr("id") === query.substr(1);
  }
}

function classTester (query) {
  return function (element) {
    return ~selector(element).attr("class").indexOf(query.substr(1));
  }
}

function nameTester (query) {
  return function (element) {
    return element.nodeName == String(query).toUpperCase();
  }
}
