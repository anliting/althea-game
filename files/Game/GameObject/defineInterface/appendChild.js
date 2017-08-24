;(async()=>{
    let[
        template,
    ]=await Promise.all([
        module.repository.template,
    ])
    function Child(o){
        this.o=o
    }
    Child.prototype.move=function(position){
        this.position=position
    }
    function appendChild(o,position=new template.Vector2){
        let c=new Child(o)
        c.move(position)
        this._children.add(c)
        return c
    }
    return appendChild
})()
