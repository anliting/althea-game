import simple from 'https://gitcdn.link/cdn/anliting/simple.js/fc6547da84b3403f8155a7d8a0307d5a55eacecd/src/simple.static.js'
let{Vector2}=simple
function Child(object){
    this.object=object
}
Child.prototype.move=function(position){
    this.position=position
}
Object.defineProperty(Child.prototype,'o',{set(v){
    this.object=v
},get(){
    return this.object
}})
Object.defineProperty(Child.prototype,'p',{set(v){
    this.position=v
},get(){
    return this.position
}})
function addPaintChild(o,position=new Vector2){
    let c=new Child(o)
    c.move(position)
    this._children.add(c)
    return c
}
export default addPaintChild
