(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.AJTemplateMethod = api;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function AccessibilityProfileTemplate() {}

  AccessibilityProfileTemplate.prototype.applyProfile = function (context) {
    var trace = [];
    trace.push(this.reset(context));
    trace.push(this.applyPrimaryEffect(context));
    trace.push(this.applyExtraEffect(context));
    trace.push(this.persist(context));
    return trace.filter(Boolean);
  };

  AccessibilityProfileTemplate.prototype.reset = function (context) {
    context.html.style.fontSize = '';
    return 'reset';
  };
  AccessibilityProfileTemplate.prototype.persist = function (context) {
    if (typeof context.saveState === 'function') context.saveState(context.state);
    return 'persist';
  };

  AccessibilityProfileTemplate.prototype.applyPrimaryEffect = function () {};
  AccessibilityProfileTemplate.prototype.applyExtraEffect = function () {};

  function LowVisionProfile() {}
  LowVisionProfile.prototype = Object.create(AccessibilityProfileTemplate.prototype);
  LowVisionProfile.prototype.constructor = LowVisionProfile;
  LowVisionProfile.prototype.applyPrimaryEffect = function (context) {
    context.html.classList.add('ajw-contrast-dark');
    return 'primary:contrast-dark';
  };
  LowVisionProfile.prototype.applyExtraEffect = function (context) {
    context.html.style.fontSize = '130%';
    return 'extra:font-130';
  };

  function DyslexiaProfile() {}
  DyslexiaProfile.prototype = Object.create(AccessibilityProfileTemplate.prototype);
  DyslexiaProfile.prototype.constructor = DyslexiaProfile;
  DyslexiaProfile.prototype.applyPrimaryEffect = function (context) {
    context.html.classList.add('ajw-readable-font');
    return 'primary:readable-font';
  };
  DyslexiaProfile.prototype.applyExtraEffect = function (context) {
    context.html.style.fontSize = '115%';
    return 'extra:font-115';
  };

  return {
    AccessibilityProfileTemplate: AccessibilityProfileTemplate,
    LowVisionProfile: LowVisionProfile,
    DyslexiaProfile: DyslexiaProfile,
  };
});
