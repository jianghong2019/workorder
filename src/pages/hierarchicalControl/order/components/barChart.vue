<template>
  <div class="barChartRoot">
    <div :id="barchartId" class="my-hn-chart"></div>
  </div>
</template>

<script>
export default {
  name: 'BarChart',
  props: {
    zoomType: {
      type: Boolean,
      default: false,
    },
    barchartId: {
      type: String,
      default: '',
    },
    // 图表配置项
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      myChart: null,
    };
  },
  watch: {
    config: {
      handler(newVal, oldVal) {
        if (newVal) {
          console.log(newVal, '柱状图数据');
          this.$nextTick(() => {
            this.setChart();
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setChart();
    });
  },
  methods: {
    setChart() {
      if (this.myChart) {
        this.myChart.dispose();
        this.myChart = null;
      }
      this.myChart = this.$echarts.init(document.querySelector(`#${this.barchartId}`));
      this.myChart.setOption(this.getChartOption());
      let listener = () => {
        this.myChart.resize();
      };
      setTimeout(() => {
        window.addEventListener('resize', listener);
      }, 1000);
    },
    getChartOption() {
      // 准备数据系列
      let series = [];
      this.config.barData.forEach((item) => {
        series.push({
          name: item.name,
          data: item.value,
          type: 'bar',
          barMaxWidth: this.config.barMaxWidth,
          label: {
            show: false,
          },
        });
      });
      // 为每个系列应用自定义颜色
      series.forEach((serie, index) => {
        // 从自定义颜色集合中循环获取颜色
        const colorPair = this.config.customColors[index % this.config.customColors.length];

        serie.itemStyle = {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: colorPair[0] },
              { offset: 1, color: colorPair[1] },
            ],
          },
          barBorderRadius: [30, 30, 0, 0],
        };
      });
      let axisLabel = { color: '#415058' };
      if (!this.zoomType) {
        axisLabel.interval = 0;
      }
      let dataZoom = [];
      if (this.config.showSlider) {
        dataZoom = [
          // 添加inside zoom，支持鼠标滚轮缩放
          {
            type: 'slider',
            start: 0,
            end: (10 / this.config.barX.length) * 100,
            showDetail: false, // 去掉细节提示，让滚动条简洁
            labelFormatter: () => '', // 隐藏标签，避免“明细”
            handleStyle: {
              color: '#c0c0c0', // 调整手柄样式，更柔和
            },
            bottom: 5, // 控制位置，不要太挤
            height: 8, // 默认高度，不要设太高
          },
        ];
      } else {
        dataZoom = [
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'empty',
            start: 0,
            end: (10 / this.config.barX.length) * 100,
            // 最小显示比例（最小显示10条数据）
            minSpan: (10 / this.config.barX.length) * 100,
            // 最大显示比例（最大显示15条数据）
            maxSpan: (15 / this.config.barX.length) * 100,
          },
        ];
      }
      return {
        // 直角坐标系位置
        grid: this.config.grid,
        tooltip: {
          show: true,
          trigger: 'axis',
          textStyle: {
            fontSize: 14,
          },
          axisPointer: {
            type: 'shadow',
          },
          valueFormatter: (value) => {
            if (this.config.percentage) {
              return value + ' %';
            } else {
              return value;
            }
          },
        },
        legend: {
          show: true,
          data: series.map((s) => s.name),
          right: this.config.right ? 15 : 'center',
          top: 5,
          textStyle: {
            fontSize: 12,
            color: '#666',
          },
          icon: 'rect',
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 10,
        },
        // x轴配置
        xAxis: {
          // 类型 category 类目轴
          type: 'category',
          // 轴刻度数据
          data: this.config.barX,
          // 轴线配置
          axisLine: {
            // 轴线样式
            lineStyle: { color: '#DDDDDD' },
          },
          // 刻度配置
          axisTick: { show: false },
          // 刻度标签设置
          axisLabel: axisLabel,
        },
        yAxis: {
          // 轴名称
          name: this.config.nameY,
          // 名称样式
          nameTextStyle: {
            color: '#415058',
          },
          // max: this.yAxisMax, // 设置 y 轴最大值
          // 类型 value 数值轴
          type: 'value',
          // 轴线配置
          axisLine: {
            lineStyle: { color: '#DDDDDD' },
          },
          // 刻度配置
          axisTick: { lineStyle: { color: '#DDDDDD' } },
          // 刻度标签设置
          axisLabel: {
            color: '#999999',
          },
          splitLine: {
            lineStyle: {
              // 设置背景横线
              type: 'dashed',
              color: '#E9E9E9',
            },
          },
          splitNumber: 6, // 设置 Y 轴的刻度数量为 5
        },
        // 添加dataZoom组件实现X轴滑动
        dataZoom: dataZoom,
        series: series,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.barChartRoot {
  width: 100%;
  height: 100%;
  z-index: 999;
  // background-color: #532dc6;
}
.my-hn-chart {
  width: 100%;
  height: 100%;
  background: #f7fcfb;
}
</style>
