<template>
  <!-- 承载力预警配置 -->
  <!-- 页面标题 -->
  <el-card shadow="hover" class="config-card">
    <!-- 说明文字 -->
    <h2 class="card-title box-linear-gradient">承载力预警配置</h2>
    <div class="card-main">
      <div class="desc">
        <div>说明：</div>
        <div>
          定时计算作业人员每类工单待办作业时常，预测该作业人员当日预计总工时。当预计总工时超过标准工时（<b
            class="text-green"
            >{{ form.standardHours }}小时</b
          >，可配置）的<b class="text-green">{{ form.lowRisk }}%</b>触发轻度预警，达<b
            class="text-green"
            >{{ form.moderateRisk }}%</b
          >升级为中度预警，超过<b class="text-green">{{ form.serverRisk }}%</b
          >判定为重度预警，实现工单承载力的动态评估与三级预警，为管理人员提供任务调配依据。
        </div>
      </div>

      <div class="form-box">
        <el-form label-width="120px" :model="form">
          <!-- 基础配置 -->
          <Vtitleindex :title="'基础配置'" />
          <div class="style-padding-left">
            <el-form-item label="启用状态：">
              <el-radio-group v-model="form.enabled">
                <el-radio v-model="form.enable" label="1">启用</el-radio>
                <el-radio v-model="form.enable" label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="预警周期：">
              <el-input-number
                v-model="form.statisticsCycle"
                :min="1"
                :step="1"
                controls-position="right"
              />
              <span class="form-tips"
                >统计作业人员近<b class="text-green">{{ form.statisticsCycle }}</b
                >天待处理工单的作业时长</span
              >
            </el-form-item>

            <el-form-item label="预警频率：">
              <el-input-number
                v-model="form.warningFrequency"
                :min="1"
                :step="1"
                controls-position="right"
                class="input-number"
              />
              <span class="form-tips">
                每
                <b class="text-green">{{ form.warningFrequency }} </b>分钟获取一次人员承载力</span
              >
            </el-form-item>
          </div>
          <!-- 预警规则配置 -->
          <Vtitleindex :title="'预警规则配置'" />
          <div class="style-padding-left">
            <el-form-item label="标准工时：">
              <el-input-number
                v-model="form.standardHours"
                :min="1"
                :step="1"
                controls-position="right"
              />
              小时
            </el-form-item>

            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="轻度风险：">
                  预计工时超出
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
                  <span class="hint">
                    当预计工时超过标准工时<b class="text-green">{{ form.lowRisk }}%</b>触发<b
                      class="text-yellow"
                      >黄色</b
                    >预警</span
                  >
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="中度风险：">
                  预计工时超出
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
                  <span class="hint">
                    当预计工时超过标准工时<b class="text-green">{{ form.moderateRisk }}%</b>触发<b
                      class="text-orange"
                      >橙色</b
                    >预警</span
                  >
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="严重风险：">
                  预计工时超出
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
                  <span class="hint">
                    当预计工时超过标准工时<b class="text-green">{{ form.serverRisk }}%</b>触发<b
                      class="text-red"
                      >红色</b
                    >预警</span
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!-- 预警通知配置 -->
          <!-- <Vtitleindex :title="'预警通知配置'" />
          <div class="style-padding-left">
            <el-form-item label="通知方式：">
              <el-radio-group v-model="form.warningWay">
                <el-radio-button label="01">消息通知</el-radio-button>
                <el-radio-button label="02">短信通知</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="通知人员：">
              <el-radio-group v-model="form.notifyPerson">
                <el-radio-button label="01">管理员</el-radio-button>
                <el-radio-button label="02">作业人员</el-radio-button>
              </el-radio-group>
            </el-form-item>
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
  name: 'LoadCapacityWarningConfig',
  components: {
    BaseTitleTable,
    Vtitleindex: () => import('@/components/common/tools/titleindex.vue'),
  },
  data() {
    return {
      form: {
        enabled: '1',
        statisticsCycle: 90,
        warningFrequency: null,
        standardHours: 8,
        lowRisk: 10,
        moderateRisk: 20,
        serverRisk: 51,
        warningWay: '01',
        notifyPerson: '01',
      },
      searchData: {
        warningCategory: '02',
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
    format24HourTime(dateInput) {
      const date = new Date(dateInput);
      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        console.error('无效的日期格式:', dateInput);
        return '无效时间';
      }
      return `${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    },

    getDefaultTime() {
      const now = new Date();
      now.setHours(6, 0, 0, 0); // 设置为6:00:00
      return now;
    },
    parseTimeToToday(timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const now = new Date();
      now.setHours(hours, minutes, 0, 0); // 设置时、分、秒、毫秒
      return now;
    },
    resetForm() {
      this.formData.time = this.getDefaultTime(); // 重置时也设为6点
    },

    resetForm() {
      this.$confirm('确定要重置所有配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.form = {
            enabled: '',
            statisticsCycle: 0,
            warningFrequency: '06:00',
            standardHours: 0,
            lowRisk: 10,
            moderateRisk: 20,
            serverRisk: 51,
            warningWay: '01',
            notifyPerson: '01',
          };
          this.$message.info('承载力预警配置已重置！');
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
          this.$message.success('承载力预警配置已保存！');
          console.log('保存数据：', this.form);
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
