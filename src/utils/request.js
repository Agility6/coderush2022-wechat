let ajaxTimes = 0
const request = (params) => {
    ajaxTimes ++
    uni.showLoading({
        title: '加载中',
        mask: false
      })

    // const baseUrl = "http://192.168.1.106:3000"
    const baseUrl = "https://coderush.top:8082"
    return new Promise((resolve, reject) => {
        uni.request({
            ...params,
            url: baseUrl+params.url,
            success: (res) => {
                resolve(res.data)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {
                ajaxTimes --
                if(ajaxTimes === 0) {
                    uni.hideLoading()
                } 
            }
        })
    })
}

export default request
