<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in exams" :key="item.id">
        <div class="grid-content bg-purple">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>
                <el-link type="success" :underline="false" v-if="item.exam == 1"
                  >已考试</el-link
                >
                <el-link type="danger" :underline="false" v-if="item.exam != 1"
                  >未考试</el-link
                >
              </span>
              <el-link
                icon="el-icon-medal"
                :underline="false"
                style="float: right; padding: 3px 0; margin-right: 5px"
                v-if="item.grades == -1"
                >待审阅</el-link
              >
              <el-link
                icon="el-icon-medal"
                :underline="false"
                style="float: right; padding: 3px 0; margin-right: 5px"
                v-else-if="item.grades == -2"
                >待考试</el-link
              >
              <el-link
                icon="el-icon-medal"
                :underline="false"
                style="float: right; padding: 3px 0; margin-right: 5px"
                v-else
                >{{ item.grades }}分</el-link
              >
            </div>
            <div class="text item">{{ item.courseName }}</div>
            <el-button
              class="exambtn"
              type="primary"
              size="mini"
              v-if="item.exam != 1"
              @click="gotoExam(item.courseId, item.exam)"
              >开始考试</el-button
            >
            <el-button
              class="exambtn"
              type="success"
              size="mini"
              v-if="item.exam == 1"
              @click="cattoExam(item.courseId, item.exam)"
              >查看考试</el-button
            >
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import { Meta } from "ea-router";
import Cookies from "js-cookie";
import axios from "axios";

@Meta({
  title: "个人中心",
})
@Component
export default class Exam extends Vue {
  data() {
    return {
      grades: 100,
      flag: false,
      exams: [],
    };
  }
  gotoExam(id, examFlag) {
    this.$confirm("考试, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        this.$router.push({
          path: `/center/showexam/${id}/${examFlag}`,
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消考试",
        });
      });
  }
  cattoExam(id, examFlag) {
    this.$router.push({
      path: `/center/showexam/${id}/${examFlag}`,
    });
  }
  mounted() {
    this.getExam();
  }
  getExam() {
    let token = Cookies.get("token");
    let formdata = new FormData();
    console.log(this.$store.state.userInfo);
    formdata.append("userId", this.$store.state.userInfo.userid);
    formdata.append("userName", this.$store.state.userInfo.username);
    axios({
      url: "http://localhost:8000/api/exam/centerExam",
      method: "post",
      data: formdata,
      headers: { Authorization: token },
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.exams = res.data.data;
        console.log(this.exams);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  margin-bottom: 20px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 86px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.el-card {
  height: 150px;
  cursor: pointer;
}

.blog_name {
  // display: inline-block;
  // display: block;
  // width: 40px;
  overflow: hidden;
  // background-color: aquamarine;
}

.icon-size {
  height: 110px;
  // background-color: aquamarine;
  font-size: 80px;
  color: cadetblue;
  // text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.exambtn {
  padding-bottom: 5px;
  float: right;
}
</style>