(function() {
  var _base;

  this.HAMLjr || (this.HAMLjr = {});

  (_base = this.HAMLjr).templates || (_base.templates = {});

  this.HAMLjr.templates["single_quotes"] = function(data) {
    return (function() {
      var __attribute, __each, __element, __on, __pop, __push, __render, __text, __with, _ref;
      _ref = HAMLjr.Runtime(this), __push = _ref.__push, __pop = _ref.__pop, __attribute = _ref.__attribute, __text = _ref.__text, __on = _ref.__on, __each = _ref.__each, __with = _ref.__with, __render = _ref.__render;
      __push(document.createDocumentFragment());
      __element = document.createElement("img");
      __push(__element);
      __attribute(__element, "src", 'http://duderman.info/#{yolocountyusa}');
      __attribute(__element, "data-rad", 'what the duder?');
      __pop();
      return __pop();
    }).call(data);
  };

}).call(this);
