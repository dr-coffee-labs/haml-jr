(function() {
  var Gistquire, HAMLjr, auth, compile, load, parser, postData, rerender, save, styl, update, util, _ref;

  _ref = HAMLjr = require('./haml-jr'), parser = _ref.parser, compile = _ref.compile, util = _ref.util;

  Gistquire = require('./gistquire');

  styl = require('styl');

  window.HAMLjr = HAMLjr;

  window.Observable = require('./observable');

  window.parser = parser;

  rerender = (function() {
    var ast, coffee, data, error, fragment, haml, selector, style, template, _ref1;
    if (location.search.match("embed")) {
      selector = "body";
    } else {
      selector = "#preview";
    }
    if (!$("#template").length) {
      return;
    }
    _ref1 = editors.map(function(editor) {
      return editor.getValue();
    }), coffee = _ref1[0], haml = _ref1[1], style = _ref1[2];
    try {
      data = Function("return " + CoffeeScript.compile("do ->\n" + util.indent(coffee), {
        bare: true
      }))();
      $("#errors p").eq(0).empty();
    } catch (_error) {
      error = _error;
      $("#errors p").eq(0).text(error);
    }
    try {
      ast = parser.parse(haml + "\n");
      template = Function("return " + compile(ast, {
        compiler: CoffeeScript
      }))();
      $("#errors p").eq(1).empty();
      $("#debug code").eq(1).text(template);
    } catch (_error) {
      error = _error;
      $("#errors p").eq(1).text(error);
    }
    try {
      style = styl(style, {
        whitespace: true
      }).toString();
      $("#errors p").eq(2).empty();
    } catch (_error) {
      error = _error;
      $("#errors p").eq(2).text(error);
    }
    if ((template != null) && (data != null)) {
      try {
        fragment = template(data);
        return $(selector).empty().append(fragment).append("<style>" + style + "</style>");
      } catch (_error) {
        error = _error;
        return $("#errors p").eq(1).text(error);
      }
    }
  }).debounce(100);

  postData = function() {
    var data, style, template, _ref1;
    _ref1 = editors.map(function(editor) {
      return editor.getValue();
    }), data = _ref1[0], template = _ref1[1], style = _ref1[2];
    return JSON.stringify({
      "public": true,
      files: {
        data: {
          content: data
        },
        template: {
          content: template
        },
        style: {
          content: style
        }
      }
    });
  };

  save = function() {
    return Gistquire.create(postData(), function(data) {
      return location.hash = data.id;
    });
  };

  auth = function() {
    var url;
    url = 'https://github.com/login/oauth/authorize?client_id=bc46af967c926ba4ff87&scope=gist,user:email';
    return window.location = url;
  };

  load = function(id) {
    return Gistquire.get(id, function(data) {
      ["data", "template", "style"].each(function(file, i) {
        var content, editor, _ref1;
        content = ((_ref1 = data.files[file]) != null ? _ref1.content : void 0) || "";
        editor = editors[i];
        editor.setValue(content);
        editor.moveCursorTo(0, 0);
        return editor.session.selection.clearSelection();
      });
      return rerender();
    });
  };

  update = function() {
    var id, _ref1;
    if (id = (_ref1 = location.hash) != null ? _ref1.substring(1) : void 0) {
      return Gistquire.update(id, postData(), function(data) {});
    }
  };

  $(function() {
    var code, id, _ref1, _ref2;
    window.editors = [["data", "coffee"], ["template", "haml"], ["style", "stylus"]].map(function(_arg) {
      var editor, id, mode;
      id = _arg[0], mode = _arg[1];
      editor = ace.edit(id);
      editor.setTheme("ace/theme/tomorrow");
      editor.getSession().setMode("ace/mode/" + mode);
      editor.getSession().on('change', rerender);
      editor.getSession().setUseSoftTabs(true);
      editor.getSession().setTabSize(2);
      return editor;
    });
    if (code = (_ref1 = window.location.href.match(/\?code=(.*)/)) != null ? _ref1[1] : void 0) {
      $.getJSON('https://hamljr-auth.herokuapp.com/authenticate/#{code}', function(data) {
        var token;
        if (token = data.token) {
          Gistquire.authToken = token;
          return localStorage.authToken = token;
        }
      });
    }
    if (id = (_ref2 = location.hash) != null ? _ref2.substring(1) : void 0) {
      load(id);
    } else {
      rerender();
    }
    if (localStorage.authToken) {
      Gistquire.accessToken = localStorage.authToken;
    }
    $("#actions .save").on("click", save);
    $("#actions .auth").on("click", auth);
    return $("#actions .update").on("click", update);
  });

}).call(this);
