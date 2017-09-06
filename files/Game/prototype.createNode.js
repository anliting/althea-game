(async()=>{
    let[
        GameObject,
        arg,
        dom,
    ]=await Promise.all([
        module.repository.GameObject,
        module.repository.althea.arg,
        module.repository.althea.dom,
    ])
    return function(){
        return dom(GameObject.prototype.createNode.apply(this,arguments),{
            tabIndex:-1,
            oncontextmenu:e=>{
                if(arg.h)
                    return
                e.preventDefault()
                e.stopPropagation()
            },
            onkeydown:e=>{
                e.preventDefault()
                e.stopPropagation()
                this._keydown(e)
            },
            onkeyup:e=>{
                e.preventDefault()
                e.stopPropagation()
                this._keyup(e)
            }
        },n=>{n.classList.add('game')})
    }
})()
