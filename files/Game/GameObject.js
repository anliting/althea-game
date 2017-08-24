if(!module.repository.template)
    module.repository.template=module.importByPath('https://gitcdn.link/cdn/anliting/template/4abdb65b6586685bb760a2bf4f6cc0056a2e49ae/src/template.static.js',{mode:1})
;(async()=>{
    let
        [
            template,
            definePaintFacility,
            defineInterface,
        ]=await Promise.all([
            module.repository.template,
            module.shareImport('GameObject/definePaintFacility.js'),
            module.shareImport('GameObject/defineInterface.js'),
        ]),
        Vector2=template.Vector2
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
    Object.defineProperty(GameObject.prototype,'advance',{set(v){
        this._advance=v
    },get(){
        return dt=>{
            if(this._advance)
                this._advance(dt)
            this._clockChildren.forEach(o=>{
                if(o.advance)
                    o.advance(dt)
            })
            this.time+=dt
        }
    }})
    GameObject.prototype.bind=function(o){
        this._clockChildren.add(o)
    }
    GameObject.prototype.unbind=function(o){
        this._clockChildren.delete(o)
    }
    definePaintFacility(GameObject)
    defineInterface(GameObject.prototype)
    GameObject.Vector2=Vector2
    return GameObject
})()
