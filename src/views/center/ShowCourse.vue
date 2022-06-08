<template>
  <div>
    <el-row :gutter="20" type="flex" justify="center">
      <el-col :span="22">
        <div class="grid-content bg-purple">
          <div class="video-nav">
            <span> {{ course.courseName }} </span>
            <el-badge
              :is-dot="exam"
              class="item"
              style="float: right; padding: 3px 0"
            >
              <a v-if="examFlag == 1" :href="'/center/showexam/' + course.courseId+'/'+examFlag">考试</a>
              <a v-if="examFlag != 1" @click="goExam">考试</a>
            </el-badge>
            <el-badge
              :is-dot="homework"
              class="item"
              style="float: right; padding: 3px 0; margin-right: 10px"
              ><a
                :href="
                  '/center/showhomework/' + course.courseId + '/' + homeworkFlag
                "
                >作业</a
              ></el-badge
            >
          </div>
        </div>
      </el-col>
    </el-row>
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
      <el-col :span="6" :offset="0">
        <div class="grid-content">课程介绍</div>
        <div>{{ course.title }}</div>
      </el-col>
    </el-row>
    <!-- <el-row type="flex" justify="center">
      <el-col :span="22" class="messages">
        <div class="grid-content bg-purple-dark">
          <el-input
            placeholder="请输入内容"
            v-model="message"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-chat-dot-round"
              @click="onMessage"
              >发表留言</el-button
            >
          </el-input>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" class="messages-text">
      <el-col :span="22">
        <div class="grid-content bg-purple-dark">
          <el-table :data="tableData" :show-header="false" style="width: 100%">
            <el-table-column prop="username" label="昵称" width="180">
            </el-table-column>
            <el-table-column prop="messages" label="留言"> </el-table-column>
            <el-table-column prop="date" label="时间"> </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row> -->
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
import Cookies from "js-cookie";
import axios from "axios";

@Context("id")
@Meta({
  title: "个人中心",
})
@Component()
export default class ShowCourse extends Vue {
  data() {
    return {
      exam: true,
      homework: true,
      homeworkFlag: 0,
      examFlag: 0,
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
            src: "", // url地址
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
      course: {},
      studentCourse: {},
    };
  }
  mounted() {
    console.log(this.$route.params.id);
    this.getCourseInfo();
    this.getStudentCourseInfo();
    this.getMessageInfo();
  }
  created() {
    console.log();
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
        this.course = res.data.data;
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
    formdata.append("userId", this.$store.state.userInfo.userid);
    formdata.append("username", this.$store.state.userInfo.username);
    axios({
      url: "http://localhost:8000/api/student-course/studentAll",
      method: "post",
      data: formdata,
      headers: { Authorization: token },
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.studentCourse = res.data.data
        let homework = res.data.data.homework;
        let exam = res.data.data.exam;
        console.log(homework);
        if (homework == 1) {
          this.homework = false;
          this.homeworkFlag = 1;
        }
        console.log(exam);
        if (exam == 1) {
          this.exam = false;
          this.examFlag = 1;
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
  goExam() {
    this.$confirm("考试, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        this.$router.push({
          path: `/center/showexam/${this.studentCourse.courseId}/${this.studentCourse.exam}`,
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消考试",
        });
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
}
.bg-purple-dark {
  // background: #99a9bf;
  // border: 1px solid #99a9bf;
}
.bg-purple {
  // background: #d3dce6;
  border-bottom: 1px solid #d3dce6;
}
.bg-purple-light {
  // background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.video-nav {
  padding-top: 10px;
}

.el-badge {
  cursor: pointer;
}

.messages {
  background-color: aliceblue;
}
.messages .bg-purple-dark {
  border: 0;
}
.messages-text .bg-purple-dark {
  border: 0;
}
</style>