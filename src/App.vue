<template>
  <div>
    <!--头部-->
    <Header/>
        <!--主体-->
    <div style="display: flex;">
      <!--侧边栏-->
      <Aside/>

      <!--内容区 通过路由展示  到HomeVue-->
      <router-view style="flex: 1"/>

    </div>
  </div>

</template>

<script>
import Header from "@/components/Header";
import Aside from "@/components/Aside";



export default {
  name: "Layout",
  components: {
    Header,
    Aside
  }
}
</script>


<style>

</style>
