var library = require("module-library")(require)

module.exports = library.export(
  "make-it-checkable",
  ["web-element", "function-call"],
  function(element, functionCall) {

    function makeItCheckable(el, bridge, handler, options) {

      var isChecked = options.checked || false

      if (options.kind == "toggle-button") {
        el.addSelector(".button.toggle-button")
      } else {
        var box = checkBox()
        el.children.unshift(box)
      }

      var id = el.assignId()

      if (isChecked) {
        el.classes.push("is-checked")
      }

      el.classes.push("checkable-"+id)

      var handler = checkOffOnBridge(bridge).withArgs(functionCall.raw("event"), id, handler).evalable()

      if (box) {
        box.onclick(handler)
      } else {
        el.onclick(handler)
      }
    }

    function checkOffOnBridge(bridge) {
      var checkOff = bridge.__makeItCheckableCheckOffBinding

      if (checkOff) { return checkOff }

      checkOff = bridge.__makeItCheckableCheckOffBinding = bridge.defineFunction(function checkOff(event, id, callback) {
        event.preventDefault()
        var el = document.querySelector(".checkable-"+id)

        var isCompleted = el.classList.contains("is-checked")

        if (isCompleted) {
          el.classList.remove("is-checked")
        } else {
          el.classList.add("is-checked")
        }

        isCompleted = !isCompleted

        callback(isCompleted, id)
      })

      return checkOff
    }      

    var checkMark = element.template(
      ".check-mark",
      element.style({
        "visibility": "hidden"
      }),
      "✗"
    )

    var checkMarkVisible = element.style(".is-checked .check-mark", {
      "visibility": "visible",
      "color": "#888",
    })

    var checkBox = element.template(
      ".check-box",
      element.style({
        "border": "2px solid #888",
        "background": "transparent",
        "width": "1.15em",
        "height": "1.15em",
        "margin-right": "0.25em",
        "padding": "1px 3px 0px 3px",
        "font-size": "1.15em",
        "line-height": "1em",
        "display": "inline-block",
        "cursor": "pointer",
        "box-sizing": "border-box",
      }),
      checkMark()
    )

    var checkableChecked = element.template(
      ".is-checked",
      element.style({
        "text-decoration": "line-through"
      })
    )

    var toggleButton = element.style(
      ".toggle-button",
      {
        "background": "none",
        "border": "2px solid #9393ff",
        "color": "#7676e6",
      }
    )

    var toggleButtonHover = element.style(
      ".toggle-button:hover",
      {
        "background": "white",
      }
    )

    var toggleButtonChecked = element.style(
      ".toggle-button.is-checked",
      {
        "text-decoration": "none",
        "background": "#9393ff",
        "color": "white",
      }
    )

    makeItCheckable.stylesheet = element.stylesheet(checkMark, checkMarkVisible, checkBox, checkableChecked, toggleButton, toggleButtonHover, toggleButtonChecked)

    return makeItCheckable
  }
)
