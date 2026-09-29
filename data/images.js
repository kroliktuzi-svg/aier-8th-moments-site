/*
 * 替换/增加图片时：
 * 1. 把原图放进对应 images 子文件夹；
 * 2. 在下方对应数组中写入相对路径。
 * kv 固定只读取第一张；其余三类每次各随机读取一张。
 */
window.AIER_IMAGES = {
  kv: ["./images/kv/main-kv.jpg"],
  sign: [
    "./images/sign/sign-01.jpg",
    "./images/sign/sign-02.jpg",
    "./images/sign/sign-03.jpg",
    "./images/sign/sign-04.jpg",
    "./images/sign/sign-05.jpg",
    "./images/sign/sign-06.jpg",
    "./images/sign/sign-07.jpg",
    "./images/sign/sign-08.jpg",
    "./images/sign/sign-09.jpg",
    "./images/sign/sign-10.jpg"
  ],
  wheel: [
    "./images/wheel/wheel-01.jpg",
    "./images/wheel/wheel-02.jpg",
    "./images/wheel/wheel-03.jpg"
  ],
  event: [
    "./images/event/event-01.svg",
    "./images/event/event-02.svg",
    "./images/event/event-03.svg"
  ]
};
