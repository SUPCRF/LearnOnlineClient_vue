<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="16" :offset="1">
        <div class="grid-content bg-purple">
          <video-player
            style=""
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
          ></video-player>
        </div>
      </el-col>
      <el-col :span="6" :offset="0.5" class="corse_title">
        <!-- <div style="margin-bottom: 20px"><el-link icon="el-icon-plus" :underline="false" type="primary" style="font-size: 16px">加入我的课程</el-link></div>
        <div class="grid-content bg-purple" style="margin-bottom: 20px">课程名称：{{course.courseName}}<br><br>开设时间：{{course.createTime}}</div>
        <div class="video-text video-text-title" style="margin-bottom: 20px">课程描述：<p>{{course.title}}</p></div> -->
        <el-card class="box-card" shadow="hover" style="margin-bottom: 20px">
          <span>{{ course.courseName }}</span>
          <el-button style="float: right; padding: 3px 0" type="text"
            ><el-link
              icon="el-icon-plus"
              :underline="false"
              type="primary"
              style="font-size: 16px"
              @click="addCourse"
              v-if="student"
              >加入我的课程</el-link
            ></el-button
          >
        </el-card>
        <el-card class="box-card" shadow="hover" style="margin-bottom: 20px">
          <span>开设时间：</span>
          <el-button style="float: right; padding: 3px 0" type="text">{{
            course.createTime
          }}</el-button>
        </el-card>
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>课程介绍</span>
          </div>
          <div class="text item">
            {{ course.title }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="16" :offset="1" class="messages">
        <div class="grid-content bg-purple-dark">
          <el-input
            placeholder="请输入内容"
            v-model="message"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-chat-dot-round"
              :disabled="flag"
              @click="onMessage"
              >发表留言</el-button
            >
          </el-input>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="16" :offset="1">
        <el-table
          empty-text="暂无留言"
          :data="tableData"
          :show-header="false"
          style="width: 100%"
        >
          <el-table-column prop="username" label="昵称" width="180">
          </el-table-column>
          <el-table-column prop="content" label="留言"> </el-table-column>
          <!-- <el-table-column prop="date" label="时间"> </el-table-column> -->
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import { Meta, Context } from "ea-router";
import axios from "axios";
import Cookies from "js-cookie";

@Context("id")
@Meta({
  title: "课程",
})
@Component()
export default class ShowCourse extends Vue {
  data() {
    return {
      student: false,
      flag: false,
      course: [],
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
      message: "",
      tableData: [],
    };
  }
  mounted() {
    console.log(this.$route.params.id);
    this.getCourseInfo();
    this.getMessageInfo();
  }
  created() {
    console.log(this.$store.state.type);
    console.log(localStorage.getItem("type"));
    console.log(this.$store.state.userInfo);
    console.log(this.$store.getType);
    let type = localStorage.getItem("type");
    if (type === "student") {
      this.student = true;
    } else {
      this.student = false;
    }
  }
  getCourseInfo() {
    let formdata = new FormData();
    formdata.append("courseId", this.$route.params.id + "");
    axios({
      url: "http://localhost:8000/api/course/courseInfo",
      method: "post",
      data: formdata,
      headers: {},
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.course = res.data.data;
        console.log(this.course);
        this.videoPic = res.data.data.coursePic;
        this.videoSrc = res.data.data.courseUrl;
        console.log(this.videoPic);
        console.log(this.videoSrc);
        console.log(this.playerOptions.sources.src);
        this.playerOptions["sources"][0]["src"] = res.data.data.courseUrl;
        this.playerOptions.poster = this.videoPic;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  addCourse() {
    let token = Cookies.get("token");
    console.log(token);
    if (token) {
      console.log(123);
      console.log(this.$store.state.userInfo);
      this.flag = false;
      console.log(this.message);
      let formdata = new FormData();
      formdata.append("courseId", this.$route.params.id);
      formdata.append("courseName", this.course.courseName);
      formdata.append("userid", this.$store.state.userInfo.userid);
      formdata.append("username", this.$store.state.userInfo.username);
      axios({
        url: "http://localhost:8000/api/student-course/save",
        method: "post",
        data: formdata,
        headers: { Authorization: token },
      })
        .then((res) => {
          console.log(res);
          // console.log(res.data.data);
          // this.tableData = res.data.data;
          // console.log(this.tableData);
          // this.getMessageInfo();
          this.$message({
            message: "课程添加成功",
            type: "success",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.$message({
        message: "请登录后尝试",
        type: "warning",
      });
    }
  }
  getMessageInfo() {
    let formdata = new FormData();
    formdata.append("courseId", this.$route.params.id);
    axios({
      url: "http://localhost:8000/api/course-content/all",
      method: "post",
      data: formdata,
      headers: {},
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
  onMessage() {
    let token = Cookies.get("token");
    console.log(token);
    if (token) {
      console.log(123);
      console.log(this.$store.state.userInfo.username);
      this.flag = false;
      console.log(this.message);
      let formdata = new FormData();
      formdata.append("courseId", this.$route.params.id);
      formdata.append("username", this.$store.state.userInfo.username);
      formdata.append("content", this.message);
      axios({
        url: "http://localhost:8000/api/course-content/save",
        method: "post",
        data: formdata,
        headers: { Authorization: token },
      })
        .then((res) => {
          console.log(res);
          // console.log(res.data.data);
          // this.tableData = res.data.data;
          // console.log(this.tableData);
          this.getMessageInfo();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.$message({
        message: "请登录后尝试",
        type: "warning",
      });
    }
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
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.video-text-title p {
  font-size: 16px;
  letter-spacing: 3px;
  line-height: 25px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
}

.corse_title {
  // border: 1px solid rgba($color: #000000, $alpha: 0.3);
  // padding-top: 10px;
  margin-left: 15px;
}
</style>