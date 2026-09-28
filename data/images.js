/*
 * 替换/增加图片时：
 * 1. 把原图放进对应 images 子文件夹；
 * 2. 在下方对应数组中写入相对路径。
 * kv 固定只读取第一张；其余三类每次各随机读取一张。
 */
window.AIER_IMAGES = {
  kv: ["./images/kv/main-kv.jpg"],
  sign: [
    "./images/sign/sign-01.svg",
    "./images/sign/sign-02.svg",
    "./images/sign/sign-03.svg"
  ],
  wheel: [
    "./images/wheel/wheel-01.svg",
    "./images/wheel/wheel-02.svg",
    "./images/wheel/wheel-03.svg"
  ],
  event: [
    "./images/event/event-01.svg",
    "./images/event/event-02.svg",
    "./images/event/event-03.svg"
  ]
};
