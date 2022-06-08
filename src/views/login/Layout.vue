<template>
  <div class="sign_reg-container">
    <div class="carousel-form" :inline="true">
      <el-carousel :interval="5000" arrow="always" height="430px">
        <el-carousel-item v-for="item in carouselImages" :key="item.url">
          <el-image :src="item.url" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="sign_reg-form">
      <router-view />
    </div>
  </div>
</template>

<script>
import "@/assets/style/reset.scss";
import "@/assets/style/_variable.scss";

export default {
  data() {
    return {
      carouselImages: [
        { url: require("@/assets/images/1.jpg") },
        { url: require("@/assets/images/2.jpg") },
        { url: require("@/assets/images/3.jpg") },
        { url: require("@/assets/images/4.jpg") },
        { url: require("@/assets/images/5.png") },
        { url: require("@/assets/images/6.jpg") },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.sign_reg-container {
  height: 540px;
  width: 1150px;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #eaecf0;
  -webkit-appearance: none;
  border-radius: 10px;
  .carousel-form {
    width: 680px;
    margin-top: 60px;
    margin-left: 22px;
    border-radius: 10px;
    float: left;
    background-color: #ced3dc;
    .el-carousel__item .el-image {
      border-radius: 10px;
      height: 100%;
    }
  }
  .sign_reg-form {
    width: 400px;
    height: 430px;
    background-color: white;
    float: left;
    margin: 60px 0px 0px 22px;
    border-radius: 10px;
    padding: 10px 25px;
  }
}
</style>
