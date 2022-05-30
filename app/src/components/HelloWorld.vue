<template>
  <div class="hello">
    <button @click="addItem">Item追加</button>
    <button @click="saveToIndexedDB">IndexedDBに保存</button>
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
      dbName: "test",
    }
  },
  methods: {
    /**
     * itemsに要素を適当に追加
     */
    addItem: function () {
      this.items.push({
        id: this.items.length + 1,
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
    /**
     * IndexedDBにitemsの内容を保存
     */
    saveToIndexedDB: function () {
      const openRequest = indexedDB.open(this.dbName)
      const self = this
      openRequest.onupgradeneeded = function (e) {
        const db = e.target.result
        db.createObjectStore(self.dbName, { keyPath: 'id' })
      }
      
      openRequest.onsuccess = async function (e) {
        const db = e.target.result
        const transaction = db.transaction(self.dbName, 'readwrite')
        const store = transaction.objectStore(self.dbName)

        // 本来なら一旦内容を消してからやるべきだけど面倒なので割愛

        const promises = self.items.map(item => {
          return new Promise(resolve => {
            const putRequest = store.put(item)
            putRequest.onsuccess = resolve
          })
        })
        await Promise.all(promises)
        
        console.log("Save To IndexedDB OK.")
        db.close()
      }
    }
  }
}
</script>

<style scoped>
</style>
