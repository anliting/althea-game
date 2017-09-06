if(!module.repository.template)
    module.repository.template=module.importByPath('https://gitcdn.link/cdn/anliting/template/5151b86091917a0e550c91875077fa355c0732ee/src/template.static.js',{mode:1})
Object.assign(module.repository,{
    GameObject:module.shareImport('Game/GameObject.js'),
    applyKeyEventToPressedKeys:module.shareImport('Game/applyKeyEventToPressedKeys.js'),
})
;(async()=>{
    let[
        dom,
        GameObject,
        applyKeyEventToPressedKeys,
        style,
        createNode,
        AdvanceEvent,
    ]=await Promise.all([
        module.repository.althea.dom,
        module.repository.GameObject,
        module.repository.applyKeyEventToPressedKeys,
        module.get('Game/style.css'),
        module.shareImport('Game/prototype.createNode.js'),
        module.shareImport('Game/AdvanceEvent.js'),
    ])
    function Game(){
        GameObject.apply(this,arguments)
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
        this.advance(new AdvanceEvent(
            now-this._lastAdvancedTime
        ))
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
    Game.prototype.advance=function(e){
        let
            next=this.time+e.time,
            keyEvents=[]
        while(
            this._unprocessedKeyEvents.length&&
            this._unprocessedKeyEvents[0].time<next
        ){
            let
                e=this._unprocessedKeyEvents.shift(),
                f=Object.assign({},e)
            this._processedKeyEvents.push(e)
            f.time-=this.time
            keyEvents.push(f)
        }
        e.pressedKeys=this._pressedKeys
        e.keyEvents=keyEvents
        GameObject.prototype.advance.call(this,e)
        while(keyEvents.length)
            Game.applyKeyEventToPressedKeys(
                keyEvents.shift(),this._pressedKeys
            )
    }
    Game.prototype._keydown=function(e){
        this._unprocessedKeyEvents.push({
            type:'keydown',
            time:this.time+performance.now()-this._lastAdvancedTime,
            key:e.key,
        })
    }
    Game.prototype._keyup=function(e){
        this._unprocessedKeyEvents.push({
            type:'keyup',
            time:this.time+performance.now()-this._lastAdvancedTime,
            key:e.key,
        })
    }
    Game.prototype.createNode=createNode
    Object.defineProperty(Game.prototype,'adapt',{get(){return()=>{
        this.width=document.body.clientWidth
        this.height=document.body.clientHeight
    }}})
    Game.applyKeyEventToPressedKeys=applyKeyEventToPressedKeys
    Game.style=style
    Game.GameObject=GameObject
    return Game
})()
