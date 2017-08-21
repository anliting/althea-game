;(async()=>{
    let[
        dom,
        Vector2,
    ]=await Promise.all([
        module.repository.althea.dom,
        module.repository.Vector2,
    ])
    function Child(o){
        this.o=o
    }
    Child.prototype.move=function(position){
        this.position=position
    }
    function appendChild(o,position=new Vector2){
        let c=new Child(o)
        c.move(position)
        this._children.add(c)
        return c
    }
    return appendChild
})()
