const request = (params) => {

    const baseUrl = "https://coderush.top:8082  "
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
                
            }
        })
    })
}

export default request
