(function () {
  var $ui = Titanium.UI;

  var constructor = function (viewOptions, options) {
    var $this = this;

    /**
     * Options for the base view (ScrollView)
     */
    this.viewOptions = {
      layout: "vertical"
    };

    /**
     * Options for InfiniScroll
     *
     * - **onNewHeight**  {Function}  - Called when a new height for the scroll view has been calculated
     * - **onBottom**     {Function}  - Called when scrolled within the triggerAt option
     * - **triggerAt**    {Unit}      - (percent/dp) When to trigger the 'scrollToBottom' event
     */
    this.options = {
      onNewHeight: function(height, myInfiniScroll){}
    , onBottom: function(myInfiniScroll){}
    , triggerAt:   '90%'
    };

    for (var key in viewOptions) this.viewOptions[key] = viewOptions[key];
    for (var key in options) this.options[key] = options[key];
    this.view = $ui.createScrollView(this.viewOptions);
    this.scrollEndTriggered = false;

    // Cache whether or not this a percentage we're dealing with and the trigger ratio
    if (this.triggerIsPercentage = this.options.triggerAt.indexOf('%')) {
      this.triggerRatio = parseFloat(this.options.triggerAt) / 100;
    } else {
      this.triggerAt = parseInt(this.options.triggerAt);
    }

    // Apparently fn.bind isn't working so we'll curry it
    this.onPostLayoutCurry = function (e) { $this._onPostLayout(e); };
    this.onScrollCurry = function (e) { $this._onScroll(e); };
    this.view.addEventListener('postlayout', this.onPostLayoutCurry);
    this.view.addEventListener('scroll', this.onScrollCurry);
  };

  constructor.prototype = {

    /**
     * Current Height of the ScrollView
     */
    height: 0,

    /**
     * Current dp value for trigger at - differs from the one in options because
     * Someone can pass in a percentage to trigger at and this value represents the dp
     * value of that percentage
     */
    triggerAt: 0,

    /**
     * Keeps state for current rounds trigger status
     */
    triggered: false,

    /**
     * The next child to start adding height from when we trigger the postLayout event
     * We keep track of this so we don't iterate through all of the old children that got added previously
     * And we only add in the new height
     */
    nextChild: 0,

    /**
     * Maintains state for whether or no we're calculating a new height
     */
    calculatingHeight: false,

    /**
     * Base ScrollView for InfiniScroll
     */
    view: null,

    /**
     * Proxy Methods
     */
    add: function (view) {
      return this.view.add(view);
    },

    hide: function () {
      return this.view.hide();
    },

    show: function () {
      return this.view.show();
    },

    scrollTo: function (x, y) {
      return this.view.scrollTo(x, y);
    },

    /**
     * Re-calculates the new triggerAt property if needed and calls user onNewHeight function
     * Also re-attaches the onscroll event
     */
    triggerNewHeight: function () {
      this.triggerAt = (this.triggerIsPercentage) ?
      this.height * this.triggerRatio :
      this.height - this.options.triggerAt;
      this.calculatingHeight = false;
      this.scrollEndTriggered = false;
      this.view.addEventListener('scroll', this.onScrollCurry);
      this.options.onNewHeight(this.height, this);
    },

    triggerScrollEnd: function (scrollY) {
      this.options.onScrollToEnd(scrollY, this);
    },

    /**
     * isCalculatingHeight
     * Returns the caclulation state of the scroll
     * @return {Boolean}
     */
    isCalculatingHeight: function () {
      return this.calculatingHeight;
    },

    /**
     * Bound to the postlayout even on the Base View
     * Updates the height and nextChild property when a layout change occurs
     * @private
     */
    _onPostLayout: function (e) {
      if (e.source === this.view && this.view.children.length > 0) {
        this.calculatingHeight = true;
        var children = this.view.children;

        for (var i = this.nextChild || 0, child; i < children.length; i++) {
          child = children[i];
          this.height += parseInt(child.getSize().height) || 0;
          this.height += parseInt(child.getTop())         || 0;
          this.height += parseInt(child.getBottom())      || 0;
        }

        this.nextChild = children.length;
        this.triggerNewHeight();
      }
    },

    /**
     * Checks against scroll events and triggers and removes when necessary,
     * such as when scrolling happens during handler removal or end triggering.
     * @private
     */
    _onScroll: function (e) {
      if (this.scrollEndTriggered) return;
      // In case there was some scrolling while the handler was being removed
      if (this.isCalculatingHeight()) return;
      if (e.y >= this.triggerAt - this.view.size.height) {
        this.scorllEndTriggered = true;
        this.view.removeEventListener('scroll', this.onScrollCurry);
        this.triggerScrollEnd(e.y);
      }
    }
  };

  exports = constructor;
})();