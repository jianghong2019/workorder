<template>
  <div class="nullData">
    <div class="imgDiv">
      <img :src="imageModules[`/src/assets/img/${src}`]?.default" />
      <div class="nullText">{{ title }}</div>
      <div class="nullText1">{{ text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NullData',
  props: {
    title: {
      type: String,
      default: '暂无数据',
    },
    src: {
      type: String,
      default: 'noData@2x.png',
    },
    text: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      imageModules: import.meta.glob('@/assets/img/*.{png,jpg,jpeg,svg}', { eager: true }),
    }
  },
  created() {},
  methods: {},
}
</script>

<style>
.nullData {
  position: relative;
  height: 100%;
  /* animation: myshow 2s;
  /*Safari 和 Chrome:*/
  /* -webkit-animation: myshow 2s;  */
}
@keyframes myshow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
/*Safari 和 Chrome:*/
@-webkit-keyframes myshow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.imgDiv {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.imgDiv > img {
  width: 260px;
  height: 180px;
}
.nullText {
  padding-top: 8px;
  font-size: 15px;
  color: #666666;
}
.nullText1 {
  padding-top: 8px;
  font-size: 8px;
  color: #999;
}
</style>
