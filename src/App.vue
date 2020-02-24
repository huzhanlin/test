<template>
  <div id="app">
    <div class="content">
      <keep-alive>
        <router-view class="content-wrapper"></router-view>
      </keep-alive>
    </div>
    <div class="nav">
      <ul>
        <li v-for="i in navsData" :key="i.to">
          <router-link :to="i.to">{{i.text}}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { indexNavData } from "@/assets/js/basic.js";
export default {
  name: "app",
  data() {
    return {
      navsData: indexNavData
    };
  }
};
</script>
<style lang="sass" scoped>
#app
  width: 100%
  height: 100vh  
  @include column()
  overflow: hidden
  .content  
    flex: 1
    overflow: hidden
    .content-wrapper
      width: 100%
      height: 100%
  .nav
    z-index: 10000
    height: 100%
    flex: 0 0 7vmax
    overflow: hidden
    box-shadow: 3px 3px 8px 4px rgba(0,0,0,.2)
    >ul
      height: 100%
      background-color: #eee
      @include flex(flex-start,center)
      >li
        flex: 1
        height: 100%             
        >a
          width: 100%
          height: 100%
          position: relative   
          @include flex(center,center)
          &:after
            position: absolute
            right: 0
            content: "|"
            color: #666
        &:last-child
          >a
            &:after
              content: ""
        .router-link-active
          color: blue  
</style>