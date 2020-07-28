/**
 * @description The storage of configs. Intend to unify serverJs and clientJs's config
 */

/**
 * Default settings for defaulter
 * @type {Object}
 */

const defaultConfig = {
  model: {
    jsonPath: 'https://cdn.jsdelivr.net/npm/live2d-widget-model-shizuku@latest/assets/shizuku.model.json',
    scale: 1,
  },
  display: {
    superSample: 2,
    width: 200,
    height: 400,
    position: 'right',
    hOffset: 150,
    vOffset: -50,
  },
  mobile: {
    show: true,
    scale: 0.8,
    motion: true,
  },
  name: {
    canvas: 'live2dcanvas',
    div: 'live2d-widget',
  },
  react: {
    opacity: 1,
  },
  dev: {
    border: false
  },
  dialog: {
    enable: true,
    script: {
      'tap body': ["干嘛呢你，快把手拿开～～", "鼠…鼠标放错地方了！", "你要干嘛呀？", "喵喵喵？", "怕怕(ノ≧∇≦)ノ", "非礼呀！救命！", "这样的话，只能使用武力了！", "我要生气了哦", "不要动手动脚的！", "真…真的是不知羞耻！", "Hentai！"],
      'tap face': ['人家已经不是小孩子了！', '原来你喜欢我啊！', '我猜你应该喜欢我，对吗？']
    }
  }
}

module.exports = defaultConfig;
