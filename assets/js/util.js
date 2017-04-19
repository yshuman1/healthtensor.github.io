window.util = {
  parsePxStr: function (pxString) {
    if (pxString.indexOf('px') != pxString.length - 2) {
      if (otherwise) {
        return otherwise;
      } else {
        throw 'px substring in unexpected location';
      }
    }
    return Math.floor(Number(pxString.slice(0, pxString.length - 2)));
  }
}
