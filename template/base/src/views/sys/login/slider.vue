<template>
  <div class="slider">
    <div class="content">
      <div class="bg-img">
        <img :src="bgImg" alt />
      </div>
      <div class="slider-img" :style="{ left: `${moveX}px` }">
        <img :src="sliderImg" alt />
      </div>
    </div>
    <div class="slider-move">
      <div class="slider-move-track">
        <div class="slider-move-tip">拖动滑块完成拼图</div>
      </div>
      <div
        class="slider-move-btn"
        @mousedown="start"
        :style="{
          transform: `translate(${blcokLeft}px, 0px)`,
          backgroundPosition: ` 0 ${moveBtnPosition}%`,
        }"
        ref="move-btn"
      ></div>
    </div>
    <div class="bottom">
      <div class="close" @click="close"></div>
      <div class="refresh" @click="reset"></div>
    </div>
  </div>
</template>

<script>
  // =========================================
  // 父组件需要提供的方法 名称
  // =========================================
  // import formart from 'moment';

  /**
   * 获取滑块图片方法
   */
  const GET_IMG_FUN = 'getImg';
  /**
   * 校验滑块图片方法
   */
  const VALID_IMG_FUN = 'validImg';
  /**
   * 滑块窗口关闭事件监听
   */
  const CLOST_EVENT_FUN = 'close';
  function getCurrentCoordinate(event) {
    let startX, startY;
    if (event.pageX) {
      startX = event.pageX;
      startY = event.pageY;
    }
    let targetTouches;
    if (event.changedTouches) {
      // 鎶捣浜嬩欢
      targetTouches = event.changedTouches;
    } else if (event.targetTouches) {
      // pc 鎸変笅浜嬩欢
      targetTouches = event.targetTouches;
    } else if (event.originalEvent && event.originalEvent.targetTouches) {
      // 榧犳爣瑙︽懜浜嬩欢
      targetTouches = event.originalEvent.targetTouches;
    }
    if (!startX && targetTouches[0].pageX) {
      startX = targetTouches[0].pageX;
      startY = targetTouches[0].pageY;
    }
    if (!startX && targetTouches[0].clientX) {
      startX = targetTouches[0].clientX;
      startY = targetTouches[0].clientY;
    }
    if (startX && startY) {
      startX = Math.round(startX);
      startY = Math.round(startY);
    }
    return {
      x: startX,
      y: startY,
    };
  }
  export default {
    props: {
      // 是否开启日志， 默认true
      log: {
        type: Boolean,
        required: false,
        default: true,
      },
    },
    data() {
      return {
        blcokLeft: 0,
        bgImg: '',
        startSlidingTime: '',
        entSlidingTime: '',
        sliderImg: '',
        startX: 0,
        startY: 0,
        uuid: '',
        startMove: false,
        moveBtnPosition: 11.79625,
        bgcWidth: 0,
        moveX: 0,
        sourceData: {},
        arrPath: [],
      };
    },
    mounted() {
      this.getImg();
    },
    methods: {
      /**
       * 按钮关闭事件
       */
      close() {
        this.printLog('关闭按钮触发');
        this.$emit(CLOST_EVENT_FUN);
      },
      /**
       * 打印日志
       */
      printLog(msg, ...optionalParams) {
        if (this.log) {
          if (optionalParams && optionalParams.length > 0) {
            console.info(
              `滑块验证码[${msg}]`,
              optionalParams.length === 1 ? optionalParams[0] : optionalParams,
            );
          } else {
            console.info(`滑块验证码[${msg}]`);
          }
        }
      },
      /**
       * 获取滑块图片
       */
      getImg() {
        this.$emit(GET_IMG_FUN, (data) => {
          this.printLog(GET_IMG_FUN, data);
          if (!data) return;
          this.sourceData = data;
          this.startSlidingTime = data.startSlidingTime;
          this.bgcWidth = data.captcha.backgroundImageWidth;
          this.bgImg = data.captcha.backgroundImage;
          this.sliderImg = data.captcha.sliderImage;
          this.uuid = data.id;
        });
      },
      /**
       * 校验图片
       */
      validImg() {
        this.printLog(`滑块抬起`, this.movePercent);
        this.$emit(
          VALID_IMG_FUN,
          // this.movePercent,
          { startSlidingTime: this.startSlidingTime, entSlidingTime: new Date() },
          this.uuid,
          this.sourceData,
          this.arrPath,
          (data) => {
            this.printLog(VALID_IMG_FUN, data);
            if (data === false) {
              this.reset();
            }
          },
        );
      },
      /**
       * 重新生成图片
       */
      reset() {
        this.getImg();
        this.moveX = 0;
        this.movePercent = 0;
        this.startX = 0;
        this.startY = 0;
        this.blcokLeft = 0;
        this.arrPath = [];
      },
      start(e) {
        // let targetTouches = e.originalEvent ? e.originalEvent.targetTouches : e.targetTouches;
        // console.log(e, '鼠标按下');
        const coo = getCurrentCoordinate(e);

        let pageX = coo.x;
        let pageY = coo.y;
        this.startX = coo.x;
        this.startY = coo.y;
        this.moveBtnPosition = 31.0092;
        // this.startX = e.pageX;
        // this.startY = e.pageY;
        this.arrPath.push({
          x: pageX - this.startX,
          y: pageY - this.startY,
          type: 'down',
          t: new Date().getTime() - this.startSlidingTime.getTime(),
        });
        this.startMove = true;
        window.addEventListener('mousemove', this.move);
        window.addEventListener('mouseup', this.up);
      },
      move(e) {
        if (!this.startMove) return;
        const moveX = e.pageX - this.startX;
        // const moveY = e.pageY - this.startY;
        const movePercent = moveX / 260;
        if (moveX <= 0) {
          this.blcokLeft = 0;
          this.moveX = 0;
          this.movePercent = 0;
        } else if (moveX >= 0 && moveX <= 209) {
          this.blcokLeft = moveX;
          this.moveX = moveX;
          this.movePercent = movePercent;
        } else if (moveX >= 209) {
          this.blcokLeft = 209;
          this.moveX = 209;
          this.movePercent = movePercent;
        }
        // console.log(e);
        const coo = getCurrentCoordinate(e);

        let pageX = coo.x;
        let pageY = coo.y;
        this.arrPath.push({
          x: pageX - this.startX,
          y: pageY - this.startY,
          type: 'move',
          t: new Date().getTime() - this.startSlidingTime.getTime(),
        });
      },
      up(e) {
        // console.log(e);
        const coo = getCurrentCoordinate(e);
        //  const moveX = e.pageX - this.startX;
        //       // const moveY = e.pageY - this.startY;
        //       const movePercent = moveX / 260;
        let pageX = coo.x;
        let pageY = coo.y;
        const moveX = pageX - this.startX;
        const moveY = pageY - this.startY;
        this.arrPath.push({
          x: (this.bgcWidth * moveX) / 260,
          y: moveY,
          type: 'up',
          t: new Date().getTime() - this.startSlidingTime.getTime(),
        });
        window.removeEventListener('mousemove', this.move);
        window.removeEventListener('mouseup', this.up);
        if (!this.startMove) return;
        this.startMove = false;
        this.moveBtnPosition = 11.79625;
        // console.log(this.movePercent);
        this.validImg();
      },
    },
  };
</script>

<style lang="less" scoped>
  .slider {
    background-color: #fff;
    width: 278px;
    height: 285px;
    display: flex;
    flex-wrap: wrap;
    // justify-content: center;
    position: absolute;
    z-index: 999;
    box-sizing: border-box;
    padding: 8px;
    // border: 1px solid #ccc;
    border-radius: 6px;
    box-shadow: 0px 0px 11px 0px #999999;

    .content {
      width: 260px;
      height: 159px;
      position: relative;

      .bg-img,
      .slider-img {
        width: 100%;
        height: 100%;
        position: absolute;

        img {
          height: 100%;
        }
      }

      .slider-img {
        width: 52.20338981px;
        position: absolute;
        top: 0;
      }
    }

    .slider-move {
      width: 100%;
      height: 38px;
      position: relative;
      // margin: 5.39% 3.24%;
      padding: 0 0 13.67% 0;
      // height: 5px;
      overflow: visible;
      background-color: white;
      background-size: 100%;
      background-position: 0 0;

      .slider-move-btn {
        position: absolute;
        top: 0;
        left: 0;
        margin: -4.62% 0 0 -2.31%;
        width: 25.38%;
        padding: 0 0 25.38% 0;
        height: 0;
        cursor: pointer;
        font-size: 0;
        transform: translate(0px, 0px);
        opacity: 1;
        background-size: 393.93939%;
        // background-position: 0 11.79625%
        background-position: 0 31.0092%;
      }

      .slider-move-track {
        .slider-move-tip {
          line-height: 38px;
          font-size: 14px;
          text-align: center;
          white-space: nowrap;
          color: #88949d;
        }
      }
    }

    .bottom {
      height: 19px;
      width: 100%;
      position: relative;
      bottom: -10px;
      left: 3px;

      .close {
        margin-left: 0;
        overflow: hidden;
        background-size: 1300%;
        background-position: 0 44.86874%;
        width: 20px;
        height: 20px;
        position: absolute;
        cursor: pointer;
      }

      .refresh {
        overflow: hidden;
        background-size: 1300%;
        background-position: 0 81.38425%;
        width: 20px;
        height: 20px;
        left: 30px;
        position: absolute;
        cursor: pointer;
      }
    }
  }

  .slider-move,
  .slider-move-btn,
  .close,
  .refresh {
    background: url(https://static.geetest.com/static/ant/sprite.1.2.4.png) no-repeat;
  }
</style>
