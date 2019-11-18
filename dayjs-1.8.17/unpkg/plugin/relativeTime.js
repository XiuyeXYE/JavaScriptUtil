(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.dayjs_plugin_relativeTime = factory());
}(this, (function () { 'use strict';

  var S = 'second';
  var MIN = 'minute';
  var H = 'hour';
  var D = 'day';
  var M = 'month';
  var Y = 'year';

  var index = (function (o, c, d) {
    var proto = c.prototype;
    d.en.relativeTime = {
      future: 'in %s',
      past: '%s ago',
      s: 'a few seconds',
      m: 'a minute',
      mm: '%d minutes',
      h: 'an hour',
      hh: '%d hours',
      d: 'a day',
      dd: '%d days',
      M: 'a month',
      MM: '%d months',
      y: 'a year',
      yy: '%d years'
    };

    var fromTo = function fromTo(input, withoutSuffix, instance, isFrom) {
      var loc = instance.$locale().relativeTime;
      var T = [{
        l: 's',
        r: 44,
        d: S
      }, {
        l: 'm',
        r: 89
      }, {
        l: 'mm',
        r: 44,
        d: MIN
      }, {
        l: 'h',
        r: 89
      }, {
        l: 'hh',
        r: 21,
        d: H
      }, {
        l: 'd',
        r: 35
      }, {
        l: 'dd',
        r: 25,
        d: D
      }, {
        l: 'M',
        r: 45
      }, {
        l: 'MM',
        r: 10,
        d: M
      }, {
        l: 'y',
        r: 17
      }, {
        l: 'yy',
        d: Y
      }];
      var Tl = T.length;
      var result;
      var out;

      for (var i = 0; i < Tl; i += 1) {
        var t = T[i];

        if (t.d) {
          result = isFrom ? d(input).diff(instance, t.d, true) : instance.diff(input, t.d, true);
        }

        var abs = Math.round(Math.abs(result));

        if (abs <= t.r || !t.r) {
          if (abs === 1 && i > 0) t = T[i - 1]; // 1 minutes -> a minute

          out = loc[t.l].replace('%d', abs);
          break;
        }
      }

      if (withoutSuffix) return out;
      return (result > 0 ? loc.future : loc.past).replace('%s', out);
    };

    proto.to = function (input, withoutSuffix) {
      return fromTo(input, withoutSuffix, this, true);
    };

    proto.from = function (input, withoutSuffix) {
      return fromTo(input, withoutSuffix, this);
    };

    var makeNow = function makeNow(thisDay) {
      return thisDay.$u ? d.utc() : d();
    };

    proto.toNow = function (withoutSuffix) {
      return this.to(makeNow(this), withoutSuffix);
    };

    proto.fromNow = function (withoutSuffix) {
      return this.from(makeNow(this), withoutSuffix);
    };
  });

  return index;

})));