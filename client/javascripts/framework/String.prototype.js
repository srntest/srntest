String.prototype.format = function format() {
  var args = arguments, rx = /\{(\d+)\}/g, fn = function(capture, p1) {
    return args[p1];
  };
  return this.replace(rx, fn);
};