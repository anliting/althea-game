;(async()=>{
    let[
        template,
    ]=await Promise.all([
        module.repository.template,
    ])
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
    function addPaintChild(o,position=new template.Vector2){
        let c=new Child(o)
        c.move(position)
        this._children.add(c)
        return c
    }
    return addPaintChild
})()
