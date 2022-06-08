<template>
  <div>
    <el-form :model="form">
      <el-form-item label="课程名称">
        <el-input v-model="form.coursename" autocomplete="off"></el-input>
      </el-form-item>
      <el-row :gutter="20" class="row-bg">
        <el-col :span="16">
          <video-player
            style=""
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
          ></video-player>
        </el-col>
        <el-col :span="6" :offset="1" class="corse_title">
          <div class="doCourse">
            <el-button size="small" type="primary" @click="homework"
              >作业</el-button
            >
            <el-button size="small" type="primary" @click="exam"
              >考试</el-button
            >
            <el-button size="small" type="danger" @click="delcourse"
              >删除</el-button
            >
            <el-button size="small" type="success" @click="submit"
              >确定</el-button
            >
          </div>
          <div class="user_info">
            <el-table
              :header-cell-style="{ 'text-align': 'center' }"
              :data="tableData"
              style="width: 100%"
              max-height="300"
            >
              <el-table-column
                prop="studentName"
                align="center"
                label="名称"
                width="91"
              >
              </el-table-column>
              <el-table-column
                prop="homework"
                align="center"
                label="作业"
                width="92"
              >
                <template scope="scope">
                  <span v-if="scope.row.homework == 1">已完成</span>
                  <span v-else style="color: red">未完成</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="exam"
                align="center"
                label="考试"
                width="92"
              >
                <template scope="scope">
                  <span v-if="scope.row.exam == 1">已完成</span>
                  <span v-else style="color: red">未完成</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-form-item label="课程描述">
        <el-input
          type="textarea"
          v-model="form.title"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Vue, Component, Watch } from "vue-property-decorator";
import { Meta, Context } from "ea-router";
import axios from "axios";
import Cookies from "js-cookie";

@Context("id")
@Meta({
  title: "个人中心",
})
@Component()
export default class EditCourse extends Vue {
  data() {
    return {
      videoSrc: "",
      videoPic: "",
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", // 类型
            src: this.videoSrc, // url地址
          },
        ],
        poster: "", // 封面地址
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
      form: {
        coursename: "",
        title: "",
      },
      newForm: {},
      fileList: [],
      multiple: true,
      formData: "",
      tableData: [],
    };
  }
  mounted() {
    this.getCourseInfo();
    this.getStudentCourseInfo();
  }
  getCourseInfo() {
    let token = Cookies.get("token");
    let formdata = new FormData();
    formdata.append("courseId", this.$route.params.id);
    axios({
      url: "http://localhost:8000/api/course/courseInfo",
      method: "post",
      data: formdata,
      headers: { Authorization: token },
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.form.coursename = res.data.data.courseName;
        this.form.title = res.data.data.title;
        this.playerOptions["sources"][0]["src"] = res.data.data.courseUrl;
        this.playerOptions.poster = res.data.data.coursePic;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  getStudentCourseInfo() {
    let token = Cookies.get("token");
    let formdata = new FormData();
    formdata.append("courseId", this.$route.params.id);
    axios({
      url: "http://localhost:8000/api/student-course/all",
      method: "post",
      data: formdata,
      headers: { Authorization: token },
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.tableData = res.data.data;
        console.log(this.tableData);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  delcourse() {
    this.$confirm("此操作将永久删除该课程, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        console.log(this.$route.params.id);
        let token = Cookies.get("token");
        let formdata = new FormData();
        formdata.append("courseid", this.$route.params.id);
        axios({
          url: "http://localhost:8000/api/course/deleteById",
          method: "post",
          data: formdata,
          headers: { Authorization: token },
        })
          .then((res) => {
            console.log(res);
            console.log(res.data.data);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            location.reload();
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
  }

  submit() {
    let formData = new FormData();
    let token = Cookies.get("token");
    formData.append("coursename", this.form.coursename);
    formData.append("courseid", this.$route.params.id);
    formData.append("userid", this.$store.state.userInfo.userid);
    let type = localStorage.getItem("type");
    formData.append("usertype", type);
    formData.append("title", this.form.title);
    axios({
      url: "http://localhost:8000/api/course/updateInfoTo",
      method: "post",
      data: formData,
      headers: {
        Authorization: token,
      },
    }).then((res) => {
      console.log(res);
      if (res.data.code == 200) {
        console.log(res);
        // this.fileList.onSuccess();
        this.$message.success("success");
        this.$router.push("/center/course");
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
    });
  }

  homework() {
    let formdata = new FormData();
    formdata.append("courseId", this.$route.params.id);
    this.$router.push("/center/homeworkedit/" + this.$route.params.id);
  }
  exam() {
    let formdata = new FormData();
    formdata.append("courseId", this.$route.params.id);
    this.$router.push("/center/examedit/" + this.$route.params.id);
  }
}
</script>

<style>
.doCourse {
  /* background-color: aquamarine; */
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}
.user_info {
  width: 100%;
  margin: auto;
}
.user_info /deep/ .el-table--fit {
  padding: 0px;
}
.user_info /deep/ .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}

.user_info /deep/ .el-table tr {
  background-color: transparent !important;
}
.user_info /deep/ .el-table--enable-row-transition .el-table__body td,
.el-table .cell {
  background-color: transparent;
}
.el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0px;
}
</style>
