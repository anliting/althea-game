Object.entries({"Game/GameObject/defineInterface/appendChild.js":";(async()=>{\n    let[\n        template,\n    ]=await Promise.all([\n        module.repository.template,\n    ])\n    function Child(o){\n        this.o=o\n    }\n    Child.prototype.move=function(position){\n        this.position=position\n    }\n    function appendChild(o,position=new template.Vector2){\n        let c=new Child(o)\n        c.move(position)\n        this._children.add(c)\n        return c\n    }\n    return appendChild\n})()\n","Game/GameObject/defineInterface.js":";(async()=>{\n    let[\n        dom,\n        appendChild\n    ]=await Promise.all([\n        module.repository.althea.dom,\n        module.shareImport('defineInterface/appendChild.js'),\n    ])\n    return o=>{\n        o.appendChild=appendChild\n        o.removeChild=function(c){\n            this._children.delete(c)\n        }\n        o.removeChildren=function(){\n            [...arguments].map(c=>\n                this._children.delete(c)\n            )\n        }\n        Object.defineProperty(o,'image',{set(val){\n            this._image=val\n            this._imageImage=undefined\n        }})\n        Object.defineProperty(o,'backgroundImage',{set(val){\n            this._backgroundImage=val\n            this._backgroundImageImage=undefined\n            this._backgroundCanvas=undefined\n        }})\n        Object.defineProperty(o,'width',{set(val){\n            this._size.x=val\n            this._backgroundCanvas=undefined\n            this._nodes.map(this._updateNodeWidth.bind(this))\n        },get(){\n            return this._size.x\n        }})\n        Object.defineProperty(o,'height',{set(val){\n            this._size.y=val\n            this._backgroundCanvas=undefined\n            this._nodes.map(this._updateNodeHeight.bind(this))\n        },get(){\n            return this._size.y\n        }})\n        o.under=function(){\n            this._paintPriorityEdges.push(...arguments)\n        }\n        o.createNode=function(){\n            let doc={\n                node:dom.canvas({className:'object'})\n            }\n            this._updateNodeWidth(doc)\n            this._updateNodeHeight(doc)\n            this._nodes.push(doc)\n            return doc.node\n        }\n    }\n})()\n","Game/GameObject/definePaintFacility/_repaintCanvas/sortByPaintPriority.js":";(async()=>{\n    let[\n        template,\n    ]=await Promise.all([\n        module.repository.template,\n    ])\n    function createContainer(o){\n        return{\n            in(v){\n                this.size++\n                o.in(v)\n            },out(){\n                this.size--\n                return o.out()\n            },size:0,\n        }\n    }\n    function sortByPaintPriority(a){\n        let\n            // object to its note\n            oToN=new WeakMap,\n            sToO={},\n            g=new template.DirectedGraph,\n            objects=[...new Set(a.map(d=>d.o))]\n        objects.map(o=>{\n            let s=g.addVertex()\n            oToN.set(o,{s,ca:[]})\n            sToO[s]=o\n        })\n        objects.map(o=>{\n            let v=oToN.get(o).s\n            o._paintPriorityEdges.map(p=>{\n                let n=oToN.get(p)\n                if(n)\n                    g.addEdge(v,n.s)\n            })\n        })\n        a.map(c=>\n            oToN.get(c.o).ca.push(c)\n        )\n        objects.map(o=>{\n            let n=oToN.get(o)\n            n.remainingChildrenCount=n.ca.length\n        })\n        let\n            t=0,\n            pq=new template.PriorityQueue((a,b)=>bottom(b)-bottom(a))\n        g.longestTopologicalSort(createContainer({\n            in(s){\n                pq.in(...oToN.get(sToO[s]).ca)\n            },out(){\n                for(;;){\n                    let c=pq.out(),n=oToN.get(c.o)\n                    c.paintPriority=t++\n                    if(!--n.remainingChildrenCount)\n                        return n.s\n                }\n            }\n        }))\n        a.sort((a,b)=>a.paintPriority-b.paintPriority)\n    }\n    function bottom(c){\n        return c.v.y-c.o._size.y/2\n    }\n    return sortByPaintPriority\n})()\n","Game/GameObject/definePaintFacility/_repaintCanvas.js":";(async()=>{\n    let\n        [\n            sortByPaintPriority,\n            template,\n        ]=await Promise.all([\n            module.shareImport('_repaintCanvas/sortByPaintPriority.js'),\n            module.repository.template,\n        ]),\n        Vector2=template.Vector2\n    function _repaintCanvas(n){\n        if(this._painting)\n            this._painting()\n        let\n            c=n.getContext('2d'),\n            a=[],\n            canceled=false,\n            getImagesPromise\n        this._painting=()=>canceled=true\n        dft.call(this,this)\n        getImagesPromise=getImages.call(this)\n        sortByPaintPriority(a)\n        ;(async()=>{\n            await getImagesPromise\n            if(canceled)\n                return\n            this._pendingFrames.push(()=>{\n                if(canceled)\n                    return\n                c.clearRect(0,0,...this._size)\n                a.map(d=>{\n                    if(d.f=='i'||d.f=='bg'){\n                        let leftTop=d.printFrom.sub(\n                            (new Vector2(d.i.width,d.i.height)).newDivN(2)\n                        )\n                        c.drawImage(d.i,...leftTop)\n                        if(d.o.debug){\n                            c.strokeStyle='gray'\n                            c.strokeRect(...leftTop,...d.o._size)\n                        }\n                    }else if(d.f=='b'){\n                        let leftTop=d.printFrom.newSub(\n                            d.o._size.newDivN(2)\n                        )\n                        c.strokeStyle=d.o.style\n                        c.strokeRect(...leftTop,...d.o._size)\n                    }else if(d.f=='t'){\n                        let leftTop=d.printFrom\n                        c.fillStyle=d.o.style\n                        c.font='32px 微軟正黑體,sans-serif'\n                        c.textAlign='center'\n                        c.textBaseline='middle'\n                        c.fillText(d.o.text,...leftTop)\n                    }\n                })\n                delete this._painting\n            })\n        })()\n        function getImages(){\n            return Promise.all(a.map(d=>{\n                let o=d.o\n                if(d.f=='i'){\n                    if(o._imageImage==undefined)\n                        o._imageImage=this._loadImage(o._image)\n                    if(o._imageImage instanceof Promise)\n                        return(async()=>{\n                            d.i=o._imageImage=await o._imageImage\n                        })()\n                    else\n                        d.i=o._imageImage\n                }else if(d.f=='bg'){\n                    if(o._backgroundImageImage==undefined)\n                        o._backgroundImageImage=\n                            this._loadImage(o._backgroundImage)\n                    return(async()=>{\n                        o._backgroundImageImage=\n                            await o._backgroundImageImage\n                        d.i=o._createBackgroundCanvas(\n                            o._backgroundImageImage,\n                            o._size\n                        )\n                    })()\n                }\n            }).filter(v=>v))\n        }\n        // depth-first traversal\n        function dft(o,v=new Vector2){\n            let printFrom=v.newMulN(1,-1).add(this._size.newDivN(2))\n            if(o._backgroundImage!=undefined)\n                a.push({f:'bg',o,v,printFrom})\n            if(o._image!=undefined)\n                a.push({f:'i',o,v,printFrom})\n            if(o.style!=undefined)\n                a.push({f:'b',o,v,printFrom})\n            if(o.text!=undefined)\n                a.push({f:'t',o,v,printFrom})\n            o._children.forEach(c=>dft.call(this,c.o,v.newAdd(c.position)))\n        }\n    }\n    return _repaintCanvas\n})()\n","Game/GameObject/definePaintFacility.js":"let imageServer={\n    _loadedImage:{},\n    load(path){\n        if(this._loadedImage[path])\n            return this._loadedImage[path]\n        let n=new Image\n        n.src=path\n        let p=new Promise(rs=>n.onload=()=>rs(n))\n        this._loadedImage[path]=p\n        ;(async()=>{\n            this._loadedImage[path]=await p\n        })()\n        return p\n    },\n}\n;(async()=>{\n    let\n        [\n            dom,\n            _repaintCanvas,\n        ]=await Promise.all([\n            module.repository.althea.dom,\n            module.shareImport('definePaintFacility/_repaintCanvas.js'),\n        ])\n    function _createBackgroundCanvas(img,size){\n        if(\n            img==this._backgroundImageImage&&\n            size.eq(this._size)&&\n            this._backgroundCanvas\n        )\n            return this._backgroundCanvas\n        let\n            c=dom.canvas(),\n            ct=c.getContext('2d')\n        ;[c.width,c.height]=size\n        ct.fillStyle=ct.createPattern(img,'repeat')\n        ct.fillRect(0,0,...size)\n        return this._backgroundCanvas=c\n    }\n    return o=>{\n        o.prototype._repaintCanvas=_repaintCanvas\n        o.prototype._createBackgroundCanvas=_createBackgroundCanvas\n        o.imageServer=imageServer\n    }\n})()\n","Game/GameObject.js":"if(!module.repository.template)\n    module.repository.template=module.importByPath('https://gitcdn.link/cdn/anliting/template/b56af8d4c27e53120c7aaae34b72a8148e22b602/src/template.static.js',{mode:1})\n;(async()=>{\n    let\n        [\n            template,\n            definePaintFacility,\n            defineInterface,\n        ]=await Promise.all([\n            module.repository.template,\n            module.shareImport('GameObject/definePaintFacility.js'),\n            module.shareImport('GameObject/defineInterface.js'),\n        ]),\n        Vector2=template.Vector2\n    function GameObject(){\n        this._size=new Vector2(...arguments)\n        this._children=new Set\n        this._nodes=[]\n        this._paintPriorityEdges=[]\n        this._clockChildren=new Set\n        this.time=0\n    }\n    GameObject.prototype._updateNodeWidth=function(doc){\n        doc.node.width=this._size.x\n    }\n    GameObject.prototype._updateNodeHeight=function(doc){\n        doc.node.height=this._size.y\n    }\n    GameObject.prototype._loadImage=function(path){\n        return GameObject.imageServer.load(path)\n    }\n    GameObject.prototype.advance=function(dt){\n        this._clockChildren.forEach(o=>\n            o.advance(dt)\n        )\n        if(this.onAdvance)\n            this.onAdvance(dt)\n        this.time+=dt\n    }\n    GameObject.prototype.bind=function(o){\n        this._clockChildren.add(o)\n    }\n    GameObject.prototype.unbind=function(o){\n        this._clockChildren.delete(o)\n    }\n    definePaintFacility(GameObject)\n    defineInterface(GameObject.prototype)\n    GameObject.Vector2=Vector2\n    return GameObject\n})()\n","Game/style.css":".game.object{\n    outline:none;\n    overflow:hidden;\n    cursor:default;\n}\ndiv.game.object{\n    width:100%;\n    height:100%;\n}\n"}).map(([k,v])=>module.static(k,v));;(async()=>{
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
