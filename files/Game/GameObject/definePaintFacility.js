import{doe}from '/lib/core.static.js'
import _repaintCanvas from './definePaintFacility/_repaintCanvas.js'
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
function _createBackgroundCanvas(img,size){
    if(
        img==this._backgroundImageImage&&
        size.eq(this._size)&&
        this._backgroundCanvas
    )
        return this._backgroundCanvas
    let
        c=doe.canvas(),
        ct=c.getContext('2d')
    ;[c.width,c.height]=size
    ct.fillStyle=ct.createPattern(img,'repeat')
    ct.fillRect(0,0,...size)
    return this._backgroundCanvas=c
}
export default o=>{
    o.prototype._repaintCanvas=_repaintCanvas
    o.prototype._createBackgroundCanvas=_createBackgroundCanvas
    o.imageServer=imageServer
}
