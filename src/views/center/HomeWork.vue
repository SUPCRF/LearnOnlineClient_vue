<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in homeworks" :key="item.id">
        <div class="grid-content bg-purple">
          <a :href="'/center/showhomework/'+item.courseId+'/'+item.homework">
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>
                  <el-link type="success" :underline="false" v-if="item.homework == 1"
                    >已完成</el-link
                  >
                  <el-link type="danger" :underline="false" v-if="item.homework != 1"
                    >未完成</el-link
                  >
                </span>
              </div>
              <div class="text item">
                {{item.courseName}}
              </div>
            </el-card>
          </a>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import { Meta } from "ea-router";
import Cookies from 'js-cookie'
import axios from 'axios'

@Meta({
  title: "个人中心",
})
@Component
export default class HomeWork extends Vue {
  data() {
    return {
      flag: false,
      homeworks: [],
    };
  }
  mounted() {
    this.getHomework();
  }
  getHomework() {
    let token = Cookies.get("token");
    let formdata = new FormData();
    console.log(this.$store.state.userInfo);
    formdata.append("userId", this.$store.state.userInfo.userid);
    formdata.append("userName", this.$store.state.userInfo.username);
    axios({
      url: "http://localhost:8000/api/homework/centerHomework",
      method: "post",
      data: formdata,
      headers: { Authorization: token },
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.homeworks = res.data.data;
        console.log(this.homeworks);
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
</style>