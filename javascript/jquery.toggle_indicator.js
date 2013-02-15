jQuery.fn.toggleIndicator = function(options){
  options = options || {};
  options.background = options.background || {};
  options.label      = options.label      || {};
  options.inputValue = options.inputValue || {};

  var config = {
    background: {
      on:     ( options.background.on     || "-webkit-gradient(linear, left top, left bottom, from(#9fc42d), to(#c6e85b))" ),
      off:    ( options.background.off    || "-webkit-gradient(linear, left top, left bottom, from(#cccccc), to(#eeeeee))" ),
      slider: ( options.background.slider || "-webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#f1f1f1))" )
    },
    label: {
      on:  ( options.label.on  || "\u2714on"  ),
      off: ( options.label.off || "off" )
    },
    inputValue: {
      on:  ( options.inputValue.on  || 1 ),
      off: ( options.inputValue.off || "" )
    },
    height:       ( options.height || undefined ),
    width:        ( options.width  || undefined ),
    borderRadius: ( options.borderRadius || undefined ),
    border:       ( options.border || 1 ),
    padding:      undefined,
    logLabel: "ToggleIndicator",
    wrapper: options.wrapper,
    type:    ( options.area || "line" )
  }

  if ($(this).length < 1) {
    console.log(config.logLabel + ": selector invalid?")
    return
  }

  var style = {
    target: undefined,
    init: function(target){
      style.target = target;
      style.height();
    },
    border: function(){
      return config.border;
    },
    height: function(){
      if (typeof config.height === "undefined") {
        /(\d+)/.test( $(style.target).css("line-height") );
        config.height = config.height || RegExp.$1;
      }
      return config.height;
    },
    width: function(){
      config.width = config.width || ($(style.target).width() * 0.6);
      return config.width;
    },
    padding: function(){
      if (typeof config.padding  === "undefined") {
        /(\d+)/.test( $(style.target).css("padding") );
        config.padding = RegExp.$1;
        config.padding = config.padding - config.border;
      }
      return config.padding;
    },
    borderRadius: function(){
      config.borderRadius = config.borderRadius || config.height / 2;
      return config.borderRadius;
    }
  }

  var element = {
    base: function(side){
      side = (side === "on" ? "on" : "off");

      return $("<div>")
          .addClass("toggle-base")
          .css({
            height:                  style.height(),
            width:                   style.width(),
            "-webkit-border-radius": (style.borderRadius() + (style.border() * 2)),
            borderWidth: style.border(),
            borderStyle: "solid",
            borderColor: "#999999",
            display:     "table-cell",
            verticalAlign: "middle",
            paddingTop:    0,
            paddingBottom: 0,
            fontSize:      "0.7em"
          })
          .css( element.toggledBaseCss(side) )
          .data({on: (side === "on") });
    },
    toggledBaseCss: function(side){
      side = (side === "on" ? "on" : "off");

      return {
        background:   (side === "on" ? config.background.on : config.background.off),
        textAlign:    (side === "on" ? "left" : "right"),
        paddingLeft:  (side === "on" ? style.borderRadius() : 0),
        paddingRight: (side === "on" ? 0 : style.borderRadius())
      }
    },
    slider: function(side){
      side = (side === "on" ? "on" : "off");

      return $("<div>")
          .addClass("slider-" + (side === "on" ? "right" : "left"))
          .css({
            height: (style.height() - (style.border() * 2)),
            width:  (style.height() - (style.border() * 2)),
            background: config.background.slider,
            "-webkit-border-radius": style.borderRadius,
            borderWidth: style.border,
            borderStyle: "solid",
            borderColor: "#999999",
            float:       (side === "on" ? "right" : "left"),
            clear:       (side === "on" ? "right" : "left")
          })
          .css( element.toggledSliderCss(side === "on" ? "off" : "on") );
    },
    toggledSliderCss: function(side){
      side = (side === "on" ? "on" : "off");

      return {
        display:    (side === "on" ? "block" : "none"),
        background: config.background.slider,
        padding:    0
      }
    },
    label: function(){
      return $("<span>").addClass("label").text(config.label.off);
    },
    wrapper: function(target, _base){
      var wrapper = target;

      switch( _base || config.wrapper ){
        case "dt":
          wrapper = wrapper.next().andSelf();
          break;
        case "dd":
          wrapper = wrapper.prev().andSelf();
          break;
        case "td":
        case "th":
          wrapper = wrapper.closest("tr").find("td");
          break;
      }

      return wrapper;
    }
  }

  var _this = this;

  $(_this)
    .prop({type: "hidden"})
    .closest( config.wrapper )
    .each(function(){
      style.init(this);

      $(this).css({ padding: style.padding() })

      element.base("off")
        .append( element.slider("off") )
        .append( element.label() )
        .append( element.slider("on") )
        .appendTo( $(this) );

      wrapper = $(this).closest( config.wrapper );

      if (config.type == "line") {
        wrapper = element.wrapper(wrapper);
      }

      wrapper.on("click", function(_event){
        _wrapper = $(this);
        if (config.type === "line") {
          if (_wrapper.eq(0).length == 1){
            if (_wrapper.get(0).localName !== config.wrapper){
              _wrapper = element.wrapper( _wrapper, _wrapper.get(0).localName );
            }
          }
        }

        var _base = _wrapper.find("div.toggle-base");
        var _input = _base.siblings("input[type=hidden].lockup_task");

        if (_base.data().on) {
          _base
            .data({on: false})
            .css( element.toggledBaseCss("off") )
            .find(".label")
            .text(config.label.off)
            .end()
            .find(".slider-left")
            .css( element.toggledSliderCss("on") )
            .end()
            .find(".slider-right")
            .css( element.toggledSliderCss("off") )

          _input.val(config.inputValue.off);
        }
        else {
          _base
            .data({on: true})
            .css( element.toggledBaseCss("on") )
            .find(".label")
            .text(config.label.on)
            .end()
            .find(".slider-left")
            .css( element.toggledSliderCss("off") )
            .end()
            .find(".slider-right")
            .css( element.toggledSliderCss("on") )
          _input.val(config.inputValue.on);
        }
      })
    });
}
