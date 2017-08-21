if(!module.repository.template)
    module.repository.template=module.importByPath('https://gitcdn.link/cdn/anliting/template/5650ba86536cf662a2aa6b1bd5d9f3e27ad701bf/src/template.static.js',{mode:1})
;(async()=>{
    let[
        dom,
        Vector2,
        definePaintFacility,
        defineInterface,
    ]=await Promise.all([
        module.repository.althea.dom,
        module.repository.Vector2,
        module.shareImport('GameObject/definePaintFacility.js'),
        module.shareImport('GameObject/defineInterface.js'),
    ])
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
    return GameObject
})()
