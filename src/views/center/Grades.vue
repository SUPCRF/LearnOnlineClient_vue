<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in courses" :key="item.id">
        <div class="grid-content bg-purple">
          <el-card
            class="box-card"
            shadow="hover"
            :body-style="{ padding: '0px' }"
          >
            <div slot="header" class="clearfix">
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.courseName"
                placement="top"
              >
                <span class="courseName_text"> {{ item.courseName }} </span>
              </el-tooltip>
              <el-link
                icon="el-icon-right"
                :underline="false"
                style="float: right; padding: 3px 0; margin-right: 5px"
                @click="goToExam(item.courseId)"
                >进入</el-link
              >
            </div>
            <div class="text item images-card">
              <img :src="item.coursePic" class="image" />
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import { Meta } from "ea-router";
import axios from "axios";
import Cookies from "js-cookie";

@Meta({
  title: "个人中心",
})
@Component()
export default class Grades extends Vue {
  data() {
    return {
      courses: [],
    };
  }
  mounted() {
    this.getCourse();
  }
  getCourse() {
    let formData = new FormData();
    let token = Cookies.get("token");
    formData.append("userId", this.$store.state.userInfo.userid);
    let type = localStorage.getItem("type");
    formData.append("userType", type);
    axios({
      url: "http://localhost:8000/api/course/centerAll",
      method: "post",
      data: formData,
      headers: { Authorization: token },
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
  goToExam(index) {
    console.log(index);
    this.$router.push("/center/gradeslist/" + index);
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
  height: 200px;
}

.blog_name {
  // display: inline-block;
  // display: block;
  // width: 40px;
  overflow: hidden;
  // background-color: aquamarine;
}

.icon-size {
  height: 170px;
  // background-color: aquamarine;
  font-size: 100px;
  color: cadetblue;
  // text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-size:hover {
  // height: 110px;
  font-size: 120px;
}

.images-card img {
  width: 100%;
  display: block;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-position: -50px 0px;
  background-size: 300px 200px;
}

.courseName_text {
  display: inline-block;
  // background-color: aqua;
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>