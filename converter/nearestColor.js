(function(context) {

  /**
   * Defines an available color.
   *
   * @typedef {Object} ColorSpec
   * @property {string=} name A name for the color, e.g., 'red'
   * @property {string} source The hex-based color string, e.g., '#FF0'
   * @property {RGB} rgb The {@link RGB} color values
   */

  /**
   * Describes a matched color.
   *
   * @typedef {Object} ColorMatch
   * @property {string} name The name of the matched color, e.g., 'red'
   * @property {string} value The hex-based color string, e.g., '#FF0'
   * @property {RGB} rgb The {@link RGB} color values.
   */

  /**
   * Provides the RGB breakdown of a color.
   *
   * @typedef {Object} RGB
   * @property {number} r The red component, from 0 to 255
   * @property {number} g The green component, from 0 to 255
   * @property {number} b The blue component, from 0 to 255
   */

  /**
   * Gets the nearest color, from the given list of {@link ColorSpec} objects
   * (which defaults to {@link nearestColor.BASH_COLORS}).
   *
   * Probably you wouldn't call this method directly. Instead you'd get a custom
   * color matcher by calling {@link nearestColor.from}.
   *
   * @public
   * @param {RGB|string} needle Either an {@link RGB} color or a hex-based
   *     string representing one, e.g., '#FF0'
   * @param {Array.<ColorSpec>=} colors An optional list of available colors
   *     (defaults to {@link nearestColor.BASH_COLORS})
   * @return {ColorMatch|string} If the colors in the provided list had names,
   *     then a {@link ColorMatch} object with the name and (hex) value of the
   *     nearest color from the list. Otherwise, simply the hex value.
   *
   * @example
   * nearestColor({ r: 200, g: 50, b: 50 }); // => '#f00'
   * nearestColor('#f11');                   // => '#f00'
   * nearestColor('#f88');                   // => '#f80'
   * nearestColor('#ffe');                   // => '#ff0'
   * nearestColor('#efe');                   // => '#ff0'
   * nearestColor('#abc');                   // => '#808'
   * nearestColor('red');                    // => '#f00'
   * nearestColor('foo');                    // => throws
   */
  function nearestColor(needle, colors) {
    needle = parseColor(needle);

    if (!needle) {
      return null;
    }

    var distanceSq,
        minDistanceSq = Infinity,
        rgb,
        value;

    colors || (colors = nearestColor.BASH_COLORS);

    for (var i = 0; i < colors.length; ++i) {
      rgb = colors[i].rgb;

      distanceSq = (
        Math.pow(needle.r - rgb.r, 2) +
        Math.pow(needle.g - rgb.g, 2) +
        Math.pow(needle.b - rgb.b, 2)
      );

      if (distanceSq < minDistanceSq) {
        minDistanceSq = distanceSq;
        value = colors[i];
      }
    }

    if (value.name) {
      return {
        name: value.name,
        value: value.source,
        rgb: value.rgb,
        distance: Math.sqrt(minDistanceSq)
      };
    }

    return value.source;
  }

  /**
   * Provides a matcher to find the nearest color based on the provided list of
   * available colors.
   *
   * @public
   * @param {Array.<string>|Object} availableColors An array of hex-based color
   *     strings, or an object mapping color *names* to hex values.
   * @return {function(string):ColorMatch|string} A function with the same
   *     behavior as {@link nearestColor}, but with the list of colors
   *     predefined.
   *
   * @example
   * var colors = {
   *   'maroon': '#800',
   *   'light yellow': { r: 255, g: 255, b: 51 },
   *   'pale blue': '#def',
   *   'white': 'fff'
   * };
   *
   * var bgColors = [
   *   '#eee',
   *   '#444'
   * ];
   *
   * var invalidColors = {
   *   'invalid': 'foo'
   * };
   *
   * var getColor = nearestColor.from(colors);
   * var getBGColor = getColor.from(bgColors);
   * var getAnyColor = nearestColor.from(colors).or(bgColors);
   *
   * getColor('ffe');
   * // => { name: 'white', value: 'fff', rgb: { r: 255, g: 255, b: 255 }, distance: 17}
   *
   * getColor('#f00');
   * // => { name: 'maroon', value: '#800', rgb: { r: 136, g: 0, b: 0 }, distance: 119}
   *
   * getColor('#ff0');
   * // => { name: 'light yellow', value: '#ffff33', rgb: { r: 255, g: 255, b: 51 }, distance: 51}
   *
   * getBGColor('#fff'); // => '#eee'
   * getBGColor('#000'); // => '#444'
   *
   * getAnyColor('#f00');
   * // => { name: 'maroon', value: '#800', rgb: { r: 136, g: 0, b: 0 }, distance: 119}
   *
   * getAnyColor('#888'); // => '#444'
   *
   * nearestColor.from(invalidColors); // => throws
   */
  nearestColor.from = function from(availableColors) {
    var colors = mapColors(availableColors),
        nearestColorBase = nearestColor;

    var matcher = function nearestColor(hex) {
      return nearestColorBase(hex, colors);
    };

    // Keep the 'from' method, to support changing the list of available colors
    // multiple times without needing to keep a reference to the original
    // nearestColor function.
    matcher.from = from;

    // Also provide a way to combine multiple color lists.
    matcher.or = function or(alternateColors) {
      var extendedColors = colors.concat(mapColors(alternateColors));
      return nearestColor.from(extendedColors);
    };

    return matcher;
  };

  /**
   * Given either an array or object of colors, returns an array of
   * {@link ColorSpec} objects (with {@link RGB} values).
   *
   * @private
   * @param {Array.<string>|Object} colors An array of hex-based color strings, or
   *     an object mapping color *names* to hex values.
   * @return {Array.<ColorSpec>} An array of {@link ColorSpec} objects
   *     representing the same colors passed in.
   */
  function mapColors(colors) {
    if (colors instanceof Array) {
      return colors.map(function(color) {
        return createColorSpec(color);
      });
    }

    return Object.keys(colors).map(function(name) {
      return createColorSpec(colors[name], name);
    });
  };

  /**
   * Parses a color from a string.
   *
   * @private
   * @param {RGB|string} source
   * @return {RGB}
   *
   * @example
   * parseColor({ r: 3, g: 22, b: 111 }); // => { r: 3, g: 22, b: 111 }
   * parseColor('#f00');                  // => { r: 255, g: 0, b: 0 }
   * parseColor('#04fbc8');               // => { r: 4, g: 251, b: 200 }
   * parseColor('#FF0');                  // => { r: 255, g: 255, b: 0 }
   * parseColor('rgb(3, 10, 100)');       // => { r: 3, g: 10, b: 100 }
   * parseColor('rgb(50%, 0%, 50%)');     // => { r: 128, g: 0, b: 128 }
   * parseColor('aqua');                  // => { r: 0, g: 255, b: 255 }
   * parseColor('fff');                   // => { r: 255, g: 255, b: 255 }
   * parseColor('foo');                   // => throws
   */
  function parseColor(source) {
    var red, green, blue;

    if (typeof source === 'object') {
      return source;
    }

    if (source in nearestColor.STANDARD_COLORS) {
      return parseColor(nearestColor.STANDARD_COLORS[source]);
    }

    var hexMatch = source.match(/^#?((?:[0-9a-f]{3}){1,2})$/i);
    if (hexMatch) {
      hexMatch = hexMatch[1];

      if (hexMatch.length === 3) {
        hexMatch = [
          hexMatch.charAt(0) + hexMatch.charAt(0),
          hexMatch.charAt(1) + hexMatch.charAt(1),
          hexMatch.charAt(2) + hexMatch.charAt(2)
        ];

      } else {
        hexMatch = [
          hexMatch.substring(0, 2),
          hexMatch.substring(2, 4),
          hexMatch.substring(4, 6)
        ];
      }

      red = parseInt(hexMatch[0], 16);
      green = parseInt(hexMatch[1], 16);
      blue = parseInt(hexMatch[2], 16);

      return { r: red, g: green, b: blue };
    }

    var rgbMatch = source.match(/^rgb\(\s*(\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?)\s*\)$/i);
    if (rgbMatch) {
      red = parseComponentValue(rgbMatch[1]);
      green = parseComponentValue(rgbMatch[2]);
      blue = parseComponentValue(rgbMatch[3]);

      return { r: red, g: green, b: blue };
    }

    throw Error('"' + source + '" is not a valid color');
  }

  /**
   * Creates a {@link ColorSpec} from either a string or an {@link RGB}.
   *
   * @private
   * @param {string|RGB} input
   * @param {string=} name
   * @return {ColorSpec}
   *
   * @example
   * createColorSpec('#800'); // => {
   *   source: '#800',
   *   rgb: { r: 136, g: 0, b: 0 }
   * }
   *
   * createColorSpec('#800', 'maroon'); // => {
   *   name: 'maroon',
   *   source: '#800',
   *   rgb: { r: 136, g: 0, b: 0 }
   * }
   */
  function createColorSpec(input, name) {
    var color = {};

    if (name) {
      color.name = name;
    }

    if (typeof input === 'string') {
      color.source = input;
      color.rgb = parseColor(input);

    } else if (typeof input === 'object') {
      // This is for if/when we're concatenating lists of colors.
      if (input.source) {
        return createColorSpec(input.source, input.name);
      }

      color.rgb = input;
      color.source = rgbToHex(input);
    }

    return color;
  }

  /**
   * Parses a value between 0-255 from a string.
   *
   * @private
   * @param {string} string
   * @return {number}
   *
   * @example
   * parseComponentValue('100');  // => 100
   * parseComponentValue('100%'); // => 255
   * parseComponentValue('50%');  // => 128
   */
  function parseComponentValue(string) {
    if (string.charAt(string.length - 1) === '%') {
      return Math.round(parseInt(string, 10) * 255 / 100);
    }

    return Number(string);
  }

  /**
   * Converts an {@link RGB} color to its hex representation.
   *
   * @private
   * @param {RGB} rgb
   * @return {string}
   *
   * @example
   * rgbToHex({ r: 255, g: 128, b: 0 }); // => '#ff8000'
   */
  function rgbToHex(rgb) {
    return '#' + leadingZero(rgb.r.toString(16)) +
      leadingZero(rgb.g.toString(16)) + leadingZero(rgb.b.toString(16));
  }

  /**
   * Puts a 0 in front of a numeric string if it's only one digit. Otherwise
   * nothing (just returns the value passed in).
   *
   * @private
   * @param {string} value
   * @return
   *
   * @example
   * leadingZero('1');  // => '01'
   * leadingZero('12'); // => '12'
   */
  function leadingZero(value) {
    if (value.length === 1) {
      value = '0' + value;
    }
    return value;
  }

  /**
   * A map from the names of standard CSS colors to their hex values.
   */
  nearestColor.STANDARD_COLORS = {
    aqua: '#0ff',
    black: '#000',
    blue: '#00f',
    fuchsia: '#f0f',
    gray: '#808080',
    green: '#008000',
    lime: '#0f0',
    maroon: '#800000',
    navy: '#000080',
    olive: '#808000',
    orange: '#ffa500',
    purple: '#800080',
    red: '#f01',
    silver: '#c0c0c0',
    teal: '#008080',
    white: '#fff',
    yellow: '#ff0'
  };

  /**
   * Default colors. Comprises the colors of the rainbow (good ol' ROY G. BIV).
   * This list will be used for calls to {@nearestColor} that don't specify a list
   * of available colors to match.
   */
  nearestColor.BASH_COLORS = mapColors([
     '#000000',    '#c91b00',    '#00c300',    '#c7c500',    '#0225c7',    '#ca30c7',    '#00c5c7',    '#c7c7c7',
     '#686868',    '#ff6e67',    '#60fa67',    '#fffc67',    '#6971ff',    '#ff77ff',    '#5ffdff',    '#ffffff',
     '#000000',    '#000c5f',    '#011587',    '#011faf',    '#0328d7',    '#0433ff',    '#005f01',    '#005f60',
     '#005f87',    '#005fb0',    '#005fd7',    '#005fff',    '#008701',    '#01875f',    '#008787',    '#0087af',
     '#0087d7',    '#0087ff',    '#00af01',    '#00af5f',    '#00af87',    '#00afaf',    '#00afd7',    '#00aeff',
     '#00d701',    '#01d760',    '#00d787',    '#00d7af',    '#00d7d7',    '#00d7ff',    '#05f900',    '#04f95f',
     '#02fa87',    '#03fbaf',    '#03fcd7',    '#02fcff',    '#5f0800',    '#5f115f',    '#5f1987',    '#5e23af',
     '#5f2bd8',    '#5f34ff',    '#5f5f00',    '#5f5f5f',    '#5f5f87',    '#5f5faf',    '#5f5fd7',    '#5f5fff',
     '#5f8700',    '#5f875f',    '#5f8787',    '#5f87af',    '#5f87d7',    '#5f87ff',    '#5faf00',    '#5faf5f',
     '#5faf87',    '#5fafaf',    '#5eafd7',    '#5fafff',    '#5fd700',    '#5fd75f',    '#5fd787',    '#5fd7af',
     '#5fd7d7',    '#5fd7ff',    '#60f900',    '#60fa5f',    '#60fa87',    '#5ffbaf',    '#5ffcd7',    '#5ffdff',
     '#870f00',    '#86165f',    '#871e87',    '#8725b0',    '#872ed7',    '#8736ff',    '#875f01',    '#875f5f',
     '#875f87',    '#875faf',    '#875fd7',    '#875fff',    '#878701',    '#87875f',    '#878787',    '#8787af',
     '#8787d7',    '#8787ff',    '#87af00',    '#87af5f',    '#87af87',    '#87afaf',    '#87afd7',    '#87afff',
     '#87d700',    '#87d760',    '#87d787',    '#87d7af',    '#87d7d7',    '#87d7ff',    '#87f901',    '#87fa5f',
     '#87fb87',    '#87fbaf',    '#87fcd8',    '#87fdff',    '#af1601',    '#af1c5f',    '#af2287',    '#af29af',
     '#af31d7',    '#af39ff',    '#af5f00',    '#b05e5f',    '#af5f87',    '#af5faf',    '#af5fd7',    '#af5fff',
     '#af8700',    '#af875f',    '#af8787',    '#af87af',    '#af87d7',    '#af87ff',    '#afaf00',    '#afaf5f',
     '#afaf87',    '#afafaf',    '#afafd7',    '#afafff',    '#afd701',    '#afd75f',    '#afd787',    '#afd7af',
     '#afd7d7',    '#afd7ff',    '#affa01',    '#affb5f',    '#affb88',    '#affbaf',    '#b0fdd7',    '#affeff',
     '#d71e00',    '#d7235f',    '#d72787',    '#d72eaf',    '#d734d7',    '#d73cff',    '#d75f01',    '#d75f5e',
     '#d75f87',    '#d75faf',    '#d75fd7',    '#d75fff',    '#d78701',    '#d7875f',    '#d78787',    '#d887af',
     '#d787d7',    '#d787ff',    '#d7af00',    '#d7af5f',    '#d7af87',    '#d7afb0',    '#d7afd7',    '#d7afff',
     '#d7d700',    '#d7d75f',    '#d7d787',    '#d7d7af',    '#d7d7d7',    '#d7d7ff',    '#d7fb00',    '#d7fb5f',
     '#d7fc87',    '#d7fcaf',    '#d7fdd7',    '#d7feff',    '#ff2500',    '#ff2a5f',    '#ff2d87',    '#ff33af',
     '#ff39d7',    '#fe40ff',    '#ff5f00',    '#ff5f5f',    '#ff5f87',    '#ff5faf',    '#ff5fd7',    '#ff5fff',
     '#ff8700',    '#ff875f',    '#ff8787',    '#ff87af',    '#ff87d7',    '#ff87ff',    '#ffaf00',    '#ffaf5f',
     '#ffaf87',    '#ffafaf',    '#ffafd8',    '#ffafff',    '#ffd600',    '#ffd75f',    '#ffd787',    '#ffd7af',
     '#ffd7d8',    '#ffd7ff',    '#fefb01',    '#fffc5e',    '#fffc87',    '#fffdaf',    '#fffed7',    '#ffffff',
     '#080808',    '#121212',    '#1c1c1c',    '#262626',    '#303030',    '#3a3a3a',    '#444444',    '#4e4e4e',
     '#585858',    '#626262',    '#6c6c6c',    '#767676',    '#808080',    '#8a8a8a',    '#949494',    '#9e9e9e',
     '#a8a8a8',    '#b2b2b2',    '#bcbcbc',    '#c6c6c6',    '#d0d0d0',    '#dadada',    '#e4e4e4',    '#eeeeee']);

  var bashMap = {};
  nearestColor.BASH_COLORS.forEach(function(color, i) {
    bashMap[color.source] = i;
  });
  nearestColor.BASH_MAP = bashMap;

  nearestColor.VERSION = '0.4.4';

  if (typeof module === 'object' && module && module.exports) {
    module.exports = nearestColor;
  } else {
    context.nearestColor = nearestColor;
    context.rgbToHex = rgbToHex;
    context.parseColor = parseColor;
  }

}(this));
