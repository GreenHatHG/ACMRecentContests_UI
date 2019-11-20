export function setIntoStorage(data) {
    let noArr = []
    let text = 'email'
    noArr.push({value: data})
    if(JSON.parse(localStorage.getItem(text))) { // 判断是否已有xxx查询记录的localStorage
      if(localStorage.getItem(text).indexOf(data) > -1 ) { // 判断是否已有此条查询记录，若已存在，则不需再存储
        return
      }
      if(JSON.parse(localStorage.getItem(text)).length >= 5) {
        let arr = JSON.parse(localStorage.getItem(text))
        arr.pop()
        localStorage.setItem(text, JSON.stringify(arr))
      }
      localStorage.setItem(text, JSON.stringify(noArr.concat(JSON.parse(localStorage.getItem(text)))))
    }
    else { // 首次创建
      localStorage.setItem(text, JSON.stringify(noArr))
    }
}