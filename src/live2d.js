import {L2Dwidget} from "./index";
// import  {__webpack_public_path__} from "./wpPublicPath";
__webpack_public_path__ = "/assets/js/live2d-widget/";
import "./widget.css";
const cdnList = ["https://cdn.jsdelivr.net/npm/", "https://unpkg.com/"];
const apiList = ["https://api.zsq.im/live2d/", "https://agile-peak-14536.herokuapp.com/"];
window.userConfig = {};
if (localStorage.getItem("jsonPath")) {
  window.userConfig.model = {
    jsonPath: localStorage.getItem("jsonPath")
  };
} else {
  localStorage.setItem("useDefault", true);
}

!function loadModel() {
  L2Dwidget.init(window.userConfig);
  let timerId;
  timerId = setInterval(() => {
    if (document.querySelector("#live2dcanvas")) {
      console.log("live2d-widget loaded");
      clearInterval(timerId);
      document.querySelector("#live2d-widget").style.pointerEvents = "";
      initWidget();
      loadPath();
    }
    console.log("loading live2d-widget...");
  }, 500);
}();

function initWidget() {
  document.body.insertAdjacentHTML("beforeend", `<div id="live2d-toggle">
            <i>看板娘</i>
        </div>`);
  const toggle = document.getElementById("live2d-toggle");
  toggle.addEventListener("click", () => {
    toggle.classList.remove("live2d-toggle-active");
    if (toggle.getAttribute("first-time")) {
      loadWidget();
      toggle.removeAttribute("first-time");
    } else {
      localStorage.removeItem("live2d-display");
      document.getElementById("live2d-widget").style.display = "";
      setTimeout(() => {
        document.getElementById("live2d-widget").style.bottom = L2Dwidget.config.display.vOffset;
      }, 0);
    }
  });
  if (localStorage.getItem("live2d-display") && Date.now() - localStorage.getItem("live2d-display") <= 86400000) {
    toggle.setAttribute("first-time", true);
    setTimeout(() => {
      toggle.classList.add("live2d-toggle-active");
    }, 0);
  } else {
    loadWidget();
  }
}

function loadWidget() {
  localStorage.removeItem("live2d-display");
  sessionStorage.removeItem("live2d-text");
  let spanClass = ["far fa-comment-dots", "fas fa-people-arrows", "fas fa-female", "fas fa-camera-retro", "fas fa-times"];
  // let tips = document.createElement('div');
  // tips.id = "live2d-tips";
  // document.querySelector("#live2d").prepend(tips);
  let tool = document.createElement('div');
  tool.id = "live2d-tool";
  document.querySelector("#live2d-widget").append(tool);
  for (let faClass of spanClass) {
    let newI = document.createElement('i');
    newI.className = faClass;
    document.querySelector("#live2d-tool").append(newI);
  }

  function randomSelection(obj) {
    return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj;
  }

  // 检测用户活动状态，并在空闲时显示消息
  let userAction = false,
    userActionTimer, messageTimer, messageArray = ["好久不见，日子过得好快呢……", "大坏蛋！你都多久没理人家了呀，嘤嘤嘤～", "嗨～快来逗我玩吧！", "拿小拳拳锤你胸口！"];
  window.addEventListener("mousemove", () => userAction = true);
  window.addEventListener("keydown", () => userAction = true);
  setInterval(() => {
    if (userAction) {
      userAction = false;
      clearInterval(userActionTimer);
      userActionTimer = null;
    } else if (!userActionTimer) {
      userActionTimer = setInterval(() => {
        showMessage(randomSelection(messageArray), 6000, 9);
      }, 20000);
    }
  }, 1000);
  fetch(__webpack_public_path__ + "tips.json")
    .then(response => response.json())
    .then(result => {
      window.addEventListener("mouseover", event => {
        for (let tips of result.mouseover) {
          if (!event.target.matches(tips.selector)) continue;
          let text = randomSelection(tips.text);
          text = text.replace("{text}", event.target.innerText);
          showMessage(text, 4000, 8);
          return;
        }
      });
      window.addEventListener("touchstart", event => {
        for (let tips of result.mouseover) {
          if (!event.target.matches(tips.selector)) continue;
          let text = randomSelection(tips.text);
          text = text.replace("{text}", event.target.innerText);
          showMessage(text, 4000, 8);
          return;
        }
      });
      // window.addEventListener("click", event => {
      //     for (let tips of result.click) {
      //         if (!event.target.matches(tips.selector)) continue;
      //         let text = randomSelection(tips.text);
      //         text = text.replace("{text}", event.target.innerText);
      //         showMessage(text, 4000, 8);
      //         return;
      //     }
      // });
      result.seasons.forEach(tips => {
        const now = new Date(),
          after = tips.date.split("-")[0],
          before = tips.date.split("-")[1] || after;
        if ((after.split("/")[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split("/")[0]) && (after.split("/")[1] <= now.getDate() && now.getDate() <= before.split("/")[1])) {
          let text = randomSelection(tips.text);
          text = text.replace("{year}", now.getFullYear());
          //showMessage(text, 7000, true);
          messageArray.push(text);
        }
      });
    });
  (function registerEventListener() {
    document.querySelector("#live2d-tool .fa-comment-dots").addEventListener("click", showHitokoto);
    document.querySelector("#live2d-tool .fa-people-arrows").addEventListener("click", loadOtherModel);
    document.querySelector("#live2d-tool .fa-female").addEventListener("click", loadRandModel);
    document.querySelector("#live2d-tool .fa-camera-retro").addEventListener("click", () => {
      showMessage("照好了嘛，是不是很可爱呢？", 6000, 9);
      console.log(L2Dwidget.config);
      L2Dwidget.downloadFrame();
    });
    document.querySelector("#live2d-tool .fa-times").addEventListener("click", () => {
      localStorage.setItem("live2d-display", Date.now());
      showMessage("愿你有一天能与重要的人重逢。", 2000, 11);
      document.getElementById("live2d-widget").style.bottom = "-500px";
      setTimeout(() => {
        document.getElementById("live2d-widget").style.display = "none";
        document.getElementById("live2d-toggle").classList.add("live2d-toggle-active");
      }, 3000);
    });
    const devtools = () => {};
    console.log("%c", devtools);
    devtools.toString = () => {
      showMessage("哈哈，你打开了控制台，是想要看看我的小秘密吗？", 6000, 9);
    };
    window.addEventListener("copy", () => {
      showMessage("你都复制了些什么呀，转载要记得加上出处哦！", 6000, 9);
    });
    window.addEventListener("visibilitychange", () => {
      if (!document.hidden)
        showMessage("哇，你终于回来了～", 6000, 9);
    });
  })();
  // if (localStorage.getItem("useDefault")) {
  //     document.querySelector("#live2d-tool .fa-female").style.display = "none";
  // }
  (function welcomeMessage() {
    let text;
    if (location.pathname === "/") {
      // 如果是主页
      const now = new Date().getHours();
      if (now > 5 && now <= 7)
        text = "早上好！一日之计在于晨，美好的一天就要开始了。";
      else if (now > 7 && now <= 11)
        text = "上午好！工作顺利嘛，不要久坐，多起来走动走动哦！";
      else if (now > 11 && now <= 13)
        text = "中午了，工作了一个上午，现在是午餐时间！";
      else if (now > 13 && now <= 17)
        text = "午后很容易犯困呢，今天的运动目标完成了吗？";
      else if (now > 17 && now <= 19)
        text = "傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红～";
      else if (now > 19 && now <= 21)
        text = "晚上好，今天过得怎么样？";
      else if (now > 21 && now <= 23)
        text = ["已经这么晚了呀，早点休息吧，晚安～", "深夜时要爱护眼睛呀！"];
      else
        text = "你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？";
    } else if (document.referrer !== "") {
      const referrer = new URL(document.referrer),
        domain = referrer.hostname.split(".")[1];
      if (location.hostname === referrer.hostname)
        text = `欢迎阅读<i>「${document.title.split(" - ")[0]}」</i>`;
      else if (domain === "baidu")
        text = `Hello！来自 百度搜索 的朋友<br>你是搜索 <i>${referrer.search.split("&wd=")[1].split("&")[0]}</i> 找到的我吗？`;
      else if (domain === "so")
        text = `Hello！来自 360搜索 的朋友<br>你是搜索 <i>${referrer.search.split("&q=")[1].split("&")[0]}</i> 找到的我吗？`;
      else if (domain === "google")
        text = `Hello！来自 谷歌搜索 的朋友<br>欢迎阅读<i>「${document.title.split(" - ")[0]}」</i>`;
      else
        text = `Hello！来自 <i>${referrer.hostname}</i> 的朋友`;
    } else {
      text = `欢迎阅读<i>「${document.title.split(" - ")[0]}」</i>`;
    }
    showMessage(text, 7000, 8);
  })();

  function showMessage(text, timeout, priority) {
    if (!text || (sessionStorage.getItem("live2d-text") && sessionStorage.getItem("live2d-text") > priority)) return;
    if (messageTimer) {
      clearTimeout(messageTimer);
      messageTimer = null;
    }
    text = randomSelection(text);
    sessionStorage.setItem("live2d-text", priority);
    L2Dwidget.say(text, timeout);
    sessionStorage.removeItem("live2d-text");
    // const tips = document.getElementById("live2d-tips");
    // tips.innerHTML = text;
    // tips.classList.add("live2d-tips-active");
    // messageTimer = setTimeout(() => {
    // 	sessionStorage.removeItem("live2d-text");
    // 	tips.classList.remove("live2d-tips-active");
    // }, timeout);
  }

  function showHitokoto() {
    // 增加 hitokoto.cn 的 API
    fetch('https://v1.hitokoto.cn?c=' + "di" [Math.floor(Math.random() * 2)])
      .then(response => response.json())
      .then(result => {
        const text = `这句一言来自 <i>「${result.from}」</i>，是 <i>${result.creator}</i> 在 hitokoto.cn 投稿的。`;
        showMessage(result.hitokoto, 6000, 9);
        setTimeout(() => {
          showMessage(text, 4000, 9);
        }, 6000);
      });
  }

  function loadRandModel() {
    if (localStorage.getItem("useDefault")) {
      showMessage(["我还没有其他衣服呢！", "唉，主人说好了要给我买新衣服的……", "兴许明天主人就给带来了期待已久的新衣服！"], 5000, 7);
    } else {
      // let randomConfig = randomSelection(allModelConfig[localStorage.getItem("currentGroup")])
      // L2Dwidget.useModel(randomConfig);
      // localStorage.setItem("jsonPath", randomConfig);
      newModelFromGroup();
      showMessage(["我的新衣服好看嘛？", "主人真好，给我买了这件漂亮的衣服～"], 5000, 7);
    }
  }

  function loadOtherModel() {
    if (Math.random()<0.2) {
      L2Dwidget.useModel();
      localStorage.setItem("useDefault", true);
      return 1;
    }
    localStorage.setItem("currentGroup", Math.floor(Math.random() * allModelConfig.length));
    localStorage.removeItem("useDefault");
    newModelFromGroup();
  }

  function newModelFromGroup() {
    let groupIndex = +localStorage.getItem("currentGroup");
    let newTexture = 0;
    if (localStorage.getItem("textureId")) {
      newTexture = (+localStorage.getItem("textureId") + 13) % allModelConfig[groupIndex].length;
    }
    localStorage.setItem("textureId", newTexture);
    let config = allModelConfig[groupIndex][newTexture];
    if (groupIndex)
      L2Dwidget.useModel(allModelConfig[groupIndex][newTexture], 1.3);
    localStorage.setItem("jsonPath", config);
  }
}

function loadPath(cdnId = 0, apiId = 0) {
  let cdn = cdnList[cdnId];
  let api = apiList[apiId];
  window.allModelConfig = [
    [],
    [],
    []
  ];
  // add nep model
  const nep_model = [
    "HyperdimensionNeptunia/neptune_classic",
    "HyperdimensionNeptunia/nepnep",
    "HyperdimensionNeptunia/neptune_santa",
    "HyperdimensionNeptunia/nepmaid",
    "HyperdimensionNeptunia/nepswim",
    "HyperdimensionNeptunia/noir_classic",
    "HyperdimensionNeptunia/noir",
    "HyperdimensionNeptunia/noir_santa",
    "HyperdimensionNeptunia/noireswim",
    "HyperdimensionNeptunia/blanc_classic",
    "HyperdimensionNeptunia/blanc_normal",
    "HyperdimensionNeptunia/blanc_swimwear",
    "HyperdimensionNeptunia/vert_classic",
    "HyperdimensionNeptunia/vert_normal",
    "HyperdimensionNeptunia/vert_swimwear",
    "HyperdimensionNeptunia/nepgear",
    "HyperdimensionNeptunia/nepgear_extra",
    "HyperdimensionNeptunia/nepgearswim",
    "HyperdimensionNeptunia/histoire",
    "HyperdimensionNeptunia/histoirenohover"
  ];
  for (let config of nep_model) {
    allModelConfig[0].push(api + "model/" + config + "/index.json");
  }
  // load two slow models resource using api
  for (let modelLibrary of [
    [1, 86],
    [2, 62]
  ]) {
    let id = modelLibrary[0];
    for (let i = 0; i <= modelLibrary[1]; i++) {
      allModelConfig[id].push(api + "get/?id=" + id + "-" + i);
    }

  }
  // load bilibili
  fetch(cdn + "live2d-widget-model-bilibili@latest/assets/models.json").then(response => response.json()).then(result => {
    for ( let i of [3, 4]) {
      allModelConfig[i] = [];
      let type = 11 * (i - 1); // bilibili 22 or 33
      for (let config of result.list) {
        allModelConfig[i].push(cdn + "live2d-widget-model-bilibili@latest/assets/" + type + config.model.slice(9));
      }
    }
  });
}
