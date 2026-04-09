<template>
  <!-- 工单超期预警配置 -->
  <el-card shadow="hover" class="config-card">
    <!-- 卡片内绿色标题 -->

    <h2 class="card-title box-linear-gradient">工单超期预警配置</h2>
    <div class="card-main">
      <!-- 说明文字 -->
      <div class="desc">
        <div>说明：</div>
        <div>
          当工单实际耗时超出工单要求处理时长
          <b class="text-green">{{ form.lowRisk }}%</b> 触发<b class="text-yellow">黄色</b>预警，
          超出 <b class="text-green">{{ form.moderateRisk }}%</b> 触发<b class="text-orange">橙色</b
          >预警，超出 <b class="text-green">{{ form.serverRisk }}%</b> 触发<b class="text-red"
            >红色</b
          >预警。
        </div>
      </div>

      <!-- 表单 -->
      <div class="form-box">
        <el-form label-width="120px" :model="form">
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
                controls-position="right"
                :max="365"
              />
              <span class="form-tips"
                >作业人员近 {{ form.statisticsCycle }} 天内完成的工单</span
              >
            </el-form-item>

            <el-form-item label="预警频率：">
              每天&nbsp;
              <el-time-picker
                v-model="form.warningFrequency"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="选择时间"
              />
              <span class="form-tips"
                >每天
                <b class="text-green">{{ form.warningFrequency }}</b>
                计算预计工时</span
              >
            </el-form-item> -->
          </div>
          <!-- 预警规则配置 -->
          <Vtitleindex :title="'预警规则配置'" />
          <div class="style-padding-left">
            <el-form-item label="轻度风险：">
              <span>超出&nbsp;</span>
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
                当工单已处理时长超出工单要求处理时长
                <b class="text-green">{{ form.lowRisk }}%</b> 触发<b class="text-yellow">黄色</b
                >预警
              </span>
            </el-form-item>

            <el-form-item label="中度风险：">
              <span>超出&nbsp;</span>
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
                当工单已处理时长超出工单要求处理时长
                <b class="text-green">{{ form.moderateRisk }}%</b> 触发<b class="text-orange"
                  >橙色</b
                >预警
              </span>
            </el-form-item>

            <el-form-item label="严重风险：">
              <span>超出&nbsp;</span>
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
                当工单已处理时长超出工单要求处理时长
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
  name: 'WorkOrderWarningConfig',
  components: {
    BaseTitleTable,
    Vtitleindex: () => import('@/components/common/tools/titleindex.vue'),
  },
  data() {
    return {
      form: {
        enabled: '0',
        statisticsCycle: 30,
        warningFrequency: null,
        lowRisk: 20,
        moderateRisk: 50,
        serverRisk: 100,
        warningWay: '01',
        notifyPerson: '01',
      },
      searchData: {
        warningCategory: '08',
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
          warningFrequency: '06:00',
          time: '06:00',
          lowRisk: 20,
          moderateRisk: 50,
          serverRisk: 100,
          warningWay: '01',
          notifyPerson: '01',
        };
        this.$message.info('工单超期预警配置已重置！');
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
          this.$message.success('工单超期预警配置已保存！');
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
