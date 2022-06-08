<template>
  <div class="container">
    <div class="home">
      <el-row id="artList" type="flex" justify="space-around">
        <el-col :span="16">
          <el-row class="art-item" v-for="temp in blogs" :key="temp.id">
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
            <img class="star" src="@/assets/images/star.png" />
          </el-row>
          <!-- <div class="block pagination">
            <el-pagination background layout="prev, pager, next" :total="50">
            </el-pagination>
          </div> -->
        </el-col>
        <el-col :span="6" class="hidden-sm-and-down" id="side">
          <div class="item cale_css">
            <Calendar
              ref="Calendar"
              :markDate="arr2"
              v-on:changeMonth="changeDate"
            ></Calendar>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import { Meta } from "ea-router";
import Calendar from "vue-calendar-component";
import tag from "@/components/tag";
import axios from 'axios'

@Meta({
  title: "论坛",
})
@Component({
  components: {
    tag,
    Calendar,
  },
})
export default class Index extends Vue {
  data() {
    return {
      arr2: [],
      blogs: [],
    }
  }
  mounted() {
    this.getBlog();
  }
  changeDate(data) {
    //console.log(data); //左右点击切换月份
  }
  getBlog() {
    axios({
      url: "http://localhost:8000/api/blog/clientAll",
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
.item {
  position: fixed; /*固定位置*/
  top: 80px;
  width: 350px;
  right: 4%;
  z-index: 9999; /*设置优先级显示，保证不会被覆盖*/
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
.cale_css {
  /* width: 80%; */
}
</style>

<style scoped>
/* 日历组件 */
.wh_content_all{
  background-color: #ffffff !important;
}
  
.wh_top_changge li{
  color: rgb(50, 50, 51) !important;
  font-size: 0.18rem !important;
}
  
.wh_jiantou1{
  width: 0.1rem !important;
  height: 0.1rem !important;
  border-top: 2px solid rgb(50, 50, 51) !important;
  border-left: 2px solid rgb(50, 50, 51) !important;
}
  
.wh_jiantou2{
  width: 0.1rem !important;
  height: 0.1rem !important;
  border-top: 2px solid rgb(50, 50, 51) !important;
  border-right: 2px solid rgb(50, 50, 51) !important;
}
  
.wh_top_tag{ 
  font-size: 0.16rem !important;
}
  
.wh_item_date{
   font-size: 0.2rem !important;
}
  
.wh_content_item,
.wh_content_item_tag{
  width: 14.285% !important;
  color: rgb(50, 50, 51) !important;
}
  
.wh_content_item .wh_isToday{
  background: transparent !important;
}
  
.wh_content_item .wh_chose_day{
  background: #ee0a24 !important;
  color: #fff !important;
}
  
.wh_content{
  padding: 0 0.1rem !important;
}
  
.wh_container{
  position: relative;
}
  
.wh_container::after{
  content: '';
  width: 1px;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  background: #dddddd;;
}
</style>
