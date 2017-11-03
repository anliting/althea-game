import {Vector2}from 'https://gitcdn.link/cdn/anliting/simple.js/1c1f83d1aa660bd1366b80e8736d7dfefab7e99b/src/simple.static.js'
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
