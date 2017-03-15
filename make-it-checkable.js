var library = require("module-library")(require)

module.exports = library.export(
  "make-it-checkable",
  ["web-element", "function-call"],
  function(element, functionCall) {

    function makeItCheckable(el, bridge, callback, options) {

      if (!options) { options = {} }

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

      var handler = checkOffOnBridge(bridge).withArgs(functionCall.raw("event"), id, callback).evalable()

      if (box) {
        box.onclick(handler)
      } else {
        el.onclick(handler)
      }
    }

    function checkOffOnBridge(bridge) {

      var binding = bridge.remember("make-it-checkable/checkOff")

      if (binding) { return binding }

      binding = bridge.defineFunction(function checkOff(event, id, callback) {
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

      bridge.see("make-it-checkable/checkOff", binding)

      return binding
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
      ".button.toggle-button",
      {
        "background": "none",
        "border": "2px solid #9393ff",
        "color": "#7676e6",
      }
    )

    var toggleButtonHover = element.style(
      ".button.toggle-button:hover",
      {
        "background": "#eaffff",
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

    var toggleButtonCheckedHover = element.style(
      ".toggle-button.is-checked:hover",
      {
        "background": "#9fb1fb",
      }
    )

    makeItCheckable.stylesheet = element.stylesheet(checkMark, checkMarkVisible, checkBox, checkableChecked, toggleButton, toggleButtonHover, toggleButtonChecked, toggleButtonCheckedHover)

    return makeItCheckable
  }
)
