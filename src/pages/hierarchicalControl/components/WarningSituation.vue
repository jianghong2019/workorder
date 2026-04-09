<template>
  <el-container class="new-safeweb-web">
    <!-- 预警情况 -->
    <div v-show="isCollapsed1" class="work-order-card" shadow="never">
      <div class="card-header">
        <span class="card-title"
          >预警情况
          <div :class="'arrow-down'" class="card-arrow" @click="toggleCollapse"></div
        ></span>

        <div class="header-right">
          <el-button-group class="date-selector">
            <el-button
              v-for="item in dateOptions"
              :key="item.value"
              :class="['date-btn', { active: selectedDate === item.value }]"
              size="small"
              @click="selectedDate = item.value"
            >
              {{ item.label }}
            </el-button>
          </el-button-group>
          <span class="more" @click="goNewPage('warningStatistics')">更多</span>
        </div>
      </div>
      <div class="card-body">
        <!-- 事前管控预警 -->
        <div class="section">
          <div class="sectionTitle">事前管控预警</div>
          <div class="sectionItem">
            <el-popover
              placement="bottom-start"
              title=""
              width="450"
              trigger="hover"
              :class="['item', totala > 0 ? 'chengzair' : 'chengzaig']"
              :disabled="!totala > 0"
            >
              <div
                class="popcontainer"
                style="display: flex; justify-content: space-between; align-items: center"
              >
                <div
                  class="poptext1"
                  :style="{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景1.svg') + ')',
                  }"
                >
                  <img
                    src="@/assets/iconfont/icon/超出1.svg"
                    alt="baobiao"
                    width="25"
                    height="25"
                    style="margin-right: 5px"
                  />
                  <div>
                    <div>{{ warningRuleAA }}</div>
                    <div>{{ waringNumAA }}人</div>
                  </div>
                </div>
                <div
                  class="poptext2"
                  :style="{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景2.svg') + ')',
                  }"
                >
                  <img
                    src="@/assets/iconfont/icon/超出2.svg"
                    alt="baobiao"
                    width="25"
                    height="25"
                    style="margin-right: 5px"
                  />
                  <div>
                    <div>{{ warningRuleAB }}</div>
                    <div>{{ waringNumAB }}人</div>
                  </div>
                </div>
                <div
                  class="poptext3"
                  :style="{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景3.svg') + ')',
                  }"
                >
                  <img
                    src="@/assets/iconfont/icon/超出3.svg"
                    alt="baobiao"
                    width="25"
                    height="25"
                    style="margin-right: 5px"
                  />
                  <div>
                    <div>{{ warningRuleAC }}</div>
                    <div>{{ waringNumAC }}人</div>
                  </div>
                </div>
              </div>
              <div v-if="totala > 0" slot="reference" @click="openOrder('01')">
                <el-badge :value="totala" class="badgeitem">承载力</el-badge>
              </div>
              <div v-else slot="reference">
                <span>承载力</span>
              </div>
            </el-popover>
            <el-popover
              placement="bottom"
              title=""
              width="450"
              trigger="hover"
              :class="['item', totalb > 0 ? 'wuzir' : 'wuzig']"
              :disabled="!totalb > 0"
            >
              <div style="display: flex; justify-content: space-between; align-items: center">
                <div>物资名称</div>
                <div>库存量</div>
                <div>日需求量</div>
                <div>预警天数</div>
                <div>可维持天数</div>
                <div>预警状态</div>
              </div>
              <div
                v-for="(item, index) in arrayb"
                :key="index"
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景1.svg') + ')',
                }"
              >
                <div style="text-align: center; width: 15%">
                  {{ item.typeName }}
                </div>
                <div style="text-align: center; width: 15%">
                  {{ item.quantity }}
                </div>
                <div style="text-align: center; width: 15%">
                  {{ item.dayNeedNum }}
                </div>
                <div style="text-align: center; width: 15%">
                  {{ item.keepDay }}
                </div>
                <div style="text-align: center; width: 15%">
                  {{ item.maintainDay }}
                </div>
                <div style="text-align: center; width: 15%">预警</div>
              </div>
              <div v-if="totalb > 0" slot="reference" @click="openOrder('02')">
                <el-badge :value="totalb" class="badgeitem">物资</el-badge>
              </div>
              <div v-else slot="reference">
                <span>物资</span>
              </div>
            </el-popover>
            <el-popover
              placement="bottom-end"
              title=""
              width="450"
              trigger="hover"
              :class="['item', totalc > 0 ? 'zhixiaor' : 'zhixiaog']"
              :disabled="!totalc > 0"
            >
              <div
                class="popcontainer"
                style="display: flex; justify-content: space-between; align-items: center"
              >
                <div
                  class="poptext1"
                  :style="{
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    width: '46%',
                    backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景1.svg') + ')',
                  }"
                >
                  <img
                    src="@/assets/iconfont/icon/超出1.svg"
                    alt="baobiao"
                    width="25"
                    height="25"
                    style="margin-right: 5px"
                  />
                  <div>
                    <div>{{ warningRuleA }}</div>
                    <div>{{ waringNumCA }}人</div>
                  </div>
                </div>
                <div
                  class="poptext3"
                  :style="{
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    width: '46%',
                    backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景3.svg') + ')',
                  }"
                >
                  <img
                    src="@/assets/iconfont/icon/超出3.svg"
                    alt="baobiao"
                    width="25"
                    height="25"
                    style="margin-right: 5px"
                  />
                  <div>
                    <div>{{ warningRuleB }}</div>
                    <div>{{ waringNumCB }}人</div>
                  </div>
                </div>
              </div>
              <div v-if="totalc > 0" slot="reference" @click="openOrder('03')">
                <el-badge :value="totalc" class="badgeitem">质效</el-badge>
              </div>
              <div v-else slot="reference">
                <span>质效</span>
              </div>
            </el-popover>
          </div>
          <div class="sectionItem">
            <el-popover
              placement="bottom-start"
              title=""
              width="450"
              trigger="hover"
              :class="['item', totald > 0 ? 'fengxianr' : 'fengxiang']"
              :disabled="!totald > 0"
            >
              <div
                class="popcontainer"
                style="display: flex; justify-content: space-between; align-items: center"
              >
                <div
                  class="poptext1"
                  :style="{
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    width: '46%',
                    backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景1.svg') + ')',
                  }"
                >
                  <img
                    src="@/assets/iconfont/icon/超出1.svg"
                    alt="baobiao"
                    width="25"
                    height="25"
                    style="margin-right: 5px"
                  />
                  <div>
                    <div>{{ warningRuleDA }}次</div>
                    <div>{{ waringNumDA }}人</div>
                  </div>
                </div>
                <div
                  class="poptext3"
                  :style="{
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    width: '46%',
                    backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景3.svg') + ')',
                  }"
                >
                  <img
                    src="@/assets/iconfont/icon/超出3.svg"
                    alt="baobiao"
                    width="25"
                    height="25"
                    style="margin-right: 5px"
                  />
                  <div>
                    <div>{{ warningRuleDB }}次</div>
                    <div>{{ waringNumDB }}人</div>
                  </div>
                </div>
              </div>
              <div v-if="totald > 0" slot="reference" @click="openOrder('04')">
                <el-badge :value="totald" class="badgeitem">风险</el-badge>
              </div>
              <div v-else slot="reference">
                <span>风险</span>
              </div>
            </el-popover>
            <el-popover
              placement="bottom"
              title=""
              width="450"
              trigger="hover"
              class="item cheliang"
              :disabled="true"
            >
              <div style="display: flex; justify-content: space-between; align-items: center">
                <div>车辆总数</div>
                <div>空闲数量</div>
                <div>申请次数</div>
                <div>预警时段</div>
                <div>预警状态</div>
              </div>
              <div
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景1.svg') + ')',
                }"
              >
                <div style="text-align: center; width: 19%"></div>
                <div style="text-align: center; width: 19%"></div>
                <div style="text-align: center; width: 19%"></div>
                <div style="text-align: center; width: 19%"></div>
                <div style="text-align: center; width: 19%"></div>
              </div>
              <div slot="reference">车辆</div></el-popover
            >
            <el-popover
              placement="bottom-end"
              title=""
              width="450"
              trigger="hover"
              :class="['item', totalf > 0 ? 'yiqir' : 'yiqig']"
              :disabled="!totalf > 0"
            >
              <div style="display: flex; justify-content: space-between; align-items: center">
                <div>工器具名称</div>
                <div>领用数量</div>
                <div>在用数量</div>
                <div>使用率</div>
                <div>预警状态</div>
              </div>
              <div
                v-for="(item, index) in arrayf"
                :key="index"
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景1.svg') + ')',
                }"
              >
                <div style="text-align: center; width: 19%">
                  {{ item.deviceName }}
                </div>
                <div style="text-align: center; width: 19%">
                  {{ item.receivedNum }}
                </div>
                <div style="text-align: center; width: 19%">
                  {{ item.currentUseNum }}
                </div>
                <div style="text-align: center; width: 19%">
                  {{ item.useRate }}
                </div>
                <div style="text-align: center; width: 19%">预警</div>
              </div>
              <div v-if="totalf > 0" slot="reference" @click="openOrder('06')">
                <el-badge :value="totalf" class="badgeitem">工器具</el-badge>
              </div>
              <div v-else slot="reference">
                <span>工器具</span>
              </div>
            </el-popover>
          </div>
        </div>
        <!-- 过程实时监控 -->
        <div class="section">
          <div class="sectionTitle">过程实时监控</div>
          <div class="sectionItem">
            <el-popover
              placement="bottom-start"
              title=""
              width="450"
              trigger="hover"
              :class="['item', totalg > 0 ? 'chaoqir' : 'chaoqig']"
              :disabled="!totalg > 0"
            >
              <div>作业时长监控</div>
              <div
                class="popcontainer"
                style="display: flex; justify-content: space-between; align-items: center"
              >
                <div
                  class="poptext1"
                  :style="{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景1.svg') + ')',
                  }"
                >
                  <img
                    src="@/assets/iconfont/icon/超出1.svg"
                    alt="baobiao"
                    width="25"
                    height="25"
                    style="margin-right: 5px"
                  />
                  <div>
                    <div>超出{{ warningRuleGA }}%</div>
                    <div>{{ waringNumGA }}工单</div>
                  </div>
                </div>
                <div
                  class="poptext2"
                  :style="{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景2.svg') + ')',
                  }"
                >
                  <img
                    src="@/assets/iconfont/icon/超出2.svg"
                    alt="baobiao"
                    width="25"
                    height="25"
                    style="margin-right: 5px"
                  />
                  <div>
                    <div>超出{{ warningRuleGB }}%</div>
                    <div>{{ waringNumGB }}工单</div>
                  </div>
                </div>
                <div
                  class="poptext3"
                  :style="{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景3.svg') + ')',
                  }"
                >
                  <img
                    src="@/assets/iconfont/icon/超出3.svg"
                    alt="baobiao"
                    width="25"
                    height="25"
                    style="margin-right: 5px"
                  />
                  <div>
                    <div>超出{{ warningRuleGC }}%</div>
                    <div>{{ waringNumGC }}工单</div>
                  </div>
                </div>
              </div>
              <div v-if="totalg > 0" slot="reference" @click="openOrder('07')">
                <el-badge :value="totalg" class="badgeitem maglet">工单超期</el-badge>
              </div>
              <div v-else slot="reference">
                <span class="maglet">工单超期</span>
              </div>
            </el-popover>
            <el-popover
              placement="bottom"
              title=""
              width="450"
              trigger="hover"
              :class="['item', totalh > 0 ? 'pianchar' : 'pianchag']"
              :disabled="!totalh > 0"
            >
              <div>作业质量监控</div>
              <div
                class="popcontainer"
                style="display: flex; justify-content: space-between; align-items: center"
              >
                <div
                  class="poptext1"
                  :style="{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景1.svg') + ')',
                  }"
                >
                  <img
                    src="@/assets/iconfont/icon/超出1.svg"
                    alt="baobiao"
                    width="25"
                    height="25"
                    style="margin-right: 5px"
                  />
                  <div>
                    <div>{{ warningRuleHA }}</div>
                    <div>{{ waringNumHA }}人</div>
                  </div>
                </div>
                <div
                  class="poptext2"
                  :style="{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景2.svg') + ')',
                  }"
                >
                  <img
                    src="@/assets/iconfont/icon/超出2.svg"
                    alt="baobiao"
                    width="25"
                    height="25"
                    style="margin-right: 5px"
                  />
                  <div>
                    <div>{{ warningRuleHB }}</div>
                    <div>{{ waringNumHB }}人</div>
                  </div>
                </div>
                <div
                  class="poptext3"
                  :style="{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景3.svg') + ')',
                  }"
                >
                  <img
                    src="@/assets/iconfont/icon/超出3.svg"
                    alt="baobiao"
                    width="25"
                    height="25"
                    style="margin-right: 5px"
                  />
                  <div>
                    <div>{{ warningRuleHC }}</div>
                    <div>{{ waringNumHC }}人</div>
                  </div>
                </div>
              </div>
              <div v-if="totalh > 0" slot="reference" @click="openOrder('08')">
                <el-badge :value="totalh" class="badgeitem maglet">质量偏差</el-badge>
              </div>
              <div v-else slot="reference">
                <span class="maglet">质量偏差</span>
              </div>
            </el-popover>
            <el-popover
              placement="bottom-end"
              title=""
              width="450"
              trigger="hover"
              :class="['item', totali > 0 ? 'chaoshir' : 'chaoshig']"
              :disabled="!totali > 0"
            >
              <div>处理时长监控</div>
              <div
                class="popcontainer"
                style="display: flex; justify-content: space-between; align-items: center"
              >
                <div
                  class="poptext1"
                  :style="{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景1.svg') + ')',
                  }"
                >
                  <img
                    src="@/assets/iconfont/icon/超出1.svg"
                    alt="baobiao"
                    width="25"
                    height="25"
                    style="margin-right: 5px"
                  />
                  <div>
                    <div>超出{{ warningRuleIA }}%</div>
                    <div>{{ waringNumIA }}工单</div>
                  </div>
                </div>
                <div
                  class="poptext2"
                  :style="{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景2.svg') + ')',
                  }"
                >
                  <img
                    src="@/assets/iconfont/icon/超出2.svg"
                    alt="baobiao"
                    width="25"
                    height="25"
                    style="margin-right: 5px"
                  />
                  <div>
                    <div>超出{{ warningRuleIB }}%</div>
                    <div>{{ waringNumIB }}工单</div>
                  </div>
                </div>
                <div
                  class="poptext3"
                  :style="{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    backgroundImage: 'url(' + require('@/assets/iconfont/icon/超出背景3.svg') + ')',
                  }"
                >
                  <img
                    src="@/assets/iconfont/icon/超出3.svg"
                    alt="baobiao"
                    width="25"
                    height="25"
                    style="margin-right: 5px"
                  />
                  <div>
                    <div>超出{{ warningRuleIC }}%</div>
                    <div>{{ waringNumIC }}工单</div>
                  </div>
                </div>
              </div>
              <div v-if="totali > 0" slot="reference" @click="openOrder('09')">
                <el-badge :value="totali" class="badgeitem maglet">作业超时</el-badge>
              </div>
              <div v-else slot="reference">
                <span class="maglet">作业超时</span>
              </div>
            </el-popover>
          </div>
        </div>
        <!-- 结果管控决策 -->
        <div class="section">
          <div class="titleContainer">
            <div class="sectionTitle">结果管控决策</div>
            <el-breadcrumb separator="|">
              <el-breadcrumb-item
                ><span
                  class="tab-text"
                  :class="{ 'tab-active': activeName == '01' }"
                  @click="handleClick('01')"
                  >环比</span
                ></el-breadcrumb-item
              >
              <el-breadcrumb-item
                ><span
                  class="tab-text"
                  :class="{ 'tab-active': activeName == '02' }"
                  @click="handleClick('02')"
                  >同比</span
                ></el-breadcrumb-item
              >
            </el-breadcrumb>
            <!-- <el-tabs
              class="tabsgroup"
              type="card"
              v-model="activeName"
              @tab-click="handleClick"
            >
              <el-tab-pane label="环比" name="01"></el-tab-pane>
              <el-tab-pane label="同比" name="02"></el-tab-pane>
            </el-tabs> -->
          </div>
          <div class="juece">
            <div v-for="item in workOrderGenStats" :key="item.label" class="stat-item">
              <div class="stat-number">{{ item.value }}</div>
              <div class="stat-label">{{ item.label }}</div>
              <div :class="['stat-change', item.trend === 'up' ? 'green' : 'red']">
                <span style="color: black">{{ acname }}</span>
                <div :class="item.trend === 'up' ? 'upicon' : 'downicon'"></div>
                {{ item.change }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isCollapsed2" class="mincard">
      <div>预</div>
      <div>警</div>
      <div>情</div>
      <div>况</div>
      <div class="card-arrow" @click="toggleCollapse"></div>
    </div>

    <warningDialog
      :show-dialog="showOrderDialog"
      :row-data="rowData"
      :org-no="orgNo"
      :selected-date="selectedDate"
      @close="showOrderDialog = false"
    ></warningDialog>
  </el-container>
</template>

<script>
import API from '@/api/hierarchicalControl/firstlevel.js';
import warningDialog from '@/pages/hierarchicalControl/components/warningDialog.vue';
export default {
  name: 'WorkOrderManagement',
  components: {
    warningDialog,
  },
  props: {
    orgNo: {
      type: String,
    },
    screensize: {
      type: Boolean,
      default: true,
    },
    cardId: {
      type: String,
    },
  },
  data() {
    return {
      acname: '环比',
      rowData: {},
      showOrderDialog: false,
      activeName: '01',
      isCollapsed1: true,
      isCollapsed2: false,
      selectedDate: '01',
      dateOptions: [
        { label: '今日', value: '01' },
        { label: '本月', value: '02' },
        { label: '本年', value: '04' },
      ],
      workOrderGenStats: [
        { label: '工单完成率', value: '0%', trend: 'up', change: '0%' },
        { label: '工单超期率', value: '0%', trend: 'up', change: '0%' },
        { label: '工单规范率', value: '0%', trend: 'up', change: '0%' },
        { label: '工单复发率', value: '0%', trend: 'up', change: '0%' },
      ],
      totala: 0, //承载力角标
      warningRuleAA: '', //条件
      warningRuleAB: '', //条件
      warningRuleAC: '', //条件
      waringNumAA: 0,
      waringNumAB: 0,
      waringNumAC: 0,
      totalb: 0, //物资角标
      arrayb: [],
      totalc: 0, //质效角标
      warningRuleA: '', //条件
      warningRuleB: '', //条件
      waringNumCA: 0,
      waringNumCB: 0,
      totald: 0, //风险角标
      warningRuleDA: '', //条件
      warningRuleDB: '',
      waringNumDA: 0,
      waringNumDB: 0,
      totalf: 0, //工器具角标
      arrayf: [],
      totalg: 0, //工单超期角标
      warningRuleGA: '', //条件
      warningRuleGB: '', //条件
      warningRuleGC: '', //条件
      waringNumGA: 0,
      waringNumGB: 0,
      waringNumGC: 0,
      totalh: 0, //质量偏差角标
      warningRuleHA: '', //条件
      warningRuleHB: '', //条件
      warningRuleHC: '', //条件
      waringNumHA: 0,
      waringNumHB: 0,
      waringNumHC: 0,
      totali: 0, //作业超时角标
      warningRuleIA: '', //条件
      warningRuleIB: '', //条件
      warningRuleIC: '', //条件
      waringNumIA: 0,
      waringNumIB: 0,
      waringNumIC: 0,
    };
  },
  watch: {
    orgNo(newVal) {
      this.indexCapacityWaring();
      this.indexSuppliesWarning();
      this.indexIndicatorWaring();
      this.indexRiskWaring();
      this.indexDeviceWaringList();
      this.indexOrderOverdue();
      this.indexQualityWarning();
      this.indexOrderOutTime();
      this.indexResultControl();
    },
    screensize(newVal) {
      if (newVal === true) {
        this.isCollapsed1 = true;
        this.isCollapsed2 = false;
      } else {
        this.isCollapsed1 = false;
        this.isCollapsed2 = true;
      }
    },
    selectedDate(newVal) {
      this.indexCapacityWaring();
      this.indexSuppliesWarning();
      this.indexIndicatorWaring();
      this.indexRiskWaring();
      this.indexDeviceWaringList();
      this.indexOrderOverdue();
      this.indexQualityWarning();
      this.indexOrderOutTime();
      this.indexResultControl();
    },
  },
  mounted() {
    this.indexCapacityWaring();
    this.indexSuppliesWarning();
    this.indexIndicatorWaring();
    this.indexRiskWaring();
    this.indexDeviceWaringList();
    this.indexOrderOverdue();
    this.indexQualityWarning();
    this.indexOrderOutTime();
    this.indexResultControl();
  },
  methods: {
    // 表格弹框
    openOrder(data) {
      this.rowData = {
        judgeNum: data,
      };
      this.showOrderDialog = true;
    },
    // 环比同比切换
    handleClick(tab, event) {
      this.activeName = tab;
      if (tab === '01') {
        this.acname = '环比';
      } else {
        this.acname = '同比';
      }
      this.indexResultControl();
    },
    // 卡片折叠
    toggleCollapse() {
      this.isCollapsed1 = !this.isCollapsed1;
      this.isCollapsed2 = !this.isCollapsed2;
      this.$emit('cardToggle', {
        type: 'leftCardConfig',
        toggle: this.isCollapsed1,
        is: this.cardId,
      });
    },
    // 结果管控决策
    async indexResultControl() {
      let params = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
      };
      // demo
      let res = await API.indexResultControl(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        if (this.activeName === '01') {
          this.workOrderGenStats = [
            {
              label: '工单完成率',
              value: DTS.finishRate,
              trend: DTS.finishRateChain > 0 ? 'up' : 'down',
              change: `${DTS.finishRateChain == null ? 0 : DTS.finishRateChain}%`,
            },
            {
              label: '工单超期率',
              value: DTS.overdueRate,
              trend: DTS.overdueRateChain > 0 ? 'up' : 'down',
              change: `${DTS.overdueRateChain == null ? 0 : DTS.overdueRateChain}%`,
            },
            {
              label: '工单规范率',
              value: DTS.standardRate,
              trend: DTS.standardRateChain > 0 ? 'up' : 'down',
              change: `${DTS.standardRateChain == null ? 0 : DTS.standardRateChain}%`,
            },
            {
              label: '工单复发率',
              value: DTS.relapseRate,
              trend: DTS.relapseRateChain > 0 ? 'up' : 'down',
              change: `${DTS.relapseRateChain == null ? 0 : DTS.relapseRateChain}%`,
            },
          ];
        } else {
          this.workOrderGenStats = [
            {
              label: '工单完成率',
              value: DTS.finishRate,
              trend: DTS.finishRateAnnual > 0 ? 'up' : 'down',
              change: `${DTS.finishRateAnnual == null ? 0 : DTS.finishRateAnnual}%`,
            },
            {
              label: '工单超期率',
              value: DTS.overdueRate,
              trend: DTS.overdueRateAnnual > 0 ? 'up' : 'down',
              change: `${DTS.overdueRateAnnual == null ? 0 : DTS.overdueRateAnnual}%`,
            },
            {
              label: '工单规范率',
              value: DTS.standardRate,
              trend: DTS.standardRateAnnual > 0 ? 'up' : 'down',
              change: `${DTS.standardRateAnnual == null ? 0 : DTS.standardRateAnnual}%`,
            },
            {
              label: '工单复发率',
              value: DTS.relapseRate,
              trend: DTS.relapseRateAnnual > 0 ? 'up' : 'down',
              change: `${DTS.relapseRateAnnual == null ? 0 : DTS.relapseRateAnnual}%`,
            },
          ];
        }
      } else {
        this.$message.error(RT_D);
      }
    },
    // 承载力
    async indexCapacityWaring() {
      let params = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
      };
      // demo
      let res = await API.indexCapacityWaring(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.totala = DTS.total;
        this.warningRuleAA = DTS.data[0].warningRule;
        this.warningRuleAB = DTS.data[1].warningRule;
        this.warningRuleAC = DTS.data[2].warningRule;
        this.waringNumAA = DTS.data[0].waringNum;
        this.waringNumAB = DTS.data[1].waringNum;
        this.waringNumAC = DTS.data[2].waringNum;
      } else {
        this.$message.error(RT_D);
      }
    },
    // 物资
    async indexSuppliesWarning() {
      let params = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
        current: 1,
        pageSize: 2,
        startIndex: 0,
      };
      // demo
      let res = await API.indexSuppliesWarning(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.totalb = DTS.total;
        this.arrayb = DTS.data;
      } else {
        this.$message.error(RT_D);
      }
    },
    // 质效
    async indexIndicatorWaring() {
      let params = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
      };
      // demo
      let res = await API.indexIndicatorWaring(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.totalc = DTS.total;
        this.warningRuleA = DTS.data[0].warningRule;
        this.warningRuleB = DTS.data[1].warningRule;
        this.waringNumCA = DTS.data[0].waringNum;
        this.waringNumCB = DTS.data[1].waringNum;
      } else {
        this.$message.error(RT_D);
      }
    },
    // 风险
    async indexRiskWaring() {
      let params = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
      };
      // demo
      let res = await API.indexRiskWaring(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.totald = DTS.total;
        this.warningRuleDA = DTS.data[0].warningRule;
        this.warningRuleDB = DTS.data[1].warningRule;
        this.waringNumDA = DTS.data[0].waringNum;
        this.waringNumDB = DTS.data[1].waringNum;
      } else {
        this.$message.error(RT_D);
      }
    },
    // 工器具
    async indexDeviceWaringList() {
      let params = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
        current: 1,
        pageSize: 2,
        startIndex: 0,
      };
      let res = await API.indexDeviceWaringList(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.totalf = DTS.length;
        this.arrayf = DTS;
      } else {
        this.$message.error(RT_D);
      }
    },
    // 工单超期
    async indexOrderOverdue() {
      let params = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
      };
      let res = await API.indexOrderOverdue(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.totalg = DTS.total;
        this.warningRuleGA = DTS.data[0].warningRule;
        this.warningRuleGB = DTS.data[1].warningRule;
        this.warningRuleGC = DTS.data[2].warningRule;
        this.waringNumGA = DTS.data[0].waringNum;
        this.waringNumGB = DTS.data[1].waringNum;
        this.waringNumGC = DTS.data[2].waringNum;
      } else {
        this.$message.error(RT_D);
      }
    },
    // 质量偏差
    async indexQualityWarning() {
      let params = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
      };
      let res = await API.indexQualityWarning(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.totalh = DTS.total;
        this.warningRuleHA = DTS.data[0].warningRule;
        this.warningRuleHB = DTS.data[1].warningRule;
        this.warningRuleHC = DTS.data[2].warningRule;
        this.waringNumHA = DTS.data[0].waringNum;
        this.waringNumHB = DTS.data[1].waringNum;
        this.waringNumHC = DTS.data[2].waringNum;
      } else {
        this.$message.error(RT_D);
      }
    },
    // 作业超时
    async indexOrderOutTime() {
      let params = {
        orgNo: this.orgNo,
        dateRange: this.selectedDate,
      };
      let res = await API.indexOrderOutTime(params);
      let { DTS, RT_F, RT_D } = res.data;
      if (RT_F == 1 && DTS) {
        this.totali = DTS.total;
        this.warningRuleIA = DTS.data[0].warningRule;
        this.warningRuleIB = DTS.data[1].warningRule;
        this.warningRuleIC = DTS.data[2].warningRule;
        this.waringNumIA = DTS.data[0].waringNum;
        this.waringNumIB = DTS.data[1].waringNum;
        this.waringNumIC = DTS.data[2].waringNum;
      } else {
        this.$message.error(RT_D);
      }
    },
    // 点击更多跳转
    goNewPage(pageIndex) {
      let parem = {
        id: pageIndex,
        dateRange: this.selectedDate,
      };
      this.$emit('goNewPage', parem, this.selectedDate);
    },
  },
};
</script>

<style lang="scss" scoped>
// .new-safeweb-web{

// }
.badgeitem {
  // height:30px;
  width: 90px;
}
.maglet {
  margin-left: 15px;
}
.upicon {
  width: 4px;
  height: 11px;
  background-image: url('~@/assets/iconfont/icon/上升.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.downicon {
  width: 4px;
  height: 11px;
  background-image: url('~@/assets/iconfont/icon/降低.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.mincard {
  width: 40px;
  height: 130px;
  font-size: 16px;
  padding: 10px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  color: $font-color-dark;
  font-weight: bold;
  // background: linear-gradient(to bottom, $gradient-green-dark-end 0%, #ffffff 100%);
  background-image: url('~@/assets/iconfont/icon/标题背景.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 3px;
  .card-arrow {
    cursor: pointer;
    font-size: 14px;
    width: 10px;
    height: 10px;
    background-image: url('~@/assets/iconfont/icon/展开.svg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
}
.work-order-card {
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  width: 446px;
  height: 408px;
  box-shadow: 0 4px 10px 0px rgba(0, 155, 131, 0.2);
  height: 408px;
  overflow: hidden;
  .arrow-down {
    background-image: url('~@/assets/iconfont/icon/收起.svg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .arrow-up {
    background-image: url('~@/assets/iconfont/icon/展开.svg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-image: url('~@/assets/iconfont/icon/标题背景.svg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    .card-title {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: 700;
      color: #426170;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
      .more {
        font-size: 14px;
        color: #647671;
        cursor: pointer;
        &::after {
          content: '>';
          margin-left: 5px;
          font-size: 16px;
        }
      }
    }

    .date-selector {
      display: inline-flex;
      margin: 0;

      ::v-deep .el-button {
        padding: 5px 5px;
        font-size: 12px;
        border-color: #dcdfe6;
        background-color: #fff;
        color: #606266;
        margin-left: -1px;
        position: relative;
        z-index: 1;

        // &:first-child {
        //   margin-left: 0;
        //   border-top-left-radius: 10px;
        //   border-bottom-left-radius: 10px;
        // }

        // &:last-child {
        //   border-top-right-radius: 10px;
        //   border-bottom-right-radius: 10px;
        // }

        &:hover {
          z-index: 2;
        }

        &.active {
          background-color: #028671;
          border-color: #028671;
          color: #fff;
          z-index: 2;
        }

        &:hover:not(.active) {
          color: #028671;
          border-color: #028671;
          background-color: #fff;
        }
      }
    }

    .card-arrow {
      color: #909399;
      cursor: pointer;
      font-size: 14px;
      transition: transform 0.3s;
      width: 10px;
      height: 10px;
      margin-left: 10px;
    }
  }

  .card-body {
    transition: all 0.3s ease;
    .popcontainer {
      display: flex !important;
      justify-content: space-between;
      align-items: center;
    }
    .section {
      .titleContainer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 10px;
        .tab-text {
          font-size: 12px;
          color: #99a09e;
          cursor: pointer;
        }
        .tab-active {
          color: #009b83;
        }
        // .tabsgroup {
        //   position: relative;
        //   top: 7px;
        //   ::v-deep .el-tabs__item {
        //     height: 20px;
        //     // width:40px;
        //     line-height: 20px;
        //     // padding-top: 10px;
        //   }
        //   // ::v-deep .el-tabs__item:nth-child(2) {
        //   //   padding-left: 0px;
        //   // }
        //   // ::v-deep .el-tabs__nav-prev {
        //   //   height: 20px;
        //   //   line-height: 20px;
        //   // }
        //   // ::v-deep .el-tabs__nav-next {
        //   //   height: 20px;
        //   //   line-height: 20px;
        //   // }
        // }
      }
      .juece {
        // width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 5px;
        padding: 0 10px 10px;
      }
      .stat-item {
        width: 23%;
        text-align: center;
        padding: 15px 0px;
        background-color: #f5f7fa;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .stat-number {
          font-size: 18px;
          font-weight: 700;
          color: #303133;
          // margin-bottom: 5px;
        }

        .stat-label {
          font-size: 14px;
          font-weight: 500;
          // color: #909399;
          margin: 10px;
        }

        .stat-change {
          font-size: 12px;
          font-weight: 350;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;

          &.green {
            color: #67c23a;
          }

          &.red {
            color: #f56c6c;
          }
        }

        .stat-icon {
          font-size: 16px;
          margin-top: 5px;

          &.el-icon-warning {
            color: #e6a23c;
          }

          &.el-icon-info {
            color: #409eff;
          }
        }
      }
      .sectionTitle {
        color: $color-primary;
        font-size: 14px;
        font-weight: 700;
        padding: 5px 15px;
      }

      .sectionItem {
        // margin-top: 10px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        // padding: 5px;
        // margin: 0px;
        .item {
          width: 32%;
          height: 48px;
          line-height: 38px;
          padding: 5px;
          // margin: 0px 5px 0px;
          text-align: center;
          font-size: 14px;
          font-weight: bold;
          // display: flex;
          // align-items: center;
          cursor: pointer;
        }
        .chengzaig {
          background-image: url('~@/assets/iconfont/icon/icongreen/承载力.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .chengzair {
          background-image: url('~@/assets/iconfont/icon/iconred/承载力.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .wuzig {
          background-image: url('~@/assets/iconfont/icon/icongreen/物资.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .wuzir {
          background-image: url('~@/assets/iconfont/icon/iconred/物资.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .zhixiaog {
          background-image: url('~@/assets/iconfont/icon/icongreen/质效绿.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .zhixiaor {
          background-image: url('~@/assets/iconfont/icon/iconred/质效.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .fengxiang {
          background-image: url('~@/assets/iconfont/icon/icongreen/风险绿.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .fengxianr {
          background-image: url('~@/assets/iconfont/icon/iconred/风险.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .cheliang {
          background-image: url('~@/assets/iconfont/icon/车辆.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .yiqig {
          background-image: url('~@/assets/iconfont/icon/icongreen/工器具绿.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .yiqir {
          background-image: url('~@/assets/iconfont/icon/iconred/仪器仪表.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .chaoqig {
          background-image: url('~@/assets/iconfont/icon/icongreen/工单超期.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .chaoqir {
          background-image: url('~@/assets/iconfont/icon/iconred/工单超期.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .pianchag {
          background-image: url('~@/assets/iconfont/icon/icongreen/质量偏差.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .pianchar {
          background-image: url('~@/assets/iconfont/icon/iconred/质量偏差.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .chaoshig {
          background-image: url('~@/assets/iconfont/icon/icongreen/作业超时绿.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .chaoshir {
          background-image: url('~@/assets/iconfont/icon/iconred/作业超时.svg');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
      }
    }
  }
}
</style>
