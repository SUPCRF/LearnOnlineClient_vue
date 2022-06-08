<template>
  <div class="container">
    <img class="f-img" src="../assets/images/study.png" />
    <img class="f-img1" src="../assets/images/study1.png" />
    <img class="f-img2" src="../assets/images/study2.png" />

    <div class="link-text">
      <span><el-link :href="'/business/about'" :underline="false" type="info">简介</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link :href="'/business/about'" :underline="false" type="info">联系我们</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link :href="'/business/about'" :underline="false" type="info">关于</el-link></span>
    </div>

    <div class="link-info" style="font-size: 12px">Copyright/© 2020-2021 supcrf 程如飞</div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
}

img {
  width: 7%;
  max-width: 100px;
}

.f-img {
  position: absolute;
  top: 20%;
  left: 10%;
}

.f-img1 {
  position: absolute;
  top: 20%;
  left: 20%;
}

.f-img2 {
  position: absolute;
  top: 20%;
  left: 30%;
}

.link-text {
  position: absolute;
  top: 45%;
  left: 62%;
}

.link-info {
  position: absolute;
  top: 69%;
  left: 58%;
  color: white;
}
</style>