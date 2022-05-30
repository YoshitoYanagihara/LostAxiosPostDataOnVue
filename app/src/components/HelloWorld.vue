<template>
  <div class="hello">
    <button @click="addItem">Add Item</button>
    <button @click="postDirectly">itemsの要素を直接POST</button>
    <div v-for="item in items" :key="item.id">
      <span>{{ item.msg }}</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HelloWorld',
  data: function () {
    return {
      items: [],
    }
  },
  methods: {
    /**
     * itemsに要素を適当に追加
     */
    addItem: function () {
      this.items.push({
        key: this.items.length + 1,
        msg: "hoge"
      })
    },
    /**
     * itemsの要素を直接使ってPOST
     */
    postDirectly: async function () {
      const body = {
        data: "hoge",
        info: {
          itemsArray: this.items
        },
        itemsArray: this.items,
        msgArray: this.items.map(item => item.msg),
      }
      const response = await axios.post("http://localhost:3000/api/hoge", body)
      console.log(response)
    },
  }
}
</script>

<style scoped>
</style>
