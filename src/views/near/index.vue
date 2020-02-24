<template>
  <div class="near">
    <div class="hide" @click="panelSwitch()">
      <i class="el-icon-arrow-down" :class="panelFlog?'active':''"></i>
    </div>
    <div class="panel" :class="!panelFlog?'panelhide':''">
      <div class="classification">
        <div class="title">商家类别：</div>
        <el-select v-model="formData.selectValue" size="mini">
          <el-option v-for="i in formatMapMarker" :key="i.id" :label="i" :value="i"></el-option>
        </el-select>
      </div>
      <div class="line">
        <div class="title">经营模式分类：</div>
        <el-radio-group v-model="formData.radio">
          <el-radio v-for="i in line" :key="i.id" :label="i.value">{{i.text}}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="map-container">
      <div id="map"></div>
    </div>
  </div>
</template>

<script>
// 解决marker.on内绑定函数无法传参，或者无法解绑的问题。
import { Mouser, template } from "@/assets/js/map.js";
import { mapMarker } from "@/assets/js/basic.js";
import { markerHref } from "@/assets/js/data.js";
export default {
  name: "near",
  mounted() {
    this.initMethods(); // 初始化地图
    this.geolocation(); // 定位
    this.geocoder(); // 添加marker并且绑定事件
  },
  data() {
    return {
      map: "", // 地图实例
      mapMarker, // 商家数据
      formData: {
        // 操作map的面板的控制器数据
        selectValue: "全部分类",
        radio: "all"
      },
      panelFlog: true, // 操作map的面板的控制显示和隐藏
      newMarkersText: [], // 标记类别选项的文字，监听它以更新marker
      mouserEvent: "", // mouser构造函数，用来在生命周期销毁的时候移除事件
      resultList: [], // marker列表，用来更新前移除所有标记
      infoWindow: "", // 信息窗口，用来切换marker的时候清除信息窗口
      infoMarker: "" // 信息窗口对应的marker，用来切换marker的时候清除信息窗口
    };
  },
  watch: {
    // 监听经营模式分类控制器
    "formData.radio": {
      handler: function() {
        this._setMarkerDate();
      }
    },
    // 监听商家分类控制器
    "formData.selectValue": {
      handler: function() {
        this._setMarkerDate();
      }
    },
    // 标记类别选项的文字，监听它以更新marker
    newMarkersText() {
      if (this.newMarkersText.length) {
        if (this.resultList.length) this.map.remove(this.resultList);
        let geo = new AMap.Geocoder({ city: "全国" });
        geo.getLocation(this.newMarkersText, (status, result) => {
          if (status === "complete" && result.geocodes.length) {
            this.resultList = [];
            result.geocodes.forEach((value, index) => {
              let newMarker = new AMap.Marker({
                animation: "AMAP_ANIMATION_BOUNCE",
                extData: this.newMarkersText[index],
                // offset: new AMap.Pixel(-9, -30), //点移动的距离
                position: [value.location.lng, value.location.lat] //位置
              });
              // new 一个构造函数，然后传递参数以及回调函数
              this.mouserEvent = new Mouser(newMarker, index, this._callback);
              this.resultList.push(newMarker);
            });
            this.map.add(this.resultList); //添加到地图
          } else {
            console.log("根据地址查询位置失败");
          }
        });
      } else {
        if (this.resultList.length) this.map.remove(this.resultList);
        alert("没有查询结果,请更换查询条件。");
      }
    }
  },
  computed: {
    line() {
      let newLine = mapMarker.map(value => {
        return value.type;
      });
      newLine = [...new Set(newLine.flat())];
      newLine = newLine.map(value => {
        if (value === "offLine") {
          return {
            text: "线下",
            value
          };
        }
        if (value === "onLine") {
          return {
            text: "线上",
            value
          };
        }
        return {
          text: "其他",
          value
        };
      });
      newLine.unshift({
        text: "全部",
        value: "all"
      });
      return newLine;
    },
    // 商家分类初始化数据
    formatMapMarker() {
      let selectData = this.mapMarker.map(value => {
        return value.classification;
      });
      selectData = [...new Set(selectData)];
      selectData.unshift("全部分类");
      return selectData;
    }
  },
  methods: {
    _setMarkerDate() {
      let radio = this.formData.radio;
      let selectValue = this.formData.selectValue;

      if (radio && selectValue) {
        let newMarker = [],
          newMarker2 = [];
        if (radio === "all") {
          newMarker = mapMarker;
        } else {
          for (let i = 0; i < mapMarker.length; i++) {
            if (mapMarker[i].type.includes(radio)) {
              newMarker.push(mapMarker[i]);
            }
          }
        }

        if (selectValue === "全部分类") {
          newMarker2 = newMarker;
        } else {
          for (let i = 0; i < newMarker.length; i++) {
            if (newMarker[i].classification === selectValue) {
              newMarker2.push(newMarker[i]);
            }
          }
        }
        this.geocoder(newMarker2);
      }
    },
    // 点击marker执行的回调函数
    _callback(marker, index, e) {
      this.infoMarker = marker;
      let infoWindow = new AMap.AdvancedInfoWindow({
        content: template,
        offset: new AMap.Pixel(0, -30)
      });
      this.infoWindow = infoWindow;

      let contentText = infoWindow.getContent();
      infoWindow.setContent(contentText.replace(/逛街帮/, marker.getExtData()));

      let _id = "",
        _content = "";
      for (let i = 0; i < mapMarker.length; i++) {
        if (mapMarker[i].text === marker.getExtData()) {
          _id = `${markerHref}${mapMarker[i].id}`;
          _content = mapMarker[i].content;
          break;
        }
      }

      if (_content) {
        infoWindow.setContent(
          infoWindow.getContent().replace(/逛街帮是一个让你更喜欢逛街的网站/, _content)
        );
      }

      infoWindow.setContent(
        infoWindow.getContent().replace(/javascript\:void\(0\)/, _id)
      );
      infoWindow.open(this.map, [e.lnglat.lng, e.lnglat.lat]);
    },
    // 定位
    geolocation() {
      var geolocation = new AMap.Geolocation({
        // 是否使用高精度定位，默认：true
        enableHighAccuracy: true,
        // 设置定位超时时间，默认：无穷大
        timeout: 10000,
        // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
        buttonOffset: new AMap.Pixel(10, 20),
        //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        zoomToAccuracy: true,
        //  定位按钮的排放位置,  RB表示右下
        buttonPosition: "RB"
      });
      this.map.addControl(geolocation);
      geolocation.getCurrentPosition(function(status, result) {
        if (status == "complete") {
          onComplete(result);
        } else {
          onError(result);
        }
      });

      function onComplete(data) {
        console.log("精确定位完成");
      }
      //解析定位错误信息
      function onError(data) {
        console.log("精确定位出错，转成ip市级定位");
      }
    },
    // 更新marker文本=>数组，用来激活标记类别以更新marker
    geocoder(data = this.mapMarker) {
      let newMarkers = data.map(value => {
        return value.text;
      });
      // 判断打开的信息窗口对应的marker是否还存在
      if (this.infoWindow) {
        let extData = this.infoMarker.getExtData();
        if (!newMarkers.includes(extData)) {
          this.infoWindow.close();
        }
      }
      if (this.newMarkersText === newMarkers) return;
      this.newMarkersText = newMarkers;
    },
    // 初始化地图
    initMethods() {
      this.map = new AMap.Map("map", {
        zoom: 16,
        /**
         *  =>  这个是临时数据
         **/
        center: [111.74721, 27.2448]
      });
    },
    // 控制地图面板事件
    panelSwitch() {
      this.panelFlog = !this.panelFlog;
    }
  },
  beforeDestroy() {
    // 解除marker的事件绑定
    this.mouserEvent.remove();
  }
};
</script>

<style lang="sass" scoped>
::v-deep .amap-info-contentContainer
  width: 100%
  height: 40%
  .info-title
    padding: 0 5%
    width: 100%
    height: 40*$r
    color: #eb2001
    font-size: 16*$r
    position: relative
    @include flex(flex-start,center)
  .amap-adcombo-close
    background-color: #aaa
  .info-content
    padding: 0 5%
    width: 100%
    height: 60*$r
    @include flex(flex-start,center)
    .info-left
      flex: 0 0 60*$r
      height: 100%
      >img
        width: 100%
        height: 100%
        border-radius: 10*$r    
    .info-right
      padding: 0 5%
      flex: 1
      height: 100%
      >p
        height: 50%
        overflow: hidden
        display: -webkit-box
        -webkit-box-orient: vertical
        -webkit-line-clamp: 2     
        line-height: 16*$r   
        >a
          color: blue
        &:last-child
          @include flex(flex-start,center)
  .input-label
    width: 40*$r
  table:nth-child(2)
    width: 100%
    height: 36*$r
    >tr
      width: 100%
      height: 100%
      display: flex
      overflow: hidden
      >td
        overflow: hidden
        @include flex(center,center)        
      >td:nth-child(1)
        flex: 0 0 15%        
      >td:nth-child(2)
        flex: 0 0 28%  
        height: 100%
        overflow: hidden
        .keyword-input
          border: 1*$r solid #eee
          height: 24*$r
          width: 100%
          margin-right: 0
          .keyword      
            width: 100%   
      >td:nth-child(3)
        flex: 1
        margin-left: 3*$r
        @include flex(flex-start,center)
.near
  position: relative
  >.hide
    z-index: 101
    position: absolute
    left: 2%
    top: 1.3vmax
    width: 20*$r
    height: 20*$r
    border-radius: 50%
    border: 1*$r solid #409EFF   
    overflow: hidden   
    @include flex(center,center)
    >i
      transition: transform .3s
      &.active
        transform: rotate(180deg)
  .panel
    position: absolute
    width: 100%
    height: 80*$r
    left: 0
    top: 0
    box-shadow: 3*$r 3*$r 8*$r 2*$r rgba(0,0,0,.1)
    overflow: hidden 
    z-index: 100
    background-color: rgba(255,255,255,.9) 
    transition: top .3s
    .line, .classification
      padding: 2vmin 
      width: 100%
      height: 50%      
      @include flex(center,center)
      .title
        text-align: right
      .el-radio-group
        line-height: 26*$r
        @include flex(flex-start,center)
        .el-radio
          margin: 0 10*$r 0 10*$r
  .panelhide
    top: -80*$r
  .map-container
    width: 100%
    height: 100%
    #map
      width: 100%
      height: 100%
</style>