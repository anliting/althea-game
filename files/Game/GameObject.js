;(async()=>{
    let
        [
            template,
            definePaintFacility,
            defineInterface,
            analyze,
        ]=await Promise.all([
            module.repository.template,
            module.shareImport('GameObject/definePaintFacility.js'),
            module.shareImport('GameObject/defineInterface.js'),
            module.shareImport('GameObject/analyze.js'),
        ]),
        {Vector2}=template
    function GameObject(){
        this._size=new Vector2(...arguments)
        this._children=new Set
        this._nodes=[]
        this._paintPriorityEdges=[]
        this._clockChildren=new Set
        this.time=0
    }
    GameObject.prototype._updateNodeWidth=function(doc){
        doc.node.width=this._size.x
    }
    GameObject.prototype._updateNodeHeight=function(doc){
        doc.node.height=this._size.y
    }
    GameObject.prototype._loadImage=function(path){
        return GameObject.imageServer.load(path)
    }
    GameObject.prototype.advance=function(e){
        this._clockChildren.forEach(o=>
            o.advance(e)
        )
        if(this.onAdvance)
            this.onAdvance(e)
        this.time+=e.time
    }
    GameObject.prototype.addClockChild=function(o){
        this._clockChildren.add(o)
    }
    GameObject.prototype.removeClockChild=function(o){
        this._clockChildren.delete(o)
    }
    definePaintFacility(GameObject)
    defineInterface(GameObject.prototype)
    GameObject.Vector2=Vector2
    Object.assign(GameObject,analyze)
    return GameObject
})()
