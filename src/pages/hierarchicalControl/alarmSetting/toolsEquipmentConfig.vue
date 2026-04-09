<template>
  <!-- 仪表仪器配置 -->
  <el-card shadow="hover" class="config-card">
    <!-- 卡片内绿色标题 -->

    <h2 class="card-title box-linear-gradient">工器具预警配置</h2>
    <div class="card-main">
      <!-- 说明文字 -->
      <div class="desc">
        <div>说明：</div>
        <div>
          基于各类工器具领用总数与实际使用数量计算工器具使用率，当使用率低于<b class="text-green"
            >预设的使用率</b
          >时，触发各类工器具预警。
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

            <el-form-item label="工器具类型：">
              <el-checkbox-group
                v-model="form.deviceTypes"
                class="risk-types-group"
                @change="showDeviceType"
              >
                <el-checkbox
                  v-for="(item, index) in ToolsArry"
                  :key="index"
                  :label="item.codeValue"
                  >{{ item.codeName }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </div>
          <!-- 预警规则配置 -->
          <Vtitleindex :title="'预警规则配置'" />
          <div class="style-padding-left">
            <div v-for="(item, index) in deviceRule" :key="index" class="instrument-rule-item">
              <template v-if="item.visible">
                <div class="instrument-name">
                  {{ item.deviceType }}
                </div>
                <el-form-item label="使用率：">
                  <span>小于&nbsp;</span>
                  <el-input
                    v-model="item.useRate"
                    :min="0"
                    :max="100"
                    @input="
                      item.useRate = item.useRate.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
                    "
                    @blur="item.useRate > 100 ? (item.useRate = 100) : item.useRate"
                  >
                    <template slot="append">%</template>
                  </el-input>
                  <span class="hint">
                    单位
                    <b class="text-green">{{ item.deviceType }}</b>
                    的使用率小于标准（<b class="text-green">{{ item.useRate }}%</b>）触发预警
                  </span>
                </el-form-item>
              </template>
            </div>
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
  name: 'ToolWarningConfig',
  components: {
    BaseTitleTable,
    Vtitleindex: () => import('@/components/common/tools/titleindex.vue'),
  },
  data() {
    return {
      form: {
        enabled: '1',
        deviceTypes: [],
        warningWay: '01',
        notifyPerson: '01',
      },
      ToolsArry: [],
      // 预警规则数据：每个仪器对应一个使用率阈值
      deviceRule: [],
      searchData: {
        warningCategory: '04',
      },
    };
  },
  watch: {
    // 监听 instrumentTypes 变化，动态显示/隐藏对应的规则项
    'form.deviceTypes': {
      handler(newVal) {
        if (Array.isArray(newVal)) {
          console.log(this.deviceRule, '-----------------this.deviceRule');
          this.deviceRule = this.deviceRule.map((item) => ({
            ...item,
            visible: newVal.includes(item.deviceTypeValue),
          }));
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.searchDeviceType();
  },

  activated() {
    this.searchQuery();
  },
  methods: {
    showDeviceType(value) {
      const values = value;
      const selectItems = this.ToolsArry.filter((item) => values.includes(item.codeValue));

      const existingMap = new Map(
        this.deviceRule.map((item) => [item.deviceTypeValue, item.useRate])
      );
      this.deviceRule = value.map((codeValue) => {
        const item = this.ToolsArry.find((t) => t.codeValue === codeValue);
        return {
          deviceType: item ? item.codeName : '',
          deviceTypeValue: item ? item.codeValue : codeValue,
          useRate: existingMap.has(codeValue) ? existingMap.get(codeValue) : 80,
          value: codeValue,
          visible: true,
        };
      });
      console.log(this.deviceRule, 'this.deviceRule');
    },
    resetForm() {
      this.$confirm('确定要重置所有配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.form = {
          enabled: '1',
          deviceTypes: [],
          warningWay: '01',
          notifyPerson: '01',
        };
        this.deviceRule = [];
        // 初始化 diveceRule
        if (this.ToolsArry && this.ToolsArry.length > 0) {
          this.ToolsArry.forEach((tool) => {
            this.deviceRule.push({
              deviceType: tool.codeName,
              deviceTypeValue: tool.codeValue,
              useRate: 80,
              value: tool.codeValue,
              visible: true,
            });
          });
        }

        if (this.ToolsArry && this.ToolsArry.length > 0) {
          this.form.deviceTypes = [this.ToolsArry[0].codeValue];
        }
        this.$message.info('工器具配置已重置！');
      });
    },
    // 查询
    searchQuery() {
      let params = { ...this.searchData };
      // demo
      API.getAlarmSetting(params).then((res) => {
        const { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          res.data.DTS.deviceTypes = res.data.DTS.deviceTypes.split(',');
          console.log('res.data.DTS', res.data.DTS);
          this.arrayList = JSON.parse(res.data.DTS.deviceRule);
          let array = this.arrayList;
          for (let i = 0; i < array.length; i++) {
            if (array[i].deviceType) {
              for (let j = 0; j < this.ToolsArry.length; j++) {
                if (this.ToolsArry[j].codeValue === array[i].deviceType) {
                  array[i].deviceTypeValue = array[i].deviceType;
                  array[i].deviceType = this.ToolsArry[j].codeName;
                  array[i].value = j + 1 < 10 ? '0' + (j + 1) : String(j + 1);
                }
              }
            }
          }
          console.log('positionsindex', array);

          this.deviceRule = array?.map((item, index) => {
            return {
              ...item,
            };
          });

          this.form = res.data.DTS;
          console.log('res.data.DTS', this.form);
        } else {
          return this.$alert(res.data.RT_D, '提示', {
            type: 'error',
          });
        }
      });
    },
    // 查询仪表仪具类型
    async searchDeviceType() {
      let params = { ...this.searchData };
      // demo
      let res = await API.getDeviceType(params);
      const { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.ToolsArry = res.data.DTS;
        this.searchQuery();
      } else {
        return this.$alert(res.data.RT_D, '提示', {
          type: 'error',
        });
      }
    },
    // 保存配置
    saveConfig() {
      if (Array.isArray(this.form.deviceTypes) && this.form.deviceTypes.length > 0) {
        this.form.deviceTypes = this.form.deviceTypes.join(',');
      } else {
        this.$message.info('工器具类型配置不能为空！');
        return;
      }

      const visibleList = this.deviceRule
        .filter((item) => item.visible === true)
        .map(({ visible, value, ...rest }) => rest)
        .map((item) => ({
          deviceType: item.deviceTypeValue,
          useRate: item.useRate,
        }));
      const resultStr = JSON.stringify(visibleList);

      if (visibleList) {
        this.form.deviceRule = resultStr;
      } else {
        this.form.deviceRule = [];
      }

      let params = { ...this.form, ...this.searchData };
      // demo
      API.setAlarmSetting(params).then((res) => {
        const { DTS, RT_F, RT_D } = res.data;
        if (RT_F == 1 && DTS) {
          this.$message.success('工器具配置已保存！');
          console.log('保存数据：', this.form);
          this.searchQuery();
          this.searchDeviceType();
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
