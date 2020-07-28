function hitokotoVariable() {
  return new Promise(resolve => {
    var xhr = new XMLHttpRequest();
    xhr.open('get', 'https://v1.hitokoto.cn?c='+"di"[Math.floor(Math.random() * 2)]);
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var data = JSON.parse(xhr.responseText);
        resolve(data.hitokoto)
      }
    }
    xhr.send();
  })
}

module.exports = {
  hitokotoVariable
};
