<template>
  <div class="container">
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
              <!-- <span>{{ item.courseName }}</span> -->
              <span style="float: right; margin-right: 5px"
                ><a :href="'/business/course/showcourse/' + item.courseId"
                  >进入课程<i class="el-icon-right"></i></a
              ></span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import { Meta } from "ea-router";
import axios from 'axios'

@Meta({
  title: "课程",
})
@Component
export default class Index extends Vue {
  data() {
    return {
      courses: [],
    };
  }
  mounted() {
    this.getCourse();
  }
  getCourse() {
    axios({
      url: "http://localhost:8000/api/course/clientAll",
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
.courseName_text {
  display: inline-block;
  /* background-color: aqua; */
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>