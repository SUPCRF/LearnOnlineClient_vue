<template>
  <div>
    <template v-if="flagHomework == 1">
      <el-row
        :gutter="20"
        type="flex"
        justify="center"
        style="margin-bottom: 10px"
        v-for="item in homeworkAnswer"
        :key="item.id"
      >
        <el-col :span="22">
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

    <template v-if="flagHomework != 1">
      <el-row
        :gutter="20"
        type="flex"
        justify="center"
        style="margin-bottom: 10px"
      >
        <el-col :span="22">
          <div class="grid-content bg-purple">
            <el-card class="box-card" style="min-height: calc(100vh - 220px)">
              <div slot="header" class="clearfix">
                <span>题目：{{ homeworkContent[index].content }}</span>
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
                  style="position: absolute; right: 6%; bottom: 10px"
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
        <el-button
          type="primary"
          v-if="index < homeLength - 1"
          @click="submitCheck"
          >下一题</el-button
        >
        <el-button
          type="success"
          v-if="index >= homeLength - 1"
          @click="submitOk"
          >完成</el-button
        >
      </el-row>
    </template>
  </div>
</template>

<script>
import { Vue, Component, Watch } from "vue-property-decorator";
import { Meta, Context } from "ea-router";
import Cookies from "js-cookie";
import axios from "axios";

@Context("id", "flag")
@Meta({
  title: "个人中心",
})
@Component()
export default class ShowHomeWork extends Vue {
  data() {
    return {
      homeworkContent: [],
      homeworkAnswer: [],
      homeLength: 0,
      flagHomework: 0,
      myAnswer: "",
      txtVal: 0,
      index: 0,
      flag: true,
    };
  }
  mounted() {
    this.flagHomework = this.$route.params.flag;
    this.getHomeworkContent();
    if(this.flagHomework == 1) {
      this.getHomeworkAnswer();
    }
  }
  descInput() {
    this.txtVal = this.myAnswer.length;
  }
  getHomeworkContent() {
    let token = Cookies.get("token");
    let formdata = new FormData();
    console.log(this.$store.state.userInfo);
    formdata.append("courseId", this.$route.params.id);
    axios({
      url: "http://localhost:8000/api/homework-content/all",
      method: "post",
      data: formdata,
      headers: { Authorization: token },
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.homeworkContent = res.data.data;
        console.log(this.homeworkContent);
        let length = this.homeworkContent.length;
        this.homeLength = length;
        console.log(length);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getHomeworkAnswer() {
    let token = Cookies.get("token");
    let formdata = new FormData();
    console.log(this.$store.state.userInfo);
    formdata.append("userId", this.$store.state.userInfo.userid);
    formdata.append("userName", this.$store.state.userInfo.username);
    formdata.append("courseId", this.$route.params.id);
    axios({
      url: "http://localhost:8000/api/homework-answer/selectAnswer",
      method: "post",
      data: formdata,
      headers: { Authorization: token },
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data);
        this.homeworkAnswer = res.data.data;
        console.log(this.homeworkAnswer);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  saveHomeworkContent(courseId, content, answer, myAnswer) {
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
      url: "http://localhost:8000/api/homework-answer/save",
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
    let courseId = this.homeworkContent[this.index].courseId;
    let content = this.homeworkContent[this.index].content;
    let answer = this.homeworkContent[this.index].answer;
    let myAnswer = this.myAnswer;

    this.index = this.index + 1;
    this.myAnswer = "";
    if (this.index >= this.homeworkContent.length) {
      console.log("123");
      this.flag = false;
      console.log(this.flag);
    }
    // console.log(courseId);
    // console.log(content);
    // console.log(answer);
    // console.log(myAnswer);
    this.saveHomeworkContent(courseId, content, answer, myAnswer);
  }

  submitOk() {
    // console.log(this.homeworkContent.length);
    // console.log(this.index);
    // console.log("---");
    // console.log(this.myAnswer);
    // console.log(this.homeworkContent[this.index]);
    let courseId = this.homeworkContent[this.index].courseId;
    let content = this.homeworkContent[this.index].content;
    let answer = this.homeworkContent[this.index].answer;
    let myAnswer = this.myAnswer;
    // console.log(courseId);
    // console.log(content);
    // console.log(answer);
    // console.log(myAnswer);
    this.saveHomeworkContent(courseId, content, answer, myAnswer);
    this.$router.push('/center/homework')
  }
}
</script>

<style>
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
</style>