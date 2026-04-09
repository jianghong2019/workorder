<template>
  <div class="pieChartRoot">
    <div :id="pieId" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
export default {
  name: 'PieChart',
  props: {
    pieId: {
      type: String,
      default: '',
    },
    // 图表配置项
    config: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      myChart: null,
      colors: [],
      chartData: [],
    };
  },
  computed: {},
  watch: {
    config: {
      handler(newVal, oldVal) {
        if (newVal) {
          console.log(newVal, '饼状图数据');
          let colors = [];
          newVal?.data.forEach((item) => {
            colors.push(item.color);
          });
          this.colors = colors;
          this.chartData = newVal?.data;
          this.$nextTick(() => {
            this.initChart();
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  methods: {
    initChart(newVal) {
      if (this.myChart) {
        this.myChart.dispose();
        this.myChart = null;
      }
      this.myChart = this.$echarts.init(document.querySelector(`#${this.pieId}`));
      let option = {
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{b}: {c} {d}%',
          textStyle: {
            fontSize: '16',
          },
          position: function (point, params, dom, rect, size) {
            // 固定显示在鼠标右侧
            return [point[0] + 10, point[1] - size.contentSize[1] / 2];
          },
        },
        legend: {
          show: false,
          // orient: "horizontal",
          // bottom: "0%",
          // icon: 'circle',
          // data: data.map(item=>item.name),
        },
        series: [
          {
            type: 'pie',
            selectedMode: 'single',
            radius: ['80%', '60%'],
            color: this.colors,
            label: {
              show: false,
              // normal: {
              //   position: "outside",
              //   formatter: "{b} {c} {d}%",
              //   textStyle: {
              //     fontWeight: "bold",
              //     fontSize: 12,
              //   },
              // },
            },
            labelLine: {
              show: false,
              normal: {
                show: false,
              },
            },
            data: this.chartData,
          },
        ],
      };
      this.myChart.setOption(option);
      let listener = function () {
        this.myChart.resize();
      };
      this.$nextTick(() => {
        window.addEventListener('resize', listener);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pieChartRoot {
  width: 100%;
  height: 100%;
  z-index: 999;
}
</style>
