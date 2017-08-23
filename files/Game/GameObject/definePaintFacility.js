let imageServer={
    _loadedImage:{},
    load(path){
        if(this._loadedImage[path])
            return this._loadedImage[path]
        let n=new Image
        n.src=path
        let p=new Promise(rs=>n.onload=()=>rs(n))
        this._loadedImage[path]=p
        ;(async()=>{
            this._loadedImage[path]=await p
        })()
        return p
    },
}
;(async()=>{
    let
        [
            dom,
            _repaintCanvas,
        ]=await Promise.all([
            module.repository.althea.dom,
            module.shareImport('definePaintFacility/_repaintCanvas.js'),
        ])
    function _createBackgroundCanvas(img,size){
        if(
            img==this._backgroundImageImage&&
            size.eq(this._size)&&
            this._backgroundCanvas
        )
            return this._backgroundCanvas
        let
            c=dom('canvas'),
            ct=c.getContext('2d')
        ;[c.width,c.height]=size
        ct.fillStyle=ct.createPattern(img,'repeat')
        ct.fillRect(0,0,...size)
        return this._backgroundCanvas=c
    }
    return o=>{
        o.prototype._repaintCanvas=_repaintCanvas
        o.prototype._createBackgroundCanvas=_createBackgroundCanvas
        o.imageServer=imageServer
    }
})()
