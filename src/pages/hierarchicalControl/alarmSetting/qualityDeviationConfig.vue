<template>
  <!-- 质量偏差预警配置 -->
  <el-card shadow="hover" class="config-card">
    <!-- 卡片内绿色标题 -->
    <h2 class="card-title box-linear-gradient">质量偏差预警配置</h2>
    <div class="card-main">
      <!-- 说明文字 -->
      <div class="desc">
        <div>说明：</div>
        <div>
          当出现质量问题大于等于
          <b class="text-green">{{ form.lowRisk }}</b> 次，系统触发<b class="text-yellow">黄色</b
          >预警； 当出现质量问题大于等于
          <b class="text-green">{{ form.moderateRisk }}</b> 次，系统触发<b class="text-orange"
            >橙色</b
          >预警，并启动近7日工单复查； 当出现质量问题大于等于
          <b class="text-green">{{ form.serverRisk }}</b> 次，系统触发<b class="text-red">红色</b
          >预警，启动近1月工单复查。
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

            <el-form-item label="统计周期：">
              <el-input-number
                v-model="form.statisticsCycle"
                :min="1"
                :max="365"
                controls-position="right"
                class="input-number"
              />
              <span class="form-tips"
                >作业人员近
                <b class="text-green">{{ form.statisticsCycle }}天</b>
                内完成的工单</span
              >
            </el-form-item>
          </div>
          <!-- 预警规则配置 -->
          <Vtitleindex :title="'预警规则配置'" />
          <div class="style-padding-left">
            <el-form-item label="轻度风险：">
              <span>大于&nbsp;</span>
              <el-input-number
                v-model="form.lowRisk"
                :min="0"
                :step="1"
                controls-position="right"
              />
              <span class="hint text-yellow">
                当出现质量问题大于 <b class="text-green">{{ form.lowRisk }}</b> 次触发<b
                  class="text-yellow"
                  >黄色</b
                >预警
              </span>
            </el-form-item>

            <el-form-item label="中度风险：">
              <span>大于等于&nbsp;</span>
              <el-input-number
                v-model="form.moderateRisk"
                :min="0"
                :step="1"
                controls-position="right"
              />
              <span class="hint text-orange">
                当出现质量问题大于等于 <b class="text-green">{{ form.moderateRisk }}</b> 次触发<b
                  class="text-orange"
                  >橙色</b
                >预警
              </span>
            </el-form-item>

            <el-form-item label="严重风险：">
              <span>大于等于&nbsp;</span>
              <el-input-number
                v-model="form.serverRisk"
                :min="0"
                :step="1"
                controls-position="right"
              />
              <span class="hint text-red">
                当出现质量问题大于等于 <b class="text-green">{{ form.serverRisk }}</b> 次触发<b
                  class="text-red"
                  >红色</b
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
  name: 'QualityWarningConfig',
  components: {
    BaseTitleTable,
    Vtitleindex: () => import('@/components/common/tools/titleindex.vue'),
  },
  data() {
    return {
      form: {
        enabled: '1',
        statisticsCycle: 1,
        lowRisk: 0,
        moderateRisk: 3,
        serverRisk: 9,
        warningWay: '01',
        notifyPerson: '01',
      },
      searchData: {
        warningCategory: '09',
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
    saveConfig() {
      this.$message.success('质量偏差预警配置已保存！');
      console.log('保存数据：', this.form);
    },
    resetForm() {
      this.$confirm('确定要重置所有配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.form = {
          enabled: '1',
          statisticsCycle: 1,
          lowRisk: 0,
          moderateRisk: 3,
          serverRisk: 9,
          warningWay: '01',
          notifyPerson: '01',
        };
        this.$message.info('质量偏差预警配置已重置！');
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
          console.log('res.data.DTS', this.form);
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
          this.$message.success('质量偏差预警配置已保存！');
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
