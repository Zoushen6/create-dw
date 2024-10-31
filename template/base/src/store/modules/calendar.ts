import { defineStore } from 'pinia';
import { store } from '/@/store';

interface calenderType {
  CalenderValue: any;
}

export const useCalenderInfo = defineStore({
  id: 'app-calender',
  state: (): calenderType => ({
    CalenderValue: null,
  }),

  getters: {
    getCalenderValue() {
      return this.CalenderValue;
    },
  },

  actions: {
    setCalenderValue(value) {
      this.CalenderValue = value;
    },
  },
});

export function useCalender() {
  return useCalenderInfo(store);
}
