import GameObject from './GameObject.js'
import {arg,dom}from '/lib/core.static.js'
export default function(){
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
