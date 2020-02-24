<template>
  <div class="shapping">
    shapping page!
    <p>{{id}}</p>
  </div>
</template>

<script>
export default {
  name: "shapping",
  props: ['id']
};
</script>

<style lang="sass" scoped>
.shapping
  width: 100%
</style>