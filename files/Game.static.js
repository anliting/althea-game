import { arg, dom } from '/lib/core.static.js';
import simple from 'https://gitcdn.link/cdn/anliting/simple.js/fc6547da84b3403f8155a7d8a0307d5a55eacecd/src/simple.static.js';

let {DirectedGraph,PriorityQueue}=simple;
function createContainer(o){
    return{
        in(v){
            this.size++;
            o.in(v);
        },out(){
            this.size--;
            return o.out()
        },size:0,
    }
}
function sortByPaintPriority(a){
    let
        // object to its note
        oToN=new WeakMap,
        sToO={},
        g=new DirectedGraph,
        objects=[...new Set(a.map(d=>d.o))];
    objects.map(o=>{
        let s=g.addVertex();
        oToN.set(o,{s,ca:[]});
        sToO[s]=o;
    });
    objects.map(o=>{
        let v=oToN.get(o).s;
        o._paintPriorityEdges.map(p=>{
            let n=oToN.get(p);
            if(n)
                g.addEdge(v,n.s);
        });
    });
    a.map(c=>
        oToN.get(c.o).ca.push(c)
    );
    objects.map(o=>{
        let n=oToN.get(o);
        n.remainingChildrenCount=n.ca.length;
    });
    let
        t=0,
        pq=new PriorityQueue((a,b)=>bottom(b)-bottom(a));
    g.longestTopologicalSort(createContainer({
        in(s){
            pq.in(...oToN.get(sToO[s]).ca);
        },out(){
            for(;;){
                let c=pq.out(),n=oToN.get(c.o);
                c.paintPriority=t++;
                if(!--n.remainingChildrenCount)
                    return n.s
            }
        }
    }));
    a.sort((a,b)=>a.paintPriority-b.paintPriority);
}
function bottom(c){
    return c.v.y-c.o._size.y/2
}

let {Vector2: Vector2$1}=simple;
function _repaintCanvas(n){
    if(this._painting)
        this._painting();
    let
        c=n.getContext('2d'),
        a=[],
        canceled=false,
        getImagesPromise;
    this._painting=()=>canceled=true;
    dft.call(this,this);
    getImagesPromise=getImages.call(this);
    sortByPaintPriority(a)
    ;(async()=>{
        await getImagesPromise;
        if(canceled)
            return
        this._pendingFrames.push(()=>{
            if(canceled)
                return
            c.clearRect(0,0,...this._size);
            for(let d of a){
                if(d.f=='i'||d.f=='bg'){
                    let leftTop=d.printFrom.sub(
                        (new Vector2$1(d.i.width,d.i.height)).newDivN(2)
                    );
                    c.drawImage(d.i,...leftTop);
                    if(d.o.debug){
                        c.strokeStyle='gray';
                        c.strokeRect(...leftTop,...d.o._size);
                    }
                }else if(d.f=='b'){
                    let leftTop=d.printFrom.newSub(
                        d.o._size.newDivN(2)
                    );
                    c.strokeStyle=d.o.style;
                    c.strokeRect(...leftTop,...d.o._size);
                }else if(d.f=='t'){
                    let leftTop=d.printFrom;
                    c.fillStyle=d.o.style;
                    c.font='32px 微軟正黑體,sans-serif';
                    c.textAlign='center';
                    c.textBaseline='middle';
                    c.fillText(d.o.text,...leftTop);
                }
            }
            delete this._painting;
        });
    })();
    function getImages(){
        return Promise.all(a.map(d=>{
            let o=d.o;
            if(d.f=='i'){
                if(o._imageImage==undefined)
                    o._imageImage=this._loadImage(o._image);
                if(o._imageImage instanceof Promise)
                    return(async()=>{
                        d.i=o._imageImage=await o._imageImage;
                    })()
                else
                    d.i=o._imageImage;
            }else if(d.f=='bg'){
                if(o._backgroundImageImage==undefined)
                    o._backgroundImageImage=
                        this._loadImage(o._backgroundImage);
                return(async()=>{
                    o._backgroundImageImage=
                        await o._backgroundImageImage;
                    d.i=o._createBackgroundCanvas(
                        o._backgroundImageImage,
                        o._size
                    );
                })()
            }
        }).filter(v=>v))
    }
    // depth-first traversal
    function dft(o,v=new Vector2$1){
        let printFrom=v.newMulN(1,-1).add(this._size.newDivN(2));
        if(o._backgroundImage!=undefined)
            a.push({f:'bg',o,v,printFrom});
        if(o._image!=undefined)
            a.push({f:'i',o,v,printFrom});
        if(o.style!=undefined)
            a.push({f:'b',o,v,printFrom});
        if(o.text!=undefined)
            a.push({f:'t',o,v,printFrom});
        o._children.forEach(c=>dft.call(this,c.o,v.newAdd(c.position)));
    }
}

let imageServer={
    _loadedImage:{},
    load(path){
        if(this._loadedImage[path])
            return this._loadedImage[path]
        let n=new Image;
        n.src=path;
        let p=new Promise(rs=>n.onload=()=>rs(n));
        this._loadedImage[path]=p
        ;(async()=>{
            this._loadedImage[path]=await p;
        })();
        return p
    },
};
function _createBackgroundCanvas(img,size){
    if(
        img==this._backgroundImageImage&&
        size.eq(this._size)&&
        this._backgroundCanvas
    )
        return this._backgroundCanvas
    let
        c=dom.canvas(),
        ct=c.getContext('2d');[c.width,c.height]=size;
    ct.fillStyle=ct.createPattern(img,'repeat');
    ct.fillRect(0,0,...size);
    return this._backgroundCanvas=c
}
var definePaintFacility = o=>{
    o.prototype._repaintCanvas=_repaintCanvas;
    o.prototype._createBackgroundCanvas=_createBackgroundCanvas;
    o.imageServer=imageServer;
};

let {Vector2: Vector2$2}=simple;
function Child(object){
    this.object=object;
}
Child.prototype.move=function(position){
    this.position=position;
};
Object.defineProperty(Child.prototype,'o',{set(v){
    this.object=v;
},get(){
    return this.object
}});
Object.defineProperty(Child.prototype,'p',{set(v){
    this.position=v;
},get(){
    return this.position
}});
function addPaintChild(o,position=new Vector2$2){
    let c=new Child(o);
    c.move(position);
    this._children.add(c);
    return c
}

var defineInterface = o=>{
    o.addPaintChild=addPaintChild;
    o.removePaintChild=function(c){
        this._children.delete(c);
    };
    o.removePaintChildren=function(){
        [...arguments].map(c=>
            this._children.delete(c)
        );
    };
    Object.defineProperty(o,'image',{set(val){
        this._image=val;
        this._imageImage=undefined;
    }});
    Object.defineProperty(o,'backgroundImage',{set(val){
        this._backgroundImage=val;
        this._backgroundImageImage=undefined;
        this._backgroundCanvas=undefined;
    }});
    Object.defineProperty(o,'width',{set(val){
        this._size.x=val;
        this._backgroundCanvas=undefined;
        this._nodes.map(this._updateNodeWidth.bind(this));
    },get(){
        return this._size.x
    }});
    Object.defineProperty(o,'height',{set(val){
        this._size.y=val;
        this._backgroundCanvas=undefined;
        this._nodes.map(this._updateNodeHeight.bind(this));
    },get(){
        return this._size.y
    }});
    o.under=function(){
        this._paintPriorityEdges.push(...arguments);
    };
    o.createNode=function(){
        let doc={
            node:dom.canvas({className:'object'})
        };
        this._updateNodeWidth(doc);
        this._updateNodeHeight(doc);
        this._nodes.push(doc);
        return doc.node
    };
};

let {Range}=simple;
function intersect(a,ap,b,bp){
    return rectangleIntersect(...rectangle(a,ap),...rectangle(b,bp))
}
function rectangle(o,p){
    let r=o._size.newDivN(2);
    return[p.newSub(r),p.newAdd(r)]
}
function rectangleIntersect(ah,at,bh,bt){
    return ah.lt(bt)&&bh.lt(at)
}
function calcLongestMove(child,direction,obstacles){
    let
        positive=new Range(0,Infinity),
        rate=Infinity,
        childRectangle=rectangle(child.o,child.p);
    for(let obstacle of obstacles){
        let
            obstacleRectangle=rectangle(obstacle.o,obstacle.p),
            range=collisionRange(
                childRectangle,obstacleRectangle,direction,'x'
            ).intersect(collisionRange(
                childRectangle,obstacleRectangle,direction,'y'
            ),positive);
        if(+range)
            rate=Math.min(rate,range.x);
    }
    return rate
    function collisionRange(a,b,v,axis){
        let r=new Range(
            b[1][axis]-a[0][axis],
            b[0][axis]-a[1][axis],
        );
        if(0<=v[axis])
            [r.x,r.y]=[r.y,r.x];
        return r.divN(v[axis])
    }
}
var analyze = {
    intersect,
    rectangle,
    calcLongestMove,
};

let {Vector2}=simple;
function GameObject(){
    this._size=new Vector2(...arguments);
    this._children=new Set;
    this._nodes=[];
    this._paintPriorityEdges=[];
    this._clockChildren=new Set;
    this.time=0;
}
GameObject.prototype._updateNodeWidth=function(doc){
    doc.node.width=this._size.x;
};
GameObject.prototype._updateNodeHeight=function(doc){
    doc.node.height=this._size.y;
};
GameObject.prototype._loadImage=function(path){
    return GameObject.imageServer.load(path)
};
GameObject.prototype.advance=function(e){
    this._clockChildren.forEach(o=>
        o.advance(e)
    );
    if(this.onAdvance)
        this.onAdvance(e);
    this.time+=e.time;
};
GameObject.prototype.addClockChild=function(o){
    this._clockChildren.add(o);
};
GameObject.prototype.removeClockChild=function(o){
    this._clockChildren.delete(o);
};
definePaintFacility(GameObject);
defineInterface(GameObject.prototype);
GameObject.Vector2=Vector2;
Object.assign(GameObject,analyze);

var applyKeyEventToPressedKeys = (ke,pk)=>{
    if(ke.type=='keydown')
        pk[ke.key]=1;
    else if(ke.type=='keyup'&&ke.key in pk)
        delete pk[ke.key];
};

var style = `.game.object{
    outline:none;
    overflow:hidden;
    cursor:default;
}
div.game.object{
    width:100%;
    height:100%;
}
`;

var createNode = function(){
    return dom(GameObject.prototype.createNode.apply(this,arguments),{
        tabIndex:-1,
        oncontextmenu:e=>{
            if(arg.h)
                return
            e.preventDefault();
            e.stopPropagation();
        },
        onkeydown:e=>{
            e.preventDefault();
            e.stopPropagation();
            this._keydown(e);
        },
        onkeyup:e=>{
            e.preventDefault();
            e.stopPropagation();
            this._keyup(e);
        }
    },n=>{n.classList.add('game');})
};

let {array}=simple;
function AdvanceEvent(time){
    this.time=time;
}
AdvanceEvent.prototype.forEachFragment=function(func){
    let
        pressedKeys=Object.assign({},this.pressedKeys),
        fragments=[...this.keyEvents,{time:this.time}];
    array.difference(
        fragments.map(e=>e.time)
    ).forEach((dt,i)=>{
        fragments[i].dt=dt;
    });
    fragments.forEach(f=>{
        func(f.dt,pressedKeys);
        applyKeyEventToPressedKeys(f,pressedKeys);
    });
};

function Game(){
    GameObject.apply(this,arguments);
    this._lastAdvancedTime=performance.now();
    this._pressedKeys={};
    this._processedKeyEvents=[];
    this._unprocessedKeyEvents=[];
    this.maxFps=24;
    this._pendingFrames=[];
    this.paintedFramesCount=0;
    let flush=()=>{
        this._pendingFrames.map(f=>f());
        this._pendingFrames=[];
        this.paintedFramesCount++;
        requestAnimationFrame(flush);
    };
    requestAnimationFrame(flush);
}
Object.setPrototypeOf(Game,GameObject);
Object.setPrototypeOf(Game.prototype,GameObject.prototype);
Game.prototype._frame=function(){
    let now=performance.now();
    this.advance(new AdvanceEvent(
        now-this._lastAdvancedTime
    ));
    this._lastAdvancedTime=now;
    this._nodes.map(d=>
        this._repaintCanvas(d.node)
    );
};
Object.defineProperty(Game.prototype,'maxFps',{set(v){
    this._maxFps=v;
    this._clockCycle=1e3/this._maxFps;
    if(this._intervalId!=undefined)
        clearInterval(this._intervalId);
    this._intervalId=
        setInterval(this._frame.bind(this),this._clockCycle);
},get(){
    return this._maxFps
}});
Game.prototype.advance=function(e){
    let
        next=this.time+e.time,
        keyEvents=[];
    while(
        this._unprocessedKeyEvents.length&&
        this._unprocessedKeyEvents[0].time<next
    ){
        let
            e=this._unprocessedKeyEvents.shift(),
            f=Object.assign({},e);
        this._processedKeyEvents.push(e);
        f.time-=this.time;
        keyEvents.push(f);
    }
    e.pressedKeys=this._pressedKeys;
    e.keyEvents=keyEvents;
    GameObject.prototype.advance.call(this,e);
    while(keyEvents.length)
        Game.applyKeyEventToPressedKeys(
            keyEvents.shift(),this._pressedKeys
        );
};
Game.prototype._keydown=function(e){
    this._unprocessedKeyEvents.push({
        type:'keydown',
        time:this.time+performance.now()-this._lastAdvancedTime,
        key:e.key,
    });
};
Game.prototype._keyup=function(e){
    this._unprocessedKeyEvents.push({
        type:'keyup',
        time:this.time+performance.now()-this._lastAdvancedTime,
        key:e.key,
    });
};
Game.prototype.createNode=createNode;
Object.defineProperty(Game.prototype,'adapt',{get(){return()=>{
    this.width=document.body.clientWidth;
    this.height=document.body.clientHeight;
}}});
Game.applyKeyEventToPressedKeys=applyKeyEventToPressedKeys;
Game.style=style;
Game.GameObject=GameObject;

export default Game;
