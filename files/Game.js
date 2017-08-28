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
        this._lastAdvancedTime=performance.now()
        this._pressedKeys={}
        this._processedKeyEvents=[]
        this._unprocessedKeyEvents=[]
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
        this.advance(now-this._lastAdvancedTime)
        this._lastAdvancedTime=now
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
    Game.prototype.advance=function(t){
        let
            now=this.time+t,
            keyEvents=[]
        while(
            this._unprocessedKeyEvents.length&&
            this._unprocessedKeyEvents[0].time<now
        )
            keyEvents.push(this._unprocessedKeyEvents.shift())
        this._keyEvents=keyEvents
        GameObject.prototype.advance.call(this,t)
        while(keyEvents.length){
            let e=keyEvents.shift()
            if(e.type=='keydown')
                this._pressedKeys[e.key]=0
            else if(e.type=='keyup'){
                if(e.key in this._pressedKeys)
                    delete this._pressedKeys[e.key]
            }
            this._processedKeyEvents.push(e)
        }
    }
    Game.prototype._keydown=function(e){
        this._key[e.key]=1
        this._unprocessedKeyEvents.push({
            type:'keydown',
            time:this.time+performance.now()-this._lastAdvancedTime,
            key:e.key,
        })
    }
    Game.prototype._keyup=function(e){
        this._key[e.key]=0
        this._unprocessedKeyEvents.push({
            type:'keyup',
            time:this.time+performance.now()-this._lastAdvancedTime,
            key:e.key,
        })
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
    Object.defineProperty(Game.prototype,'adapt',{get(){return()=>{
        this.width=document.body.clientWidth
        this.height=document.body.clientHeight
    }}})
    Game.style=style
    Game.GameObject=GameObject
    return Game
})()
