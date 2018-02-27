export default class Utils {
    static get(path, content, callback) {
        Utils.ajax('get', path, content, callback)
    }
    
    static post(path, content, callback) {
        Utils.ajax('post', path, content, callback)
    }

    static ajax(type, path, data, callback) {
        let host = ''
        let url = host + path
        
        $.ajax({
            type,
            url,
            data,
            success: res => {
                if(typeof(res) !== 'object') res = JSON.parse(res)
                if(res.code === 1) callback(res)
                else if(res.code === 2) {
                    location.href = "/login"
                }
                else alert(res.msg)
            },
            error: err => {
                
            }
        })
    }
}
