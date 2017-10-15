import definePaintFacility from './GameObject/definePaintFacility.js'
import defineInterface from './GameObject/defineInterface.js'
import analyze from './GameObject/analyze.js'
import simple from 'https://gitcdn.link/cdn/anliting/simple.js/fc6547da84b3403f8155a7d8a0307d5a55eacecd/src/simple.static.js'
let{Vector2}=simple
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
export default GameObject
