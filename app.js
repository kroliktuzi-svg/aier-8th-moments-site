(function () {
  "use strict";

  const copyText = document.getElementById("copyText");
  const copyButton = document.getElementById("copyButton");
  const refreshButton = document.getElementById("refreshButton");
  const gallery = document.getElementById("gallery");
  const toast = document.getElementById("toast");
  const saveSheet = document.getElementById("saveSheet");
  const saveSheetBackdrop = document.getElementById("saveSheetBackdrop");
  const saveSheetClose = document.getElementById("saveSheetClose");
  const savePreview = document.getElementById("savePreview");
  const saveSheetTitle = document.getElementById("saveSheetTitle");

  const labels = ["固定主KV", "抽签活动图", "转盘活动图", "现场活动图"];
  let currentCopy = "";
  let lastIndexes = { copy: -1, sign: -1, wheel: -1, event: -1 };
  let toastTimer;

  function randomIndex(length, previous) {
    if (length <= 1) return 0;
    let value = previous;
    while (value === previous) {
      if (window.crypto && window.crypto.getRandomValues) {
        const buffer = new Uint32Array(1);
        window.crypto.getRandomValues(buffer);
        value = buffer[0] % length;
      } else {
        value = Math.floor(Math.random() * length);
      }
    }
    return value;
  }

  function choose(list, key) {
    const index = randomIndex(list.length, lastIndexes[key]);
    lastIndexes[key] = index;
    return list[index];
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 1800);
  }

  function renderCopy() {
    const middle = choose(window.AIER_COPY.middleLines, "copy");
    currentCopy = [window.AIER_COPY.firstLine, middle, window.AIER_COPY.lastLine].join("\n");
    copyText.textContent = currentCopy;
  }

  function renderImages() {
    const images = [
      window.AIER_IMAGES.kv[0],
      choose(window.AIER_IMAGES.sign, "sign"),
      choose(window.AIER_IMAGES.wheel, "wheel"),
      choose(window.AIER_IMAGES.event, "event")
    ];

    gallery.innerHTML = images.map(function (src, index) {
      const eager = index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
      return (
        '<figure class="image-card' + (index === 0 ? ' image-card--kv' : '') + '">' +
          '<div class="image-media">' +
            '<img src="' + src + '" alt="' + labels[index] + '" ' + eager + ' draggable="false" />' +
            '<span class="image-index" aria-hidden="true">' + (index + 1) + '</span>' +
          '</div>' +
          '<figcaption>' + labels[index] + '</figcaption>' +
          '<button class="image-save-button" type="button" data-src="' + src + '" data-index="' + index + '">' +
            '<span aria-hidden="true">↓</span> 保存第' + (index + 1) + '张' +
          '</button>' +
        '</figure>'
      );
    }).join("");
  }

  function fileExtension(src) {
    const clean = src.split("?")[0].split("#")[0];
    const match = clean.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1].toLowerCase() : "jpg";
  }

  function openSaveSheet(src, index) {
    savePreview.src = src;
    savePreview.alt = labels[index];
    saveSheetTitle.textContent = "长按保存第" + (index + 1) + "张图片";
    saveSheet.hidden = false;
    document.body.classList.add("save-sheet-open");
    saveSheetClose.focus();
  }

  function closeSaveSheet() {
    saveSheet.hidden = true;
    savePreview.removeAttribute("src");
    document.body.classList.remove("save-sheet-open");
  }

  async function saveImage(src, index) {
    const userAgent = navigator.userAgent || "";
    const needsLongPress = /MicroMessenger|iPhone|iPad|iPod/i.test(userAgent);
    if (needsLongPress) {
      openSaveSheet(src, index);
      return;
    }

    try {
      const response = await fetch(src, { cache: "force-cache" });
      if (!response.ok) throw new Error("image fetch failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "aier-8th-" + (index + 1) + "." + fileExtension(src);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      showToast("已开始保存第" + (index + 1) + "张图片");
    } catch (error) {
      openSaveSheet(src, index);
    }
  }

  async function copyCurrentText() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentCopy);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = currentCopy;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        const copied = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!copied) throw new Error("copy failed");
      }
      showToast("复制成功");
    } catch (error) {
      showToast("复制失败，请长按文案复制");
    }
  }

  function generate() {
    renderCopy();
    renderImages();
  }

  copyButton.addEventListener("click", copyCurrentText);
  gallery.addEventListener("click", function (event) {
    const button = event.target.closest(".image-save-button");
    if (!button) return;
    saveImage(button.dataset.src, Number(button.dataset.index));
  });
  saveSheetClose.addEventListener("click", closeSaveSheet);
  saveSheetBackdrop.addEventListener("click", closeSaveSheet);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !saveSheet.hidden) closeSaveSheet();
  });
  refreshButton.addEventListener("click", function () {
    refreshButton.classList.remove("is-spinning");
    void refreshButton.offsetWidth;
    refreshButton.classList.add("is-spinning");
    generate();
    copyText.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  generate();
})();
