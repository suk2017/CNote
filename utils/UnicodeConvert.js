function toUnicode(data) {
  if (data == '') return '请输入汉字';
  var str = '';
  for (var i = 0; i < data.length; i++) {
    str += "\\u" + parseInt(data[i].charCodeAt(0), 10).toString(16);
  }
  return str;
}
function toChinese(data) {
  if (data == '') return '请输入十六进制unicode';
  data = data.split("\\u");
  var str = '';
  for (var i = 0; i < data.length; i++) {
    str += String.fromCharCode(parseInt(data[i], 16).toString(10));
  }
  return str;
}

module.exports = {
  toChinese:toChinese,
  toUnicode:toUnicode
}    