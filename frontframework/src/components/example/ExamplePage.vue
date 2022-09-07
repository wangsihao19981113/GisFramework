<template>
  <div class="ExamplePage">
    <div class="NavBar">
      <el-row class="tac">
        <el-col>
          <el-menu
              default-active="2"
              class="el-menu-vertical-demo">
<!--            <el-submenu index="1">-->
<!--              <template slot="title">-->
<!--                <i class="el-icon-location"></i>-->
<!--                <span>导航一</span>-->
<!--              </template>-->
<!--              <el-menu-item index="1-1">选项1</el-menu-item>-->
<!--              <el-menu-item index="1-2">选项2</el-menu-item>-->
<!--              <el-menu-item index="1-3">选项3</el-menu-item>-->
<!--            </el-submenu>-->
<!--            <el-submenu index="2">-->
<!--              <template slot="title">-->
<!--                <i class="el-icon-location"></i>-->
<!--                <span>导航二</span>-->
<!--              </template>-->
<!--            </el-submenu>-->
            <el-submenu v-for="(first,index) in config" :key="index" :index="first.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{first.name}}</span>
              </template>
              <el-menu-item  v-for="(second,i) in first.second" :key="i" :index="second.id">
                <a :href="'#'+second.id">{{second.name}}</a>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <div class="Viewer" :style="{height:screenHeight+'px'}">
      <div class="big" v-for="(first,index) in config" :key="index">
        <div class="first" :id="first.id">
          <div class="iconfont icon-bangzhu"></div>
          <p>{{first.name}}</p>
          <div class="line">
            <span></span>
          </div>
        </div>
        <div class="second" v-for="(second,index) in first.second" :key="index" :id="second.id">
          <h3 class="secondName">{{second.name}}</h3>
          <ul class="third">
            <li class="thirdItem" v-for="(third,index) in second.third" :key="index" @click="OpenExample(third.url)">
              <div class="pic">
                <img :src="third.img" lazy="loaded">
              </div>
              <p>{{third.name}}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>



let config = [
  {
    name:"矢量要素",
    id:"el_1",
    second:[
      {
        name:"线样式",
        id:"el_1_1",
        third:[
          {
            name:"上升线",
            img:"/Image/Example/LineStyle/Risingline.png",
            url:"/Risingline"
          },
          {
            name:"流动线",
            img:"/Image/Example/LineStyle/ShiningLine.png",
            url:"/ShiningLine"
          },
          {
            name:"抛物线",
            img:"/Image/Example/LineStyle/ParabolaLine.png",
            url:"/ParabolaLine"
          }
        ]
      },
      {
        name:"面样式",
        id:"el_1_2",
        third:[
          {
            name:"水面",
            img:"/Image/Example/WaterStyle/WaterNormal.png",
            url:"/WaterNormal"
          },
        ]
      },
      {
        name:"点样式",
        id:"el_1_3",
        third:[
          {
            name:"上升线",
            img:"/Image/img.png"
          },
          {
            name:"上升线",
            img:"/Image/img.png"
          },
          {
            name:"上升线",
            img:"/Image/img.png"
          }
        ]
      }
    ]
  },
  {
    name:"统计",
    id:"el_2",
    second:[
      {
        name:"地图统计图表",
        id:"el_2_1",
        third:[
          {
            name:"饼图",
            img:"/Image/Example/StatisticalChart/PieChart.png",
            url:"/PieChart"
          },
        ]
      },{
        name:"热力图",
        id:"HeatMapNormal",
        third:[
          {
            name:"普通热力图",
            img:"/Image/Example/HeatMap/HeatMapNormal.png",
            url:"/HeatMapNormal"
          },
        ]
      }]
  },
  {
    name:"基础功能",
    id:"BaseFun",
    second:[
      {
        name:"数据加载",
        id:"DataLoad",
        third:[
          {
            name:"建筑白膜",
            img:"/Image/Example/DataLoad/BuildingModel.png",
            url:"/BuildingModel"
          },
          {
            name:"threejs加载3dtile(相机融合)",
            img:"Image/Example/DataLoad/ThreeJSLoad3dtiles.png",
            url:"/ThreeJSLoad3dtiles"
          }
        ]
      },]
  },
  {
    name:"场景",
    id:"Scene",
    second:[
      {
        name:"场景效果",
        id:"SceneEffect",
        third:[
          {
            name:"阴影效果",
            img:"/Image/Example/SceneEffect/Shadow.png",
            url:"/Shadow"
          },
        ]
      },
      {
        name:"气象",
        id:"SceneEffect",
        third:[
          {
            name:"风场",
            img:"/Image/Example/Weather/Windy.png",
            url:"/Windy"
          },
        ]
      },
      {
        name:"ThreeJS场景融合",
        id:"SceneFusion",
        third:[
          {
            name:"ThreeJS相机融合",
            img:"/Image/Example/CesiumWithThreeJS/CameraFusion.png",
            url:"/CameraFusion"
          },
          {
            name:"经纬度和角度控件",
            img:"/Image/Example/CesiumWithThreeJS/ModelAdjustment.png",
            url:"/ModelAdjustment"
          },
        ]
      },
    ]
  },
]
export default {
  name: "ExamplePage",
  data(){
    return{
      config:config,
      screenHeight:document.documentElement.clientHeight,
    }
  },
  mounted() {
    window.onresize = ()=>{
      this.screenHeight = document.documentElement.clientHeight;
      console.log(this.screenHeight);
    }
  },
  methods:{
    OpenExample(url){
      if(url){
        window.open(this.localhostPath+url)
      }
    }
  },
}
</script>

<style scoped>
.ExamplePage *{
  padding: 0;
  margin: 0;
}

.ExamplePage{
  display:flex;
}

.ExamplePage .NavBar{
  height: 100%;
  width: 12%;
}
.ExamplePage .Viewer{
  width: 88%;
  overflow-y: auto;
}

.ExamplePage .big{
}

.ExamplePage .first{
  margin-left: 15px;
  margin-top: 15px;
  color: #666;
  display: flex;
  align-items: center;
}

.ExamplePage .first p{
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 26px;
  margin:0px;
  color:#018afe;
}

.ExamplePage .first .iconfont{
  width: 18px;
  height: 18px;
  line-height: 20px;
  font-size: 18px;
  text-align: center;
  color: #018afe;
  margin-right: 10px;
  border-radius: 10px;
}

.ExamplePage .line{
  flex: 1;
  height: 1px;
  background-color: #dfdfdf;
  margin-left: 32px;
  position: relative;
}

.ExamplePage .line span{
  width: 105px;
  height: 1px;
  background-color: #4e97d9;
  position: absolute;
  top: 0;
  left: 0
}

.ExamplePage .second{
  border-bottom: 1px solid #dfdfdf;
  padding-top: 22px;
  padding-bottom: 16px;
  margin-left: 37px;
  margin-bottom: 8px;
}

.ExamplePage .secondName{
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 26px;
  color: #000;
  display: flex;
  align-items: center;
}

.ExamplePage .third{
  margin-top: 15px;
  flex-wrap: wrap;
  display: flex;
}

.ExamplePage .thirdItem{
  margin-right: 1.5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 3px 6px gray;
  background-color: #fff;
  opacity: 1;
  border-radius: 10px;
  margin-bottom: 28px;
  padding: 20px 20px;
  cursor: pointer;
}

.ExamplePage .thirdItem:hover{
  box-shadow: 0 6px 12px rgba(0,138,255,0.56);
  background-color: #4e97d9;
  transition-duration: 1s;
  color:white;
}

.ExamplePage .thirdItem .pic{
  width: 100%;
  height: 100%;
  margin: 3px 0 10px 0
}

.ExamplePage .thirdItem img{
  border-radius: 10px;
  width: 250px;
  height: 210px;
  object-fit: cover;
}

.ExamplePage .thirdItem p{
  width: 90%;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 21px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
}


</style>