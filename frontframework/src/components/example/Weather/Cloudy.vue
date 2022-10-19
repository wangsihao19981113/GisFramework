<template>
  <div>
    <div class="ParamContainer">
      <div class="ParamItem">
        123
        <div class="SliderDiv">
          <div class="minValue">{{value[0]}}</div>
          <div style="width: 280px">
            <el-slider
                v-model="value"
                range
                step="0.1"
                show-stops
                :max="10">
            </el-slider>
          </div>
          <div class="maxValue">{{value[1]}}</div>
        </div>
      </div>
    </div>
    <CesiumBaseView></CesiumBaseView>
  </div>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
export default {
  components: {CesiumBaseView},
  data(){
    return{
      value:[4,8],
    }
  }
}
</script>

<style scoped>
.ParamContainer{
  position: absolute;
  background: whitesmoke;
  border-radius: 5px;
  padding: 15px;
  left: 10px;
  top: 10px;
  z-index: 1;
}
.ParamItem{
  width: 300px;
}

.SliderDiv{
  display: flex;
  width: 100%;
}

.minValue,.maxValue{
  width: 40px;
  margin: auto;
}

.maxValue{
  text-align: end;
}

</style>