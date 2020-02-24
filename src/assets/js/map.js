class Mouser {
    constructor(marker, index, callback) {
        this.marker = marker
        this.index = index
        this.counter = 0
        this.callback = callback
        this.showInfo = function (e) {
            callback(marker, index, e)
        }
        //保存点击处理程序,以便可以在多个地方使用
        this._showInfo = this.showInfo.bind(this);
        this.marker.on("click", this._showInfo);
    }
    remove() {
        console.log('移除了marker的点击事件')
        this.marker.off("click", this._showInfo);
    }
}

const template = '<div class="info-title">逛街帮</div><div class="info-content">' +
    '<div class="info-left"><img src="https://webapi.amap.com/images/amap.jpg"></div>' +
    '<div class="info-right"><p>逛街帮是一个让你更喜欢逛街的网站</p><p><a target="_self" href = "javascript:void(0)">点击进入商家</a></p></div>'

module.exports = { Mouser, template }
