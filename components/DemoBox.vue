<template>
  <div class="box box-demo">
    <slot name="component"></slot>
    <div class="box-demo-description">
      <slot name="description"></slot>
      <span class="btn-toggle" :class="{open: isOpen}" @click="toggle">
        <i class="fa fa-chevron-down"></i></span>
    </div>
    <transition name="slide">
      <div class="box-demo-code" v-show="isOpen">
        <slot name="code"></slot>
      </div>
    </transition>
  </div>
</template>
<script>
  export default {
    name: 'DemoBox',
    data() {
      return {
        isOpen: false,
      };
    },
    methods: {
      toggle() {
        this.isOpen = !this.isOpen;
      },
    },
  };
</script>
<style lang="css">
  .box-demo{
    padding: 0;
    border: 1px solid #e9e9e9;
    border-radius: 4px;
    box-shadow: none;
  }
  .box-demo-show{
    padding: 20px 25px 30px;
    border-bottom: 1px solid #e9e9e9;
  }
  .box-demo-description{
    position: relative;
    padding: 17px 16px 15px 20px;
    border-radius: 0 0 6px 6px;
    -webkit-transition: background-color 0.4s ease;
    transition: background-color 0.4s ease;
    width: 100%;
    font-size: 12px;
    &.bordered{
      border-bottom: 1px dashed #e9e9e9;
    }
    h3, h4{
      position: absolute;
      top: -14px;
      padding: 1px 8px;
      margin-left: -8px;
      margin-top: 0;
      margin-bottom: 0;
      color: #777;
      border-radius: 4px;
      border-top-left-radius: 0;
      background: #fff;
      -webkit-transition: background-color 0.4s ease;
      transition: background-color 0.4s ease;
      .header-anchor{
        display: none;
      }
    }
    li{
      line-height: 21px;
    }
  }
  .box-demo-code{
    -webkit-transition: height .2s ease-in-out;
    transition: height .2s ease-in-out;
    overflow: auto;
  }
  .btn-toggle{
    position: absolute;
    right: 16px;
    bottom: 17px;
    cursor: pointer;
    width: 18px;
    height: 18px;
    font-size: 18px;
    line-height: 18px;
    color: #999;
    i{
      -webkit-transition: all 0.3s;
      transition: all 0.3s;
    }
    &.open{
      i{
        -webkit-transform: rotate(-180deg);
        -ms-transform: rotate(-180deg);
        transform: rotate(-180deg);
      }
    }
  }

</style>
