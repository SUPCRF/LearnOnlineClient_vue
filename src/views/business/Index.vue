<template>
  <div>
    <el-carousel :interval="3000" type="card" height="300px">
      <el-carousel-item v-for="item in imgList" :key="item.url">
        <img :src="item.url" class="carousel-images" alt />
      </el-carousel-item>
    </el-carousel>

    <el-divider content-position="left">最新课程</el-divider>
    <el-divider content-position="right">
      <el-link :href="'/business/course'" :underline="false"
        >更多<i class="el-icon-right"></i
      ></el-link>
    </el-divider>
    <div class="index-container1">
      <el-row
        :gutter="20"
        class="row-bg"
        justify="center"
        style="margin-bottom: 30px"
      >
        <el-col
          :span="6"
          style="margin-bottom: 30px"
          v-for="item in courses"
          :key="item.id"
        >
          <el-card shadow="hover" :body-style="{ padding: '0px' }">
            <img :src="item.coursePic" class="image" />
            <div style="padding: 14px; text-align: center">
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.courseName"
                placement="top"
              >
                <span class="courseName_text"> {{ item.courseName }} </span>
              </el-tooltip>
              <!-- <span>{{item.courseName}}</span> -->
              <span style="float: right; margin-right: 5px"
                ><a :href="'/business/course/showcourse/'+item.courseId"
                  >进入课程<i class="el-icon-right"></i></a
              ></span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-divider content-position="left">最新博客</el-divider>
    <el-divider content-position="right">
      <el-link :href="'/business/blog'" :underline="false"
        >更多<i class="el-icon-right"></i
      ></el-link>
    </el-divider>
    <div class="index-container2">
      <div class="home">
        <el-row id="artList" type="flex" justify="space-around" v-for="temp in blogs" :key="temp.id">
          <el-col :span="24">
            <el-row class="art-item">
              <el-card shadow="hover">
                <h5>
                  <router-link
                    :to="'/business/forum/showblog/'+temp.blogId"
                    tag="span"
                    class="art-title"
                    >{{temp.blogName}}</router-link
                  >
                </h5>
                <el-row
                  style="margin-top: 20px"
                  class="art-info d-flex align-items-center justify-content-start"
                >
                  <div class="art-time">
                    <i class="el-icon-time"></i>：{{temp.createTime}}
                  </div>
                </el-row>
                <el-row class="art-body">
                  <div class="side-img hidden-sm-and-down">
                    <img class="art-banner" :src="temp.blogPic" />
                  </div>
                  <div class="side-abstract">
                    <div class="art-abstract">
                      {{temp.title}}
                    </div>
                    <div class="art-more">
                      <router-link :to="'/business/forum/showblog/'+temp.blogId" tag="span">
                        <el-button plain>阅读</el-button>
                      </router-link>
                      <div class="view"><i class="el-icon-user-solid"></i>{{temp.userName}}</div>
                    </div>
                  </div>
                </el-row>
              </el-card>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import { Meta } from "ea-router";
import axios from "axios";

@Meta({
  title: "首页",
})
@Component()
export default class Index extends Vue {
  data() {
    return {
      currentDate: new Date(),
      imgList: [
        { url: require("@/assets/images/1.jpg") },
        { url: require("@/assets/images/2.jpg") },
        { url: require("@/assets/images/3.jpg") },
        { url: require("@/assets/images/4.jpg") },
        { url: require("@/assets/images/5.png") },
        { url: require("@/assets/images/6.jpg") },
      ],
      courses: [],
      blogs: [],
    };
  }
  mounted() {
    this.getCourse();
    this.getBlog();
  }
  getCourse() {
    axios({
      url: "http://localhost:8000/api/course/client",
      method: "get",
      headers: {},
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.courses = res.data.data;
        console.log(this.courses);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getBlog() {
    axios({
      url: "http://localhost:8000/api/blog/client",
      method: "get",
      headers: {},
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.blogs = res.data.data;
        console.log(this.blogs);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 24px;
  opacity: 0.75;
  line-height: 300px;
  text-align: center;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.carousel-images {
  width: 100%;
  height: inherit;
}

.index-container1,
.index-container2 {
  width: 90%;
  margin: 0 auto;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

html,
body {
  margin: 0;
  padding: 0;
}
[v-cloak] {
  display: none;
}
.d-flex {
  display: flex !important;
}
.mr-auto {
  margin-right: auto !important;
}
.ml-auto {
  margin-left: auto !important;
}
.align-items-center {
  align-items: center !important;
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

#side .item {
  margin-bottom: 30px;
}

.art-item {
  margin-bottom: 30px;
  position: relative;
}

.art-item .star {
  width: 60px;
  height: 60px;
  position: absolute;
  top: 0;
  right: 0;
}

img.tag {
  width: 16px;
  height: 16px;
}

.art-title {
  border-left: 3px solid #f56c6c;
  padding-left: 5px;
  cursor: pointer;
}

.art-title:hover {
  padding-left: 10px;
  color: #409eff;
}

.art-time {
  margin-right: 20px;
}

.art-body {
  display: flex;
  padding: 10px 0;
}

.side-img {
  height: 150px;
  width: 270px;
  overflow: hidden;
  margin-right: 10px;
}

img.art-banner {
  width: 100%;
  height: 100%;
  transition: all 0.6s;
}

img.art-banner:hover {
  transform: scale(1.4);
}

.side-abstract {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.art-abstract {
  flex: 1;
  color: #aaa;
}

.art-more {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.art-more .view {
  color: #aaa;
}
h5 {
  font-size: 18px;
}
.pagination {
  background-color: #f9f9f9;
}
.courseName_text {
  display: inline-block;
  /* background-color: aqua; */
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>