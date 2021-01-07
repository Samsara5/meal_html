<template>
<div style="background-color:#C6E2FF;with:100%;height: 100%">
  {{hoursTip}},{{username}}
  <div class="clock">
      <span class="text" v-if="index == 0">
        {{ hour }}:{{ min }}:{{ sec }}
      </span>
    <span class="text" v-else>
        {{ min }}:{{ sec }}:{{ msec }}
      </span>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      hoursTip: '',
      username: '',
      index: 0,  // 0表示时钟页面，1表示计时器计时状态，2表示计时器暂停状态
      hour: '00', // 页面显示的数值
      min: '00',
      sec: '00',
      msec: '00',
      h: 0,    // 临时保存的数值
      m: 0,
      s: 0,
      ms: 0,
      timer: null,
      date: null
    }
  },
  created() {
    this.getMycount();
    this.autoMove();
    this.username = window.sessionStorage.getItem("username")
  },
  methods: {
    getMycount: function () {
      let self = this;
      let date = new Date();
      if (date.getHours() >= 0 && date.getHours() < 12) {
        self.hoursTip = "上午好"
      } else if (date.getHours() >= 12 && date.getHours() < 18) {
        self.hoursTip = "下午好"
      } else {
        self.hoursTip = "晚上好"
      }
    },
    autoMove() {
      if (this.index == 0) {
        this.timer = setInterval(res => {
          this.date = new Date();
          this.h = this.date.getHours();
          this.m = this.date.getMinutes();
          this.s = this.date.getSeconds();
          this.hour = this.h > 9 ? this.h : '0' + this.h;
          this.min = this.m > 9 ? this.m : '0' + this.m;
          this.sec = this.s > 9 ? this.s : '0' + this.s;
        }, 1000);
      } else if (this.index == 1) {
        this.timer = setInterval(res => {
          this.ms++;
          if (this.ms == 100) {
            this.s++;
            this.ms = 0;
          }
          if (this.s == 60) {
            this.m++;
            this.s = 0;
          }
          this.msec = this.ms > 9 ? this.ms : '0' + this.ms;
          this.min = this.m > 9 ? this.m : '0' + this.m;
          this.sec = this.s > 9 ? this.s : '0' + this.s;
        }, 10);
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .clock {
    width: 400px;
    height: 180px;
    line-height: 180px;
    border: 10px solid #aaa;
    border-radius: 10px;
    margin: 120px auto;
    background: #8CC5FF;
    text-align: center;
    position: relative;
    box-shadow: 0px 5px 20px rgba(140,197,255,.6);
  }
  .clock .text {
    font-size: 70px;
    font-weight: bold;
    color:#fff;
  }
  .clock .btn {
    position: absolute;
    /*top: -66px;*/
    bottom: -66px;
    border: none;
    outline: none;
    width: 80px;
    height: 36px;
    border-radius: 4px;
    font-size: 16px;
    background: #aaa;
    cursor: pointer;
    box-shadow: 0px 5px 20px rgba(0,0,0,.6);
  }
  .clock .btn:hover {
    opacity: 0.8;
  }
  .clock .btn-clock {
    left: 110px;
  }
  .clock .btn-clock.to-left {
    left: 60px;
  }
  .clock .btn-timer {
    right: 110px;
  }
  .clock .btn-suspend {
    right: 160px;
  }
  .clock .btn-reset {
    right: 60px;
  }
</style>
