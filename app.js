(function () {
  "use strict";

  const copyText = document.getElementById("copyText");
  const copyButton = document.getElementById("copyButton");
  const refreshButton = document.getElementById("refreshButton");
  const gallery = document.getElementById("gallery");
  const toast = document.getElementById("toast");

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
        '<figure class="image-card">' +
          '<a href="' + src + '" target="_blank" rel="noopener" aria-label="查看第' + (index + 1) + '张原图">' +
            '<img src="' + src + '" alt="' + labels[index] + '" ' + eager + ' draggable="false" />' +
            '<span class="image-index" aria-hidden="true">' + (index + 1) + '</span>' +
          '</a>' +
          '<figcaption>' + labels[index] + '</figcaption>' +
        '</figure>'
      );
    }).join("");
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
  refreshButton.addEventListener("click", function () {
    refreshButton.classList.remove("is-spinning");
    void refreshButton.offsetWidth;
    refreshButton.classList.add("is-spinning");
    generate();
    copyText.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  generate();
})();
