(function () {
  "use strict";

  var navButtons = document.querySelectorAll(".nav-button");
  var saveButton = document.getElementById("savePoster");
  var closeButton = document.getElementById("closePoster");
  var posterPanel = document.getElementById("posterPanel");
  var canvas = document.getElementById("posterCanvas");
  var saveStatus = document.getElementById("saveStatus");
  var logo = new Image();
  var posterReady = false;

  logo.src = "./assets/logo.png";

  function setActiveButton(activeButton) {
    var i;
    for (i = 0; i < navButtons.length; i += 1) {
      navButtons[i].classList.remove("is-active");
    }
    activeButton.classList.add("is-active");
  }

  function scrollToSection(target) {
    window.scrollTo(0, target.offsetTop - 82);
  }

  function goToSection(event) {
    var button = event.currentTarget;
    var target = document.getElementById(button.getAttribute("data-target"));
    setActiveButton(button);
    if (target) {
      scrollToSection(target);
    }
  }

  function roundedRect(context, x, y, width, height, radius, fill, stroke) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
    if (fill) {
      context.fillStyle = fill;
      context.fill();
    }
    if (stroke) {
      context.strokeStyle = stroke;
      context.lineWidth = 4;
      context.stroke();
    }
  }

  function drawTag(context, text, x, y, width) {
    roundedRect(context, x, y, width, 46, 23, "#fff7df", "#25211d");
    context.fillStyle = "#25211d";
    context.font = "700 22px sans-serif";
    context.textAlign = "center";
    context.fillText(text, x + width / 2, y + 31);
  }

  function drawPoster() {
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, 720, 960);
    context.fillStyle = "#fffaf2";
    context.fillRect(0, 0, 720, 960);

    context.fillStyle = "#e84135";
    context.fillRect(0, 0, 720, 390);
    context.fillStyle = "rgba(255,255,255,.13)";
    context.beginPath();
    context.arc(660, 330, 130, 0, Math.PI * 2);
    context.fill();

    roundedRect(context, 54, 54, 118, 118, 24, "#ffffff", "#25211d");
    if (logo.complete && logo.naturalWidth) {
      context.drawImage(logo, 61, 61, 104, 104);
    }

    context.fillStyle = "#ffffff";
    context.textAlign = "left";
    context.font = "800 25px sans-serif";
    context.fillText("COOKIE CONSENT, TRIMMED.", 54, 220);
    context.font = "900 70px sans-serif";
    context.fillText("CookieTrim", 50, 300);
    context.font = "800 38px sans-serif";
    context.fillText("饼干退退退 🍪", 54, 355);

    context.fillStyle = "#25211d";
    context.font = "900 42px sans-serif";
    context.fillText("必要的留下，其余退退退。", 52, 465);
    context.fillStyle = "#726a62";
    context.font = "500 25px sans-serif";
    context.fillText("自动处理常见 Cookie 横幅", 53, 512);
    context.fillText("尽量优先选择“仅必要”", 53, 552);

    drawTag(context, "开源免费", 52, 604, 142);
    drawTag(context, "本地运行", 210, 604, 142);
    drawTag(context, "零遥测", 368, 604, 126);
    drawTag(context, "非盈利", 510, 604, 126);

    roundedRect(context, 52, 690, 616, 174, 20, "#25211d", "#25211d");
    context.fillStyle = "#d5cdc4";
    context.font = "600 22px sans-serif";
    context.fillText("在 GitHub 搜索", 82, 743);
    context.fillStyle = "#ffffff";
    context.font = "900 43px sans-serif";
    context.fillText("CookieTrim", 82, 800);
    context.fillStyle = "#d5cdc4";
    context.font = "600 22px sans-serif";
    context.fillText("作者  rinrin583", 82, 838);

    context.fillStyle = "#726a62";
    context.textAlign = "center";
    context.font = "500 18px sans-serif";
    context.fillText("个人开发 · 开源项目 · 安装前请核对权限与来源", 360, 919);
    posterReady = true;
  }

  function showPoster() {
    drawPoster();
    posterPanel.classList.add("is-visible");
    scrollToSection(posterPanel);
  }

  function setSaving(isSaving) {
    saveButton.disabled = isSaving;
    saveButton.textContent = isSaving ? "正在保存…" : "生成并保存到相册";
  }

  function showMessage(message) {
    saveStatus.textContent = message;
  }

  function saveWithMiniTool(dataUrl) {
    var miniTool = window.xhs && window.xhs.miniTool;
    if (!miniTool || typeof miniTool.saveImageToPhotosAlbum !== "function") {
      setSaving(false);
      showMessage("宣传卡已生成；请在小红书小工具内保存到相册。");
      return;
    }

    if (typeof miniTool.writeTempFile === "function") {
      miniTool.writeTempFile({ data: dataUrl }).then(function (result) {
        return miniTool.saveImageToPhotosAlbum({ filePath: result.filePath });
      }).then(function () {
        setSaving(false);
        showMessage("已保存到相册，可以去发笔记啦！");
      }).catch(function () {
        setSaving(false);
        showMessage("保存没有完成，请检查相册权限后重试。");
      });
      return;
    }

    miniTool.saveImageToPhotosAlbum({ filePath: dataUrl }).then(function () {
      setSaving(false);
      showMessage("已保存到相册，可以去发笔记啦！");
    }).catch(function () {
      setSaving(false);
      showMessage("保存没有完成，请检查相册权限后重试。");
    });
  }

  function createAndSavePoster() {
    setSaving(true);
    showPoster();
    if (!posterReady) {
      setSaving(false);
      showMessage("宣传卡生成失败，请重新打开工具后再试。");
      return;
    }
    saveWithMiniTool(canvas.toDataURL("image/png"));
  }

  function closePoster() {
    posterPanel.classList.remove("is-visible");
    document.getElementById("top").scrollIntoView();
  }

  var i;
  for (i = 0; i < navButtons.length; i += 1) {
    navButtons[i].addEventListener("click", goToSection);
  }
  saveButton.addEventListener("click", createAndSavePoster);
  closeButton.addEventListener("click", closePoster);
  logo.addEventListener("load", drawPoster);
}());
