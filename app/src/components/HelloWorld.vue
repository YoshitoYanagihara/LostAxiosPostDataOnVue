<template>
  <div class="hello">
    <div>
      <button @click="addItem">Item追加</button>
      <button @click="postDirectly">itemsの要素を直接POST</button>
    </div>
    <div>
      <button @click="saveToIndexedDB">IndexedDBに保存</button>
      <button @click="postIndexedDBData">IndexedDBの情報をPOST</button>
    </div>
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
      axios: axios.create(
        {
          baseURL: "http://localhost:3000/api",
          withCredentials: true,
        }
      ),
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
      const response = await this.axios({
        method: 'post',
        url: '/hoge',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          data: "hoge",
          info: {
            itemsArray: this.items
          },
          itemsArray: this.items,
          msgArray: this.items.map(item => item.msg),
        },
      })
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
    },
    /**
     * IndexedDBのデータをPOST
     */
    postIndexedDBData: async function () {
      const openRequest = indexedDB.open(this.dbName)
      const self = this

      const datas = []
      await new Promise(resolve => {
        openRequest.onsuccess = function (e) {
          const db = e.target.result
          const transaction = db.transaction(self.dbName, 'readwrite')
          const store = transaction.objectStore(self.dbName)
          const cursorRequest = store.openCursor()

          cursorRequest.onsuccess = function (cursorEvent) {
            const cursor = cursorEvent.target.result
            if (cursor) {
              datas.push(cursor.value)
              cursor.continue()
            } else {
              db.close()
              resolve()
            }
          }
        }
      })
      
      const response = await this.axios({
        method: 'post',
        url: '/hoge',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          data: "hoge",
          info: {
            itemsArray: datas
          },
          itemsArray: datas,
          msgArray: datas.map(item => item.msg),
        }
      })
      console.log(response)
    }
  }
}
</script>

<style scoped>
</style>
