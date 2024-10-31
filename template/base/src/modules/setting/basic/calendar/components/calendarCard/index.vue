<template>
  <div :style="{ width: '100%', border: '1px solid #d9d9d9', borderRadius: '4px' }">
    <Calendar
      v-model:value="value"
      :fullscreen="false"
      @change="onDateChange"
      @select="calenderSelect"
      @panelChange="onPanelChange"
    >
      <template #dateFullCellRender="{ current }">
        <ul :class="getClass(current)" :key="new Date().getTime()">
          <!-- 阳历 -->
          <li class="calendar-date">
            <BadgeRibbon
              v-if="getLunarDate(current).schedule"
              :color="getLunarDate(current).schedule == 'REST' ? 'green' : 'volcano'"
              :text="getLunarDate(current).schedule == 'REST' ? '休' : '班'"
            >
              {{ getDate(current) }}
            </BadgeRibbon>
            <span v-else>
              {{ getDate(current) }}
            </span>
          </li>
          <!-- 阴历以及事项 -->
          <li class="lunar_calendar" v-if="!getLunarDate(current).chineseDate">
            {{ getLunarDate(current).festivals }}
          </li>
          <li class="lunar_calendar Hugh_color" v-else>{{
            getLunarDate(current).festivals
              ? getLunarDate(current).festivals
              : getLunarDate(current).chineseDate
          }}</li>
        </ul>
      </template>
    </Calendar>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, defineEmits, defineExpose } from 'vue';
  import { useCalenderInfo } from '/@/store/modules/calendar';
  import dayjs, { Dayjs } from 'dayjs';
  import { Calendar, Badge } from 'ant-design-vue';
  import Api from '../../../../api';
  const BadgeRibbon = Badge.Ribbon;
  const emit = defineEmits(['calendarSelect']);
  const data = reactive({
    today: dayjs(),
    currentMonth: 0,
    selectDate: dayjs().format('M'),
  });
  const dateList: any = ref([]);
  // 请求农历数据
  const getListDate = async (statTime, endTime) => {
    const res = await Api.getCalendarList({
      params: {
        startDate: statTime,
        endDate: endTime,
      },
    });
    dateList.value = res;
  };
  // 默认请求当前月份的上下共三月份数据
  getListDate(
    dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
    dayjs().add(1, 'month').endOf('month').format('YYYY-MM-DD'),
  );
  const { setCalenderValue } = useCalenderInfo();
  const value = ref<Dayjs>();
  const onPanelChange = (value: Dayjs) => {
    data.currentMonth = +dayjs(value).format('M');
  };
  // 面板变化
  const onDateChange = (value) => {
    getListDate(
      dayjs(value).add(-1, 'month').startOf('month').format('YYYY-MM-DD'),
      dayjs(value).add(1, 'month').endOf('month').format('YYYY-MM-DD'),
    );
    data.selectDate = value;
    if (parseInt(dayjs(value).format('M')) !== data.currentMonth) {
      data.currentMonth = parseInt(dayjs(value).format('M'));
    }
  };

  const getClass = (value) => {
    let classStr = 'lunar-date-cell';
    if (dayjs(value).format('YYYY-MM-DD') === data.today?.format('YYYY-MM-DD')) {
      classStr += ' lunar-date-cell-today';
    }
    let month = parseInt(dayjs(value).format('M'));
    if (month === data.currentMonth - 1 || (month === 12 && data.currentMonth === 1)) {
      classStr += ' lunar-date-cell-last-month';
    }
    if (month === data.currentMonth + 1 || (month === 1 && data.currentMonth === 12)) {
      classStr += ' lunar-date-cell-next-month';
    }
    if (
      data.selectDate &&
      dayjs(value).format('YYYY-MM-DD') === dayjs(data.selectDate).format('YYYY-MM-DD')
    ) {
      classStr += ' lunar-date-cell-selected-day';
    }
    return classStr;
  };
  const getDate = (value) => {
    return dayjs(value).format('D');
  };
  const getLunarDate = (value) => {
    let ri = dateList.value.filter((i) => i.date == value.format('YYYY-MM-DD'));
    let lunar = ri[0] ? ri[0] : {};
    console.log(lunar);

    return lunar;
  };
  const calenderSelect = (value) => {
    let val = value.format('YYYY-MM-DD');
    let selectValue = dateList.value.filter((i) => i.date == val)[0];

    setCalenderValue({
      ...selectValue,
      value: val,
    });
    emit('calendarSelect', selectValue, val);
  };
  const reloadCalender = (date) => {
    getListDate(
      dayjs(date.date).add(-1, 'month').startOf('month').format('YYYY-MM-DD'),
      dayjs(date.date).add(1, 'month').endOf('month').format('YYYY-MM-DD'),
    );
  };
  defineExpose({
    reloadCalender,
  });
</script>

<style lang="less" scoped>
  ::v-deep .ant-picker-content {
    tbody {
      tr {
        td:nth-last-child(2),
        td:nth-last-child(1) {
          // background-color: rgb(152, 165, 6);
          color: #fa541c !important;
        }
      }
    }
  }

  .Hugh_color {
    font-weight: 600;
    color: #fa541c;
  }

  ::v-deep .ant-ribbon.ant-ribbon-placement-end {
    z-index: 100;
    font-size: 10px;
    right: -40px;
    top: 1px;
  }

  .events {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .lunar-date-cell {
    text-align: center;
    min-width: 60px;
    margin: 0 32%;
    padding: 9px;
    border-radius: 1000px;
  }

  .lunar-date-cell:hover {
    background: #e6f7ff;
    cursor: pointer;
  }

  .lunar-date-cell-today {
    box-shadow: 0 0 0 1px #1890ff inset;
  }

  .lunar-date-cell-selected-day {
    color: #fff;
    background: #1890ff;
  }

  //上一个月的日期单元格
  .lunar-date-cell-last-month {
    color: rgba(0, 0, 0, 0.25);
  }

  //下一个月的日期单元格
  .lunar-date-cell-next-month {
    color: rgba(0, 0, 0, 0.25);
  }

  //公历日期样式
  .calendar-date {
    font-weight: bolder;
  }

  //农历日期样式
  .lunar_calendar {
    font-size: 12px;
  }
</style>
