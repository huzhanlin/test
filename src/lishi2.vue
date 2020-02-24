<template>
  <div class="near">
    <div id="container"></div>
    <div class="input-card custom-input-card">
      <h4>切换信息窗体</h4>
      <div class="input-item">
        <input type="button" class="btn" value="信息窗体1" @click="infowindow1.open(map)" />
        <input type="button" class="btn" value="信息窗体2" @click="infowindow2.open(map)" />
        <input type="button" class="btn" value="信息窗体3" @click="infowindow3.open(map)" />
      </div>
    </div>
    <div class="hide" @click="panelSwitch()">
      <i class="el-icon-arrow-down" :class="panelFlog?'active':''"></i>
    </div>
    <div class="panel" :class="!panelFlog?'panelhide':''">
      <div class="classification">
        <div class="title">商铺类别：</div>
        <el-select v-model="formData.selectValue" size="mini">
          <el-option v-for="i in formatMapMarker" :key="i.id" :label="i" :value="i"></el-option>
        </el-select>
      </div>
      <div class="line">
        <div class="title">经营模式分类：</div>
        <el-radio-group v-model="formData.radio">
          <el-radio v-for="i in line" :key="i.id" :label="i">{{i}}</el-radio>
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
import { Mouser } from "@/assets/js/addevent.js";
import { mapMarker, line } from "@/assets/static/basic.js";
export default {
  name: "near",
  mounted() {
    this.lnglat = [116.473188, 39.993253];
    this.map = new AMap.Map("container", {
      resizeEnable: true,
      center: this.lnglat,
      zoom: 15
    });
    var marker = new AMap.Marker({
      position: this.lnglat
    });
    marker.setMap(this.map);

    var content =
      '<div class="info-title">高德地图</div><div class="info-content">' +
      '<img src="https://webapi.amap.com/images/amap.jpg">' +
      "高德是中国领先的数字地图内容、导航和位置服务解决方案提供商。<br/>" +
      '<a target="_blank" href = "https://mobile.amap.com/">点击下载高德地图</a></div>';
    this.infowindow1 = new AMap.AdvancedInfoWindow({
      content: content,
      offset: new AMap.Pixel(0, -30)
    });
    this.infowindow2 = new AMap.AdvancedInfoWindow({
      content: content,
      asOrigin: false,
      asDestination: false,
      offset: new AMap.Pixel(0, -30)
    });
    this.infowindow3 = new AMap.AdvancedInfoWindow({
      content: content,
      placeSearch: false,
      asDestination: false,
      offset: new AMap.Pixel(0, -30)
    });
    // this.initMethods(); // 初始化地图
    // this.geolocation(); // 定位
    // this.geocoder(); // 添加marker并且绑定事件
  },
  data() {
    return {
      map: "",
      mapMarker,
      line,
      formData: {
        selectValue: "全部分类",
        radio: "全部"
      },
      panelFlog: true,
      newMarkersText: [],
      mouserEvent: ""
    };
  },
  computed: {
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
    _callback(marker, index, e) {
      // 点击marker执行的回调函数
      console.log(marker, index, e, this.line);

      var content = [
        '<div class="infowindow-content">',
        '<div class="amap-info-header">方恒国际中心</div>',
        '<div class="amap-info-body">阜通东大街6号</div></div>'
      ];

      // 创建 infoWindow 实例
      // todo: 解释重要参数示意
      var advancedInfoWindow = new AMap.AdvancedInfoWindow({
        panel: "panel",
        placeSearch: true,
        asOrigin: true,
        asDestination: true,
        content: content
      });

      // 打开信息窗体
      advancedInfoWindow.open(map);
    },
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
    geocoder() {
      let geo = new AMap.Geocoder({ city: "全国" });
      let newMarkers = this.mapMarker.map(value => {
        return value.text;
      });
      this.newMarkersText = newMarkers;
      geo.getLocation(newMarkers, (status, result) => {
        if (status === "complete" && result.geocodes.length) {
          let resultList = [];
          result.geocodes.forEach((value, index) => {
            let newMarker = new AMap.Marker({
              // offset: new AMap.Pixel(-9, -30), //点移动的距离
              position: [value.location.lng, value.location.lat] //位置
            });
            // new 一个构造函数，然后传递参数以及回调函数
            this.mouserEvent = new Mouser(newMarker, index, this._callback);
            resultList.push(newMarker);
          });
          this.map.add(resultList); //添加到地图
        } else {
          console.log("根据地址查询位置失败");
        }
      });
    },
    initMethods() {
      this.map = new AMap.Map("map", {
        zoom: 16
      });
    },
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

  <style>
html,
body,
#container {
  height: 100%;
  width: 100%;
}

.custom-input-card {
  width: 22rem;
}

.custom-input-card .btn {
  margin-right: 1rem;
}

.custom-input-card .btn:last-child {
  margin-right: 0;
}

.info-title {
  color: white;
  font-size: 14px;
  background-color: #25a5f7;
  line-height: 26px;
  padding: 0px 0 0 6px;
  font-weight: lighter;
  letter-spacing: 1px;
}

.info-content {
  font: 12px Helvetica, "Hiragino Sans GB", "Microsoft Yahei", "微软雅黑", Arial;
  padding: 4px;
  color: #666666;
  line-height: 23px;
}

.info-content img {
  float: left;
  margin: 3px;
}

.amap-info-combo .keyword-input {
  height: 25px;
  border-radius: 2px 0 0 2px;
}
</style>

<style lang="sass" scoped>
.near
  position: relative
  >.hide
    z-index: 10001
    position: absolute
    left: 2%
    top: 1%
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
    height: 14%
    left: 0
    top: 0
    box-shadow: 3*$r 3*$r 8*$r 2*$r rgba(0,0,0,.1)
    overflow: hidden 
    z-index: 100
    background-color: rgba(255,255,255,.9) 
    transition: top .3s
    .line, .classification
      padding: 2% 
      width: 100%
      height: 50%      
      @include flex(flex-start,center)
      .title
        flex: 0 0 30%
        text-align: right
  .panelhide
    top: -14%
  .map-container
    width: 100%
    height: 100%
    #map
      width: 100%
      height: 100%
</style>