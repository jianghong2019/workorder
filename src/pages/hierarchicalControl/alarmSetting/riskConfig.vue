<template>
  <!-- 风险预警配置 -->
  <!-- 页面标题 -->
  <el-card shadow="hover" class="config-card">
    <h2 class="card-title box-linear-gradient">风险预警配置</h2>
    <div class="card-main">
      <!-- 说明文字 -->

      <div class="desc">
        <div>说明：</div>
        <div>
          通过统计作业人员近
          <b class="text-green">{{ form.statisticsCycle }}</b>
          天发生的安全风险、廉政风险、服务风险等违规事件发生频次，
          建立分级预警机制：当任一风险项发生次数><b class="text-green">{{ form.lowRisk }} </b
          >次时触发风险<b class="text-yellow">黄色</b>预警， ><b class="text-green"
            >{{ form.serverRisk }} </b
          >次时升级为风险<b class="text-red">红色</b>预警， 实现对人员作业风险的动态监测与分级管控。
        </div>
      </div>
      <div class="form-box">
        <el-form label-width="120px" :model="form">
          <!-- 基础配置 -->
          <!-- <div class="section"> -->
          <Vtitleindex :title="'基础配置'" />
          <div class="style-padding-left">
            <el-form-item label="启用状态：">
              <el-radio-group v-model="form.enabled">
                <el-radio label="1">启用</el-radio>
                <el-radio label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="统计周期：">
              <el-input-number
                v-model="form.statisticsCycle"
                :min="1"
                :max="365"
                controls-position="right"
                class="input-number"
              />
              <span class="form-tips">作业人员近{{ form.statisticsCycle }}天发生的风险问题</span>
            </el-form-item>
          </div>
          <!-- </div> -->

          <!-- 预警级别 -->
          <!-- <div class="section"> -->
          <Vtitleindex :title="'预警级别'" />
          <div class="style-padding-left">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="风险类型：">
                  <el-checkbox-group v-model="form.riskType" class="risk-types-group">
                    <el-checkbox
                      v-for="(item, index) in RiskArry"
                      :key="index"
                      :label="item.codeValue"
                      >{{ item.codeName }}</el-checkbox
                    >
                  </el-checkbox-group>
                  <p class="form-tips">注：根据所选风险类型累计风险发生次数</p>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="轻度风险：">
                  大于 &nbsp;
                  <el-input-number
                    v-model="form.lowRisk"
                    :min="1"
                    :max="99"
                    controls-position="right"
                    class="threshold-input"
                  />
                  <span class="hint">
                    作业人员发生风险次数大于
                    <b class="text-green">{{ form.lowRisk }} </b>次时触发<b class="text-yellow"
                      >黄色</b
                    >预警
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="严重风险：">
                  大于 &nbsp;
                  <el-input-number
                    v-model="form.serverRisk"
                    :min="1"
                    :max="99"
                    controls-position="right"
                    class="threshold-input"
                  />
                  <span class="hint">
                    作业人员发生风险次数大于
                    <b class="text-green">{{ form.serverRisk }} </b>次时触发<b class="text-red"
                      >红色</b
                    >预警
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 预警通知配置 -->
          <!-- <div class="section"> -->
          <!-- <Vtitleindex :title="'预警通知配置'" />
          <div class="style-padding-left">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="预警方式：">
                  <el-radio-group v-model="form.warningWay">
                    <el-radio-button label="01">消息通知</el-radio-button>
                    <el-radio-button label="02">短信通知</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="通知人员：">
                  <el-radio-group v-model="form.notifyPerson">
                    <el-radio-button label="01">管理人员</el-radio-button>
                    <el-radio-button label="02">作业人员</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </div> -->
        </el-form>
      </div>
      <!-- 按钮 -->
      <div class="button-group">
        <el-button v-debounce="[saveConfig]" type="primary">保存配置</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import BaseTitleTable from '@/components/common/form/base-title-table/index.vue';
import API from '@/api/hierarchicalControl/alarmSetting.js';
export default {
  name: 'RiskWarningConfig',
  components: {
    BaseTitleTable,
    Vtitleindex: () => import('@/components/common/tools/titleindex.vue'),
  },
  data() {
    return {
      components: {
        BaseTitleTable,
      },
      RiskArry: [],
      form: {
        enabled: '1',
        statisticsCycle: 90,
        riskType: [],
        lowRisk: 1,
        serverRisk: 2,
        warningWay: '01', // 单选
        notifyPerson: '01', // 单选
      },
      searchData: {
        warningCategory: '03',
      },
    };
  },
  mounted() {
    this.searchRiskType();
  },
  activated() {
    this.searchQuery();
  },
  methods: {
    resetForm() {
      this.$confirm('确定要重置所有配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.form = {
            enabled: '1',
            statisticsCycle: 0,
            riskType: [],
            lowRisk: 1,
            serverRisk: 2,
            warningWay: '01', // 单选
            notifyPerson: '01', // 单选
          };
          if (this.RiskArry && this.RiskArry.length > 0) {
            this.form.riskType = [this.RiskArry[0].codeValue];
          }
          this.$message.info('风险预警配置已重置!');
        })
        .catch(() => {
          // 取消操作
        });
    },
    // 查询
    searchQuery() {
      let params = { ...this.searchData };
      // demo
      API.getAlarmSetting(params).then((res) => {
        const { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          res.data.DTS.riskType = res.data.DTS.riskType.split(',');
          this.form = res.data.DTS;
        } else {
          return this.$alert(res.data.RT_D, '提示', {
            type: 'error',
          });
        }
      });
    },
    // 查询风险类型
    searchRiskType() {
      let params = { ...this.searchData };
      // demo
      API.getRiskType(params).then((res) => {
        const { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.RiskArry = res.data.DTS;
        } else {
          return this.$alert(res.data.RT_D, '提示', {
            type: 'error',
          });
        }
      });
    },
    // 保存配置
    saveConfig() {
      if (Array.isArray(this.form.riskType) && this.form.riskType.length > 0) {
        this.form.riskType = this.form.riskType.join(',');
      } else {
        this.$message.info('风险类型配置不能为空！');
        return;
      }
      let params = { ...this.form, ...this.searchData };
      // demo
      API.setAlarmSetting(params).then((res) => {
        const { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.$message.success('风险预警配置已保存！');
          console.log('保存数据：', this.form);
          this.searchQuery();
          this.searchRiskType();
        } else {
          return this.$alert(res.data.RT_D, '提示', {
            type: 'error',
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import './style.scss';
</style>
