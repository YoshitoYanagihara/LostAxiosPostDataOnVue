<template>
  <div class="hello">
    <button @click="addItem">Add Item</button>
    <div v-for="item in items" :key="item.id">
      <span>{{ item.msg }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data: function () {
    return {
      items: [],
    }
  },
  methods: {
    addItem: function () {
      this.items.push({
        key: this.items.length + 1,
        msg: "hoge"
      })
    },
  }
}
</script>

<style scoped>
</style>
