<template>
  <div  style="height: 1px; overflow:hidden; opacity: 0">
    <div id="videoArea"></div>
    <img :src="imgSrc" />
    <div>
      <div @click="cutPicture">截图 {{ videoW }}</div>
    </div>
    <canvas
      id="myCanvas"
      :width="videoW + 'px'"
      :height="videoH + 'px'"
    ></canvas>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    fileObj: {
      type: Object,
      default: {},
      require: true,
    },
  },
  watch: {
    fileObj: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal);
        this.onClean();
        this.videoW = newVal.videoW;
        this.videoH = newVal.videoH;
        this.cutPicture();
      },
    },
  },
  data() {
    return {
      imgSrc: "",
      videoW: "",
      videoH: "",
      uploadUrl: process.env.BASE_API + "v1/general/resource/upload_video", // 截取后上传的地址
    };
  },
  methods: {
    onClean() {
      this.imgSrc = "";
      this.videoW = "";
      this.videoH = "";
    },
    cutPicture() {
      let area = document.querySelector("#videoArea");

      area.innerHTML = `
        <video src="${this.fileObj.src}" controls style="width: ${this.videoW}px"></video>
      `;

      const that = this;
      setTimeout(() => {
        var v = document.querySelector("video");
        let canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        ctx.drawImage(v, 0, 0, this.videoW, this.videoH);
        var oGrayImg = canvas.toDataURL("image/jpeg");
        that.imgSrc = oGrayImg;

        var arr = oGrayImg.split(","),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        var file = new File([u8arr], "videoimg.jpg", { type: mime });
        console.info(file); // 注意: 如果你不需上传,这里就可以拿到图片的ile了
        that.update(file); 
      }, 1000);
    },
    update(file) {
      // 上传照片
      // 这里很简单 就是上传的逻辑 根据自己需要进行修改
      let self = this;
      let param = new FormData();
      param.append("resourceFile", file); 
      let config = {
        headers: { "Content-Type": "multipart/form-data", ...self.headers },
      }; // 添加请求头
      axios.post(self.uploadUrl, param, config).then((res) => {
        if (res.data.code === 200) {
          self.$emit("uploadSuccess", { imgUrl: res.data.data }); // 回传数据!
        }
      });
    },
  },
};
</script>