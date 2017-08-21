;(async()=>{
    let[
        arg,
        dom,
        GameObject,
        style,
    ]=await Promise.all([
        module.repository.althea.arg,
        module.repository.althea.dom,
        module.shareImport('Game/GameObject.js'),
        module.get('Game/style.css'),
    ])
    function Game(){
        GameObject.apply(this,arguments)
        this._key={}
        this._lastTime=performance.now()
        this.maxFps=24
        this._pendingFrames=[]
        this.paintedFramesCount=0
        let flush=()=>{
            this._pendingFrames.map(f=>f())
            this._pendingFrames=[]
            this.paintedFramesCount++
            requestAnimationFrame(flush)
        }
        requestAnimationFrame(flush)
    }
    Object.setPrototypeOf(Game,GameObject)
    Object.setPrototypeOf(Game.prototype,GameObject.prototype)
    Game.prototype._frame=function(){
        let now=performance.now()
        if(this.advance)
            this.advance(now-this._lastTime)
        this._lastTime=now
        this._nodes.map(d=>
            this._repaintCanvas(d.node)
        )
    }
    Object.defineProperty(Game.prototype,'maxFps',{set(v){
        this._maxFps=v
        this._clockCycle=1e3/this._maxFps
        if(this._intervalId!=undefined)
            clearInterval(this._intervalId)
        this._intervalId=
            setInterval(this._frame.bind(this),this._clockCycle)
    },get(){
        return this._maxFps
    }})
    Game.prototype._keydown=function(e){
        this._key[e.key]=1
        if(this.keydown)
            this.keydown(e)
    }
    Game.prototype._keyup=function(e){
        this._key[e.key]=0
        if(this.keyup)
            this.keyup(e)
    }
    Game.prototype.createNode=function(){
        let n=GameObject.prototype.createNode.apply(this,arguments)
        dom(n,{
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
        })
        n.classList.add('game')
        return n
    }
    Game.style=style
    Game.GameObject=GameObject
    return Game
})()
