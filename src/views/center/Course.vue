<template>
  <div class="center-container">
    <isStudent v-if="flag" />
    <isTeacher v-if="!flag" />
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import { Meta } from "ea-router";
import isTeacher from "@/components/course/isTeacher";
import isStudent from "@/components/course/isStudent";

@Meta({
  components: { isStudent },
  title: "个人中心",
})
@Component({
  components: {
    isTeacher,
    isStudent,
  }
})
export default class Course extends Vue {
  data() {
    return {
      flag: false,
    }
  }
  created() {
    console.log(this.$store.state.type);
    console.log(localStorage.getItem("type"));
    console.log(this.$store.state.userInfo);
    console.log(this.$store.getType);
    let type = localStorage.getItem("type");
    if (type === "student") {
      this.flag = true;
    } else {
      this.flag = false;
    }
  }
}
</script>

<style scoped>
.center-container {
  width: 100%;
}
</style>