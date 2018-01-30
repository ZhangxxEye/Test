<template>
  <div style="text-align: right">
    <affix :on-affix="onAffixed">
      <button class="button is-primary">触发回调</button>
    </affix>
  </div>
</template>
<script>
  export default {
    methods: {
      onAffixed(status) {
           alert(status);
      },
    }
  };
</script>
