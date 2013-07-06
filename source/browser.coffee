{parser} = require('./parser')
{lexer} = require('../build/lexer')
{renderJST} = require('./renderer')

require('./runtime')

parser.lexer = lexer

window.parser = parser
window.render = renderJST

# TODO: Load tempest.js for observable
window.Observable = (value) ->
  listeners = []

  notify = (newValue) ->
    listeners.each (listener) ->
      listener(newValue)

  self = (newValue) ->
    if arguments.length > 0
      if value != newValue
        value = newValue

        notify(newValue)

    return value

  # TODO: If value is array hook into array modification events
  # to keep things up to date

  # TODO: If value is a function compute dependencies and listen
  # to observables that it depends on

  Object.extend self,
    observe: (listener) ->
      listeners.push listener
    each: (args...) ->
      # Don't add null or undefined values to iteration
      if value?
        [value].each(args...)

  return self

# Promote or "lift" an entity into a dummy object that
# matches the observable interface
Observable.lift = (object) ->
  if typeof object.observe is "function"
    object
  else
    value = object

    # Return a dummy observable
    dummy = (newValue) ->
      if arguments.length > 0
        value = newValue
      else
        value

    dummy.each = (args...) ->
      if value?
        [value].forEach(args...)

    return dummy

$ ->
  ast = parser.parse($("#template").val())

  console.log ast

  template = Function("return" + render(ast, compiler: CoffeeScript))()

  console.log template

  data = Function("return " + CoffeeScript.compile($("#data").val(), bare: true))()

  console.log data

  window.fragment = template(data)

  $('#demo').append(fragment)

