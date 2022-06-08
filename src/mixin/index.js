export const mixin = {
    methods: {
        //获取图片地址
        attachImageUrl(srcUrl) {
            return srcUrl ? "192.168.163.130:9000/edu" + srcUrl : "192.168.163.130:9000/edu" + '/img/user.jpg';
        },
    }
}