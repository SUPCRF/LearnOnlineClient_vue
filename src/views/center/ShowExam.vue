<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18"
        ><div class="grid-content bg-purple">
          {{ course.courseName }}
        </div></el-col
      >
      <!-- <el-col :span="5">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>卡片名称</span>
              <el-button style="float: right; padding: 3px 0" type="text"
                >操作按钮</el-button
              >
            </div>
            <div v-for="o in 4" :key="o" class="text item">
              {{ "列表内容 " + o }}
            </div>
          </el-card>
        </div>
      </el-col> -->
    </el-row>
    <!-- <el-row :gutter="20">
      <el-col :span="18">
        <div class="grid-content bg-purple-light" style="height: 2000px"></div>
      </el-col>
    </el-row> -->

    <template v-if="flagExam == 1">
      <el-row
        :gutter="20"
        style="margin-bottom: 10px"
        v-for="item in examAnswer"
        :key="item.id"
      >
        <el-col :span="18">
          <div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>题目：{{ item.content }}</span>
              </div>
              <div class="text item">
                <el-input
                  type="textarea"
                  :disabled="true"
                  :v-model="item.myAnswer"
                  :placeholder="item.myAnswer"
                ></el-input>
              </div>
              <div class="text item">标准答案：{{ item.answer }}</div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </template>

    <template v-if="flagExam != 1">
      <el-row :gutter="20" style="margin-bottom: 10px">
        <el-col :span="18">
          <div class="grid-content bg-purple">
            <el-card class="box-card" style="min-height: calc(100vh - 300px)">
              <div slot="header" class="clearfix">
                <span>题目：{{ examContent[index].content }}</span>
              </div>
              <div class="text item">
                <el-input
                  type="textarea"
                  v-model="myAnswer"
                  class="wh462"
                  placeholder="请填写内容"
                  maxlength="1000"
                  rows="15"
                  @input="descInput"
                ></el-input>
                <span
                  class="numberV"
                  style="position: absolute; right: 28%; bottom: 10px"
                  >{{ txtVal }}/1000</span
                >
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        type="flex"
        justify="center"
        style="margin-top: 20px"
      >
        <el-col :span="8">
          <el-button
            type="primary"
            v-if="index < examLength - 1"
            @click="submitCheck"
            >下一题</el-button
          >
          <el-button
            type="success"
            v-if="index >= examLength - 1"
            @click="submitOk"
            >提交试卷</el-button
          >
        </el-col>
      </el-row>
    </template>

    <div class="exam_info">
      <!-- <el-card
        class="time-card"
        style="margin-bottom: 10px"
        v-if="flagExam != 1"
      >
        <span>剩余时间:</span>
      </el-card> -->
      <el-card
        class="time-card"
        style="text-align: center"
        v-if="flagExam != 1"
      >
        <!-- <el-button type="success" size="small">提交交卷</el-button> -->
        <el-button type="danger" size="small" @click="outExam"
          >退出考试</el-button
        >
      </el-card>
    </div>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import { Meta, Context } from "ea-router";
import axios from "axios";
import Cookies from "js-cookie";

@Context("id", "flag")
@Meta({
  title: "个人中心",
})
@Component()
export default class ShowExam extends Vue {
  data() {
    return {
      course: {},
      examContent: [],
      examAnswer: [],
      examLength: 0,
      flagExam: 0,
      myAnswer: "",
      txtVal: 0,
      index: 0,
      flag: true,
    };
  }
  mounted() {
    this.flagExam = this.$route.params.flag;
    this.getCourseInfo();
    this.getExamContent();
    if (this.flagExam == 1) {
      this.getExamAnswer();
    }
  }
  descInput() {
    this.txtVal = this.myAnswer.length;
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
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getExamContent() {
    let token = Cookies.get("token");
    let formdata = new FormData();
    console.log(this.$store.state.userInfo);
    formdata.append("courseId", this.$route.params.id);
    axios({
      url: "http://localhost:8000/api/exam-content/all",
      method: "post",
      data: formdata,
      headers: { Authorization: token },
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.examContent = res.data.data;
        console.log(this.examContent);
        let length = this.examContent.length;
        this.examLength = length;
        console.log(length);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getExamAnswer() {
    let token = Cookies.get("token");
    let formdata = new FormData();
    console.log(this.$store.state.userInfo);
    formdata.append("userId", this.$store.state.userInfo.userid);
    formdata.append("userName", this.$store.state.userInfo.username);
    formdata.append("courseId", this.$route.params.id);
    axios({
      url: "http://localhost:8000/api/exam-answer/selectAnswer",
      method: "post",
      data: formdata,
      headers: { Authorization: token },
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.examAnswer = res.data.data;
        console.log(this.examAnswer);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  saveExamContent(courseId, content, answer, myAnswer) {
    let token = Cookies.get("token");
    let formdata = new FormData();
    formdata.append("userId", this.$store.state.userInfo.userid);
    formdata.append("userName", this.$store.state.userInfo.username);
    formdata.append("courseId", courseId);
    formdata.append("content", content);
    formdata.append("answer", answer);
    formdata.append("myAnswer", myAnswer);
    console.log(formdata.get("userId"));
    console.log(formdata.get("userName"));
    console.log(formdata.get("courseId"));
    console.log(formdata.get("content"));
    console.log(formdata.get("answer"));
    console.log(formdata.get("myAnswer"));

    axios({
      url: "http://localhost:8000/api/exam-answer/save",
      method: "post",
      data: formdata,
      headers: { Authorization: token },
    })
      .then((res) => {
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  submitCheck() {
    // console.log(this.homeworkContent.length);
    // console.log(this.index);
    // console.log("---");
    // console.log(this.myAnswer);
    // console.log(this.homeworkContent[this.index]);
    let courseId = this.examContent[this.index].courseId;
    let content = this.examContent[this.index].content;
    let answer = this.examContent[this.index].answer;
    let myAnswer = this.myAnswer;

    this.index = this.index + 1;
    this.myAnswer = "";
    if (this.index >= this.examContent.length) {
      console.log("123");
      this.flag = false;
      console.log(this.flag);
    }
    // console.log(courseId);
    // console.log(content);
    // console.log(answer);
    // console.log(myAnswer);
    this.saveExamContent(courseId, content, answer, myAnswer);
  }

  submitOk() {
    // console.log(this.homeworkContent.length);
    // console.log(this.index);
    // console.log("---");
    // console.log(this.myAnswer);
    // console.log(this.homeworkContent[this.index]);
    let courseId = this.examContent[this.index].courseId;
    let content = this.examContent[this.index].content;
    let answer = this.examContent[this.index].answer;
    let myAnswer = this.myAnswer;
    // console.log(courseId);
    // console.log(content);
    // console.log(answer);
    // console.log(myAnswer);
    this.saveExamContent(courseId, content, answer, myAnswer);
    this.$router.push("/center/exam");
  }

  outExam() {
    this.$confirm("退出考试, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        let token = Cookies.get("token");
        let formdata = new FormData();
        formdata.append("userId", this.$store.state.userInfo.userid);
        formdata.append("userName", this.$store.state.userInfo.username);
        formdata.append("courseId", this.$route.params.id);
        axios({
          url: "http://localhost:8000/api/exam-answer/remove",
          method: "post",
          data: formdata,
          headers: { Authorization: token },
        })
          .then((res) => {
            console.log(res.data.data);
          })
          .catch((error) => {
            console.log(error);
          });

        this.$router.push("/center/exam");
        this.$message({
          type: "success",
          message: "退出成功!",
        });
        this.getCourseInfo();
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "继续考试",
        });
      });
  }
}
</script>

<style lang="scss" scoped>
.exam_info {
  position: fixed; /*固定位置*/
  top: 135px;
  right: 60px;
  z-index: 9999; /*设置优先级显示，保证不会被覆盖*/
}
.time-card {
  width: 240px;
}
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
  background: #99a9bf;
}
.bg-purple {
  // background: #d3dce6;
  border-bottom: 1px solid #d3dce6;
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
</style>
