"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lightenDarkenColor;
function lightenDarkenColor(col, amt) {
  var usePound = false;
  var num = void 0;
  var r = void 0;
  var b = void 0;
  var g = void 0;

  if (col[0] === "#") {
    col = col.slice(1);
    usePound = true;
  }

  num = parseInt(col, 16);

  r = (num >> 16) + amt;

  if (r > 255) {
    r = 255;
  } else if (r < 0) {
    r = 0;
  }

  b = (num >> 8 & 0x00FF) + amt;

  if (b > 255) {
    b = 255;
  } else if (b < 0) {
    b = 0;
  }

  g = (num & 0x0000FF) + amt;

  if (g > 255) {
    g = 255;
  } else if (g < 0) {
    g = 0;
  }

  return (usePound ? "#" : "") + (g | b << 8 | r << 16).toString(16);
}