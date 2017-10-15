import sortByPaintPriority from './_repaintCanvas/sortByPaintPriority.js'
import simple from 'https://gitcdn.link/cdn/anliting/simple.js/fc6547da84b3403f8155a7d8a0307d5a55eacecd/src/simple.static.js'
let{Vector2}=simple
function _repaintCanvas(n){
    if(this._painting)
        this._painting()
    let
        c=n.getContext('2d'),
        a=[],
        canceled=false,
        getImagesPromise
    this._painting=()=>canceled=true
    dft.call(this,this)
    getImagesPromise=getImages.call(this)
    sortByPaintPriority(a)
    ;(async()=>{
        await getImagesPromise
        if(canceled)
            return
        this._pendingFrames.push(()=>{
            if(canceled)
                return
            c.clearRect(0,0,...this._size)
            for(let d of a){
                if(d.f=='i'||d.f=='bg'){
                    let leftTop=d.printFrom.sub(
                        (new Vector2(d.i.width,d.i.height)).newDivN(2)
                    )
                    c.drawImage(d.i,...leftTop)
                    if(d.o.debug){
                        c.strokeStyle='gray'
                        c.strokeRect(...leftTop,...d.o._size)
                    }
                }else if(d.f=='b'){
                    let leftTop=d.printFrom.newSub(
                        d.o._size.newDivN(2)
                    )
                    c.strokeStyle=d.o.style
                    c.strokeRect(...leftTop,...d.o._size)
                }else if(d.f=='t'){
                    let leftTop=d.printFrom
                    c.fillStyle=d.o.style
                    c.font='32px 微軟正黑體,sans-serif'
                    c.textAlign='center'
                    c.textBaseline='middle'
                    c.fillText(d.o.text,...leftTop)
                }
            }
            delete this._painting
        })
    })()
    function getImages(){
        return Promise.all(a.map(d=>{
            let o=d.o
            if(d.f=='i'){
                if(o._imageImage==undefined)
                    o._imageImage=this._loadImage(o._image)
                if(o._imageImage instanceof Promise)
                    return(async()=>{
                        d.i=o._imageImage=await o._imageImage
                    })()
                else
                    d.i=o._imageImage
            }else if(d.f=='bg'){
                if(o._backgroundImageImage==undefined)
                    o._backgroundImageImage=
                        this._loadImage(o._backgroundImage)
                return(async()=>{
                    o._backgroundImageImage=
                        await o._backgroundImageImage
                    d.i=o._createBackgroundCanvas(
                        o._backgroundImageImage,
                        o._size
                    )
                })()
            }
        }).filter(v=>v))
    }
    // depth-first traversal
    function dft(o,v=new Vector2){
        let printFrom=v.newMulN(1,-1).add(this._size.newDivN(2))
        if(o._backgroundImage!=undefined)
            a.push({f:'bg',o,v,printFrom})
        if(o._image!=undefined)
            a.push({f:'i',o,v,printFrom})
        if(o.style!=undefined)
            a.push({f:'b',o,v,printFrom})
        if(o.text!=undefined)
            a.push({f:'t',o,v,printFrom})
        o._children.forEach(c=>dft.call(this,c.o,v.newAdd(c.position)))
    }
}
export default _repaintCanvas
