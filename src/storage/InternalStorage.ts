import { Storage } from '@lightningjs/sdk'

class InternalStorage {
  save = (key: string, data: any) => {
    Storage.set(key, data)
  }

  get = (key: string) => {
    return Storage.get(key)
  }

  deleteKey = (key: string) => {
    Storage.delete(key)
  }

  clear = () => {
    Storage.clear()
  }
}

export default new InternalStorage()
