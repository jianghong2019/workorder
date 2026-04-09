<template>
  <!-- 作业超时预警配置 -->

  <el-card shadow="hover" class="config-card">
    <!-- 卡片内绿色标题 -->

    <h2 class="card-title box-linear-gradient">作业超时预警配置</h2>
    <div class="card-main">
      <!-- 说明文字 -->
      <div class="desc">
        <div>说明：</div>
        <div>
          基于工单类型分类，计算基准处理时长（<b class="text-green"
            >{{ form.standardTimeOrder }}%</b
          >
          × 该类型工单近1个月所有人员的平均处理时长 +
          <b class="text-green">{{ form.standTimePeople }}%</b> ×
          该人员近1个月同类工单的平均处理时长）， 当工单已处理时长超过基准值
          <b class="text-green">{{ form.lowRisk }}%</b> 触发<b class="text-yellow">黄色</b>预警，
          超过 <b class="text-green">{{ form.moderateRisk }}%</b> 触发<b class="text-orange">橙色</b
          >预警，超过 <b class="text-green">{{ form.serverRisk }}%</b> 触发<b class="text-red"
            >红色</b
          >预警。
        </div>
      </div>

      <!-- 表单 -->
      <div class="form-box">
        <el-form label-width="140px" :model="form">
          <!-- 基础配置 -->
          <Vtitleindex :title="'基础配置'" />
          <div class="style-padding-left">
            <el-form-item label="启用状态：">
              <el-radio-group v-model="form.enabled">
                <el-radio label="1">启用</el-radio>
                <el-radio label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- <el-form-item label="统计周期：">
              <el-input-number
                v-model="form.statisticsCycle"
                :min="1"
                :max="365"
                controls-position="right"
                class="input-number"
              />
              <span class="form-tips"
                >单位近 {{ form.statisticsCycle }} 天内完成的同类工单</span
              >
            </el-form-item>

            <el-form-item label="监控频率：">
              <el-input-number
                v-model="form.warningFrequency"
                :min="1"
                :step="1"
                controls-position="right"
                class="input-number"
              />
              <span class="form-tips"
                >预警任务每
                <b class="text-green">{{ form.warningFrequency }}</b>
                秒监控一次</span
              >
            </el-form-item> -->
          </div>
          <!-- 预警规则配置 -->
          <Vtitleindex :title="'预警规则配置'" />
          <div class="style-padding-left">
            <el-form-item label="基准处理时长权重：">
              <div class="weight-row">
                <span>同类工单平均处理时长权重</span>
                <el-input
                  v-model="form.standardTimeOrder"
                  :min="0"
                  :max="100"
                  @input="
                    form.standardTimeOrder = form.standardTimeOrder
                      .replace(/[^0-9.]/g, '')
                      .replace(/(\..*)\./g, '$1')
                  "
                  @blur="
                    form.standardTimeOrder > 100
                      ? (form.standardTimeOrder = 100)
                      : form.standardTimeOrder
                  "
                >
                  <template slot="append">%</template>
                </el-input>
                <span>+</span>
                <el-input
                  v-model="form.standTimePeople"
                  :min="0"
                  :max="100"
                  @input="
                    form.standTimePeople = form.standTimePeople
                      .replace(/[^0-9.]/g, '')
                      .replace(/(\..*)\./g, '$1')
                  "
                  @blur="
                    form.standTimePeople > 100 ? (form.standTimePeople = 100) : form.standTimePeople
                  "
                >
                  <template slot="append">%</template>
                </el-input>
                <span>个人同类工单平均处理时长权重</span>
              </div>
            </el-form-item>

            <el-form-item label="轻度风险：">
              <span>大于&nbsp;</span>
              <el-input
                v-model="form.lowRisk"
                :min="0"
                :max="100"
                @input="
                  form.lowRisk = form.lowRisk.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
                "
                @blur="form.lowRisk > 100 ? (form.lowRisk = 100) : form.lowRisk"
              >
                <template slot="append">%</template>
              </el-input>
              <span class="hint text-yellow">
                当工单已处理时长超过基准值
                <b class="text-green">{{ form.lowRisk }}%</b> 触发<b class="text-yellow">黄色</b
                >预警
              </span>
            </el-form-item>

            <el-form-item label="中度风险：">
              <span>大于&nbsp;</span>
              <el-input
                v-model="form.moderateRisk"
                :min="0"
                :max="100"
                @input="
                  form.moderateRisk = form.moderateRisk
                    .replace(/[^0-9.]/g, '')
                    .replace(/(\..*)\./g, '$1')
                "
                @blur="form.moderateRisk > 100 ? (form.moderateRisk = 100) : form.moderateRisk"
              >
                <template slot="append">%</template>
              </el-input>
              <span class="hint text-orange">
                当工单已处理时长超过基准值
                <b class="text-green">{{ form.moderateRisk }}%</b> 触发<b class="text-orange"
                  >橙色</b
                >预警
              </span>
            </el-form-item>

            <el-form-item label="严重风险：">
              <span>大于&nbsp;</span>
              <el-input
                v-model="form.serverRisk"
                :min="0"
                :max="100"
                @input="
                  form.serverRisk = form.serverRisk
                    .replace(/[^0-9.]/g, '')
                    .replace(/(\..*)\./g, '$1')
                "
                @blur="form.serverRisk > 100 ? (form.serverRisk = 100) : form.serverRisk"
              >
                <template slot="append">%</template>
              </el-input>
              <span class="hint text-red">
                当工单已处理时长超过基准值
                <b class="text-green">{{ form.serverRisk }}%</b> 触发<b class="text-red">红色</b
                >预警
              </span>
            </el-form-item>
          </div>
          <!-- 预警通知配置 -->
          <!-- <Vtitleindex :title="'预警通知配置'" />
          <div class="style-padding-left">
            <el-form-item label="预警方式：">
              <el-radio-group v-model="form.warningWay">
                <el-radio-button label="01">消息通知</el-radio-button>
                <el-radio-button label="02">短信通知</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="通知人员：">
              <el-radio-group v-model="form.notifyPerson">
                <el-radio-button label="01">管理人员</el-radio-button>
                <el-radio-button label="02">作业人员</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div> -->
        </el-form>
      </div>
      <!-- 操作按钮 -->
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
  name: 'TaskWarningConfig',
  components: {
    BaseTitleTable,
    Vtitleindex: () => import('@/components/common/tools/titleindex.vue'),
  },
  data() {
    return {
      form: {
        enabled: '1',
        statisticsCycle: 30,
        warningFrequency: 600,
        standardTimeOrder: 50,
        standTimePeople: 50,
        lowRisk: 30,
        moderateRisk: 50,
        serverRisk: 70,
        warningWay: '01',
        notifyPerson: '01',
      },
      searchData: {
        warningCategory: '07',
      },
    };
  },
  mounted() {
    this.searchQuery();
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
      }).then(() => {
        this.form = {
          enabled: '1',
          statisticsCycle: 30,
          warningFrequency: 600,
          standardTimeOrder: 50,
          standTimePeople: 50,
          lowRisk: 30,
          moderateRisk: 50,
          serverRisk: 70,
          warningWay: '01',
          notifyPerson: '01',
        };
        this.$message.info('作业超时预警配置已重置！');
      });
    },
    // 查询
    searchQuery() {
      let params = { ...this.searchData };
      // demo
      API.getAlarmSetting(params).then((res) => {
        const { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.form = res.data.DTS;
        } else {
          return this.$alert(res.data.RT_D, '提示', {
            type: 'error',
          });
        }
      });
    },
    // 保存配置
    saveConfig() {
      let params = { ...this.form, ...this.searchData };
      // demo
      API.setAlarmSetting(params).then((res) => {
        const { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.$message.success('作业超时预警配置已保存！');
          console.log('保存数据：', this.form);
          this.searchQuery();
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
