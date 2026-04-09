<template>
  <div class="lineChartRoot">
    <div :id="linechartId" class="my-hn-chart"></div>
  </div>
</template>

<script>
export default {
  name: 'LineChart',
  props: {
    // 折线图ID
    linechartId: {
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
      lineData1: [],
      lineData2: [],
      lineData3: [],
      lineData4: [],
      lineX: [],
      customColors: ['#039DEE', '#04D169', '#FD881B', '#F88080'],
    };
  },
  watch: {
    config: {
      handler(newVal, oldVal) {
        if (newVal) {
          console.log(newVal, '折线图数据');
          this.lineData1 = newVal.lineData1;
          this.lineData2 = newVal.lineData2;
          this.lineData3 = newVal.lineData3;
          this.lineData4 = newVal.lineData4;
          ((this.lineX = newVal.lineX),
            this.$nextTick(() => {
              this.setChart();
            }));
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.setChart(); // 感觉可以不要
  },
  methods: {
    setChart() {
      if (this.myChart) {
        this.myChart.dispose();
        this.myChart = null;
      }
      this.myChart = this.$echarts.init(document.querySelector(`#${this.linechartId}`));
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
      const series = [
        {
          name: '完成率',
          data: this.lineData1,
          type: 'line',
          yAxisIndex: 0, // 跟左边y轴对齐
          tooltip: {
            valueFormatter: function (value) {
              return value + ' %';
            },
          },
        },
        {
          name: '规范率',
          data: this.lineData2,
          type: 'line',
          yAxisIndex: 0,
          tooltip: {
            valueFormatter: function (value) {
              return value + ' %';
            },
          },
        },
        {
          name: '超期率',
          data: this.lineData3,
          type: 'line',
          yAxisIndex: 1, // 跟右边y轴对齐
          tooltip: {
            valueFormatter: function (value) {
              return value + ' %';
            },
          },
        },
        {
          name: '复发率',
          data: this.lineData4,
          type: 'line',
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: function (value) {
              return value + ' %';
            },
          },
        },
      ];
      // 为每个系列应用自定义颜色
      series.forEach((serie, index) => {
        // 从自定义颜色集合中循环获取颜色
        const colorPair = this.customColors[index % this.customColors.length];
        serie.itemStyle = {
          color: colorPair,
        };
      });

      return {
        // 直角坐标系位置
        grid: this.config.grid,
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: this.config.tooltipFormatter || this.defaultTooltipFormatter,
          textStyle: {
            fontSize: this.config.tooltipFontSize || 14,
          },
        },
        legend: {
          show: true,
          data: series.map((s) => s.name),
          left: 'center',
          top: 0,
          textStyle: {
            fontSize: this.config.legendFontSize || 12,
            color: this.config.legendTextColor || '#666',
          },
          // icon: this.config.legendIcon || "rect",
        },
        // x轴配置
        xAxis: {
          // 类型 category 类目轴
          type: 'category',
          // 轴刻度数据
          data: this.lineX,
          // 轴线配置
          axisLine: {
            // 轴线样式
            lineStyle: { color: '#DDDDDD' },
          },
          // 刻度配置
          axisTick: { show: false },
          // 刻度标签设置
          axisLabel: {
            interval: 0,
            color: '#415058',
          },
        },
        yAxis: [
          {
            type: 'value',
            // 轴名称
            name: '单位（%）',
            min: 0,
            max: 100,
            // interval: 5,
            splitNumber: 5, // 设置 Y 轴的刻度数量为 5
            axisLabel: {
              formatter: '{value} %',
            },
            // 名称样式
            nameTextStyle: {
              color: '#415058',
            },
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
          },
          {
            type: 'value',
            name: '单位（%）',
            // min: 0,
            // max: 100,
            // interval: 5,
            splitNumber: 5, // 设置 Y 轴的刻度数量为 5
            axisLabel: {
              formatter: '{value} %',
            },
            // 名称样式
            nameTextStyle: {
              color: '#415058',
            },
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
              color: '#fe3333',
            },
            splitLine: {
              lineStyle: {
                // 设置背景横线
                type: 'dashed',
                color: '#E9E9E9',
              },
            },
          },
        ],
        series: series,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.lineChartRoot {
  width: 100%;
  height: 100%;
  z-index: 999;
  // background-color: #532dc6;
}
.my-hn-chart {
  width: 100%;
  height: 100%;
}
</style>
