var PopUpElement = function(elm, options){

  // Default options:
  default_options = {
    allowKeyboardControl: true,
    closeKey: 27,
    fullscreen: false,
    viewportRelatedHeight: 0,
    viewportRelatedWidth: 0,
    viewportRelatedHeightOnMobile: 0,
    viewportRelatedWidthOnMobile: 0,
    cloneElement: false,
    closeAndDestroy: false,
  }

  this.options = jQuery.extend(default_options , options);
  // End of default options

  var that = this;
  var $ = jQuery;
  var body = $('body');
  var $elm = that.options.cloneElement ? jQuery(elm).clone(true) : jQuery(elm);
  this.elm = $elm;
  var $bg = jQuery('<div class="popupelm-bg"></div>');
  var $container = jQuery('<div class="popupelm-container"></div>');
  this.initialized = false;

  this.initialize = function() {
    if(!this.initialized) {
      this.initialized = true;
      that.originalHeight = $elm.height();
      that.originalWidth = $elm.width();
      //var $subcontainer = jQuery('<div class="popupelm-subcontainer"></div>');
      $bg       .css({zIndex: 1000000, position: 'fixed', width: '100%', height: $(document).height(), top: 0, display: 'none', opacity: 0.6, backgroundColor: "black" }).appendTo(body);
      $container.css({zIndex: 1000001, position: 'absolute', width: '100%', height: $(document).height(), top: 0, display: 'none' }).appendTo(body);
      $elm.css({position:'relative', display: 'block', top: body.scrollTop()+(Math.max(($(window).height()-$elm.height())/2, 0)), left: (body.width()-$elm.width())/2 }).appendTo($container);
      //$subcontainer.css({position: 'relative', top: '50%'}).appendTo($container);
      $container.click(function(ev) {
        if($container[0] == ev.target){
          that.close();
        }
      });
    }
  }

  this.restoreOpen = function() {
    // "soft" open, does not fire callback
    if(!this.initialized) this.initialize();

    $bg.css({height: body.height()}).fadeIn();
    $container.fadeIn(); //function(){$container.css({height: $(document).height()});});
    that.reposition();
    $(window).resize(that.reposition);
    if(that.options.allowKeyboardControl){
      $(document).bind('keydown', that.closeKeyHandler);
    }
  }

  this.open = function() {
    // "hard" open, fires callback
    that.restoreOpen();
    if(typeof(that.options.openCallback) == "function") that.options.openCallback();
  }

  this.closeKeyHandler = function(ev) {
    if(ev.which == that.options.closeKey) that.close();
  }

  this.reposition = function() {
    if(that.options.fullscreen){
      body.scrollTop(0);
      $elm.css({height: $(window).height(),
                width:  $(window).width(),
                top: 0, left: 0 });
      return;
    }

    if($('body').width()<720){
      body.scrollTop(0);
      if(that.options.viewportRelatedHeightOnMobile){
        $elm.css({height: $(window).height() * that.options.viewportRelatedHeightOnMobile/100});
      }
      if(that.options.viewportRelatedWidthOnMobile){
        $elm.css({width: $(window).width() * that.options.viewportRelatedWidthOnMobile/100});
      }
    } else {
      if(that.options.viewportRelatedHeight) {
        $elm.css({height: $(window).height() * that.options.viewportRelatedHeight/100});
      } else {
        $elm.height(that.originalHeight);
      }
      if(that.options.viewportRelatedWidth) {
        $elm.css({width:  $(window).width() * that.options.viewportRelatedWidth/100});
      } else {
        $elm.width(that.originalWidth);
      }
    }

    var topVal = jQuery(window).scrollTop() + Math.max(($(window).height()-$elm.height())/2, 0);
    $bg.css({top: 0, height: $(document).height()+1000 });
    $elm.css({top: topVal, left: (body.width()-$elm.width())/2 });
  }

  this.restoreClose = function() {
    $bg.fadeOut();

    if(that.options.closeAndDestroy) $container.fadeOut(that.destroy);
    else $container.fadeOut();

    $(window).unbind('resize', that.reposition);
    if(that.options.allowKeyboardControl){
      $(document).unbind('keydown', that.closeKeyHandler);
    }
  }

  this.close = function() {
    this.restoreClose();
    if(typeof(that.options.closeCallback) == "function") that.options.closeCallback();
  }

  this.destroy = function() {
    $bg.remove();
    $container.remove();
    $elm.remove();
    this.initialized = false;
  }

  this.initialize();
}
