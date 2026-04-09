<template>
  <!-- 质效预警配置 -->
  <el-card shadow="hover" class="config-card">
    <div class="card-title box-linear-gradient">质效预警配置</div>
    <div class="card-main">
      <!-- 页面标题 -->
      <div class="desc">
        <div>说明：</div>
        <div>
          通过权重计算作业人员近<b class="text-green">{{ form.statisticsCycle }}</b
          >天工单完成度（<b class="text-green">权重{{ form.finishRate }}%</b>）、工单及时率（权重{{
            form.onTimeRate
          }}%）和工单规范率（<b class="text-green">权重{{ form.standardRate }}%</b
          >）生成综合质效指标值， 并按区间实施分级预警：指标值在
          <b class="text-green">{{ form.lowRiskMax }}% ~ {{ form.lowRiskMin }}%</b>
          触发黄色预警, 在
          <b class="text-green">{{ form.serverRiskMax }}% ~ {{ form.serverRiskMin }}%</b>
          触发红色预警，实现作业能力的量化评估与风险分级提示，为直接管控人员于预提供数据支撑。
        </div>
      </div>
      <div class="form-box">
        <el-form label-width="120px" :model="form">
          <!-- 基础配置 -->
          <Vtitleindex :title="'基础配置'"></Vtitleindex>
          <div class="style-padding-left">
            <!-- <base-title-table title="基础配置"> -->
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
                :step="1"
                controls-position="right"
                class="input-number-box"
              />
              <span class="form-tips">作业人员最近{{ form.statisticsCycle }}天内完成的工单</span>
            </el-form-item>
            <!-- </base-title-table> -->
          </div>
          <!-- 质效指标权重 -->
          <Vtitleindex :title="'质效指标权重'"></Vtitleindex>
          <el-row :gutter="20" class="style-padding-left">
            <el-col :span="24">
              <el-form-item label="工单完成率：">
                <el-input
                  v-model="form.finishRate"
                  :min="0"
                  :max="100"
                  @input="
                    form.finishRate = form.finishRate
                      .replace(/[^0-9.]/g, '')
                      .replace(/(\..*)\./g, '$1')
                  "
                  @blur="form.finishRate > 100 ? (form.finishRate = 100) : form.finishRate"
                >
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="工单及时率：">
                <el-input
                  v-model="form.onTimeRate"
                  :min="0"
                  :max="100"
                  @input="
                    form.onTimeRate = form.onTimeRate
                      .replace(/[^0-9.]/g, '')
                      .replace(/(\..*)\./g, '$1')
                  "
                  @blur="form.onTimeRate > 100 ? (form.onTimeRate = 100) : form.onTimeRate"
                >
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="工单规范率：">
                <el-input
                  v-model="form.standardRate"
                  :min="0"
                  :max="100"
                  @input="
                    form.standardRate = form.standardRate
                      .replace(/[^0-9.]/g, '')
                      .replace(/(\..*)\./g, '$1')
                  "
                  @blur="form.standardRate > 100 ? (form.standardRate = 100) : form.standardRate"
                >
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 预警规则配置 -->
          <Vtitleindex :title="'预警规则配置'"></Vtitleindex>
          <el-row :gutter="20" class="style-padding-left">
            <el-col :span="24">
              <el-form-item label="轻度风险区间：">
                <el-input
                  v-model="form.lowRiskMax"
                  :min="0"
                  :max="100"
                  @input="
                    form.lowRiskMax = form.lowRiskMax
                      .replace(/[^0-9.]/g, '')
                      .replace(/(\..*)\./g, '$1')
                  "
                  @blur="form.lowRiskMax > 100 ? (form.lowRiskMax = 100) : form.lowRiskMax"
                >
                  <template slot="append">%</template>
                </el-input>
                -
                <el-input
                  v-model="form.lowRiskMin"
                  :min="0"
                  :max="100"
                  @input="
                    form.lowRiskMin = form.lowRiskMin
                      .replace(/[^0-9.]/g, '')
                      .replace(/(\..*)\./g, '$1')
                  "
                  @blur="form.lowRiskMin > 100 ? (form.lowRiskMin = 100) : form.lowRiskMin"
                >
                  <template slot="append">%</template>
                </el-input>
                <span class="hint"
                  >作业人员综合质效指标值<b class="text-green"
                    >{{ form.lowRiskMax }}%-{{ form.lowRiskMin }}%</b
                  >触发<b class="text-yellow">黄色</b>预警</span
                >
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="严重风险区间：">
                <el-input
                  v-model="form.serverRiskMax"
                  :min="0"
                  :max="100"
                  @input="
                    form.serverRiskMax = form.serverRiskMax
                      .replace(/[^0-9.]/g, '')
                      .replace(/(\..*)\./g, '$1')
                  "
                  @blur="form.serverRiskMax > 100 ? (form.serverRiskMax = 100) : form.serverRiskMax"
                >
                  <template slot="append">%</template>
                </el-input>
                -
                <el-input
                  v-model="form.serverRiskMin"
                  :min="0"
                  :max="100"
                  @input="
                    form.serverRiskMin = form.serverRiskMin
                      .replace(/[^0-9.]/g, '')
                      .replace(/(\..*)\./g, '$1')
                  "
                  @blur="form.serverRiskMin > 100 ? (form.serverRiskMin = 100) : form.serverRiskMin"
                >
                  <template slot="append">%</template>
                </el-input>
                <span class="hint"
                  >作业人员综合质效指标值<b class="text-green"
                    >{{ form.serverRiskMax }}%-{{ form.serverRiskMin }}%</b
                  >触发<b class="text-red">红色</b>预警</span
                >
              </el-form-item>
            </el-col>
          </el-row>
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
  components: {
    BaseTitleTable,
    Vtitleindex: () => import('@/components/common/tools/titleindex.vue'),
  },
  data() {
    return {
      form: {
        enabled: '1',
        statisticsCycle: 11,
        finishRate: 30,
        onTimeRate: 35,
        standardRate: 35,
        lowRiskMax: 98,
        lowRiskMin: 88,
        serverRiskMax: 87,
        serverRiskMin: 0,
        notifyPerson: '02',
        warningWay: '01',
      },
      searchData: {
        warningCategory: '01',
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
      })
        .then(() => {
          this.form = {
            enabled: '',
            statisticsCycle: 0,
            finishRate: 0,
            onTimeRate: 0,
            standardRate: 0,
            lowRiskMax: 0,
            lowRiskMin: 0,
            serverRiskMax: 0,
            serverRiskMin: 0,
            notifyPerson: '',
            warningWay: '',
          };
          this.$message.info('质效预警配置已重置!');
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
          this.$message.success('质效预警配置已保存！');
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
