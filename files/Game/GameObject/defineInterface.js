;(async()=>{
    let[
        dom,
        appendChild
    ]=await Promise.all([
        module.repository.althea.dom,
        module.shareImport('defineInterface/appendChild.js'),
    ])
    return o=>{
        o.appendChild=appendChild
        o.removeChild=function(c){
            this._children.delete(c)
        }
        o.removeChildren=function(){
            [...arguments].map(c=>
                this._children.delete(c)
            )
        }
        Object.defineProperty(o,'image',{set(val){
            this._image=val
            this._imageImage=undefined
        }})
        Object.defineProperty(o,'backgroundImage',{set(val){
            this._backgroundImage=val
            this._backgroundImageImage=undefined
            this._backgroundCanvas=undefined
        }})
        Object.defineProperty(o,'width',{set(val){
            this._size.x=val
            this._backgroundCanvas=undefined
            this._nodes.map(this._updateNodeWidth.bind(this))
        },get(){
            return this._size.x
        }})
        Object.defineProperty(o,'height',{set(val){
            this._size.y=val
            this._backgroundCanvas=undefined
            this._nodes.map(this._updateNodeHeight.bind(this))
        },get(){
            return this._size.y
        }})
        o.under=function(){
            this._paintPriorityEdges.push(...arguments)
        }
        o.createNode=function(){
            let doc={
                node:dom('canvas',{className:'object'})
            }
            this._updateNodeWidth(doc)
            this._updateNodeHeight(doc)
            this._nodes.push(doc)
            return doc.node
        }
    }
})()
