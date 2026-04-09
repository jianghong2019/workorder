<template>
  <div class="gauge-chart-container">
    <div class="bar-chart">
      <div
        v-for="(item, index) in computedBarData"
        :key="item.businessProfTypeCode"
        class="bar-item"
      >
        <div class="bar-item-left">
          <span class="text-sm">{{ label[item.businessProfTypeCode] }}</span>
        </div>
        <div class="bar-container">
          <div class="bar-fill" :style="{ width: item.width + '%' }"></div>
        </div>
        <span class="bar-item-right">{{ item.totalCount }}人</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BarChart',
  props: {
    barData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      label: {
        '01': '计量',
        '02': '采集',
        '03': '线损',
        '04': '反窃查违',
      },
    };
  },

  computed: {
    // 获取数据中最大值
    maxValue() {
      return Math.max(...this.barData.map((item) => item.totalCount));
    },
    // 计算每个条形的百分比宽度
    computedBarData() {
      return this.barData.map((item) => {
        const percentage = this.maxValue != 0 ? (item.totalCount / this.maxValue) * 100 : 0;
        return {
          ...item,
          width: percentage,
        };
      });
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.gauge-chart-container {
  width: 100%;
  height: 100%;
}
.bar-chart {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding-left: 8px;
  height: 100%;
}
.bar-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;

  .bar-item-left {
    font-size: 16px;
    font-weight: bold;
    line-height: 36px;
    width: 80px;
    color: #426170;
  }

  .bar-item-right {
    font-size: 16px;
    font-weight: bold;
    line-height: 36px;
    width: 80px;
    color: #3d3d3d;
  }

  .bar-container {
    height: 15px;
    flex-grow: 1;
    background-color: #efefef;
    border-radius: 10px;
    margin-right: 12px;
    overflow: hidden;

    .bar-fill {
      height: 100%;
      background: linear-gradient(270deg, #029f85 0%, rgba(2, 159, 133, 0.3) 100%);
      border-radius: 10px;

      /* 动画效果 */
      animation: fillAnimation 1s ease-in-out forwards;
      transform-origin: left;
    }
  }
}

/* 填充动画 */
@keyframes fillAnimation {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
</style>
