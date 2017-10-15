import simple from 'https://gitcdn.link/cdn/anliting/simple.js/fc6547da84b3403f8155a7d8a0307d5a55eacecd/src/simple.static.js'
let{DirectedGraph,PriorityQueue}=simple
function createContainer(o){
    return{
        in(v){
            this.size++
            o.in(v)
        },out(){
            this.size--
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
        objects=[...new Set(a.map(d=>d.o))]
    objects.map(o=>{
        let s=g.addVertex()
        oToN.set(o,{s,ca:[]})
        sToO[s]=o
    })
    objects.map(o=>{
        let v=oToN.get(o).s
        o._paintPriorityEdges.map(p=>{
            let n=oToN.get(p)
            if(n)
                g.addEdge(v,n.s)
        })
    })
    a.map(c=>
        oToN.get(c.o).ca.push(c)
    )
    objects.map(o=>{
        let n=oToN.get(o)
        n.remainingChildrenCount=n.ca.length
    })
    let
        t=0,
        pq=new PriorityQueue((a,b)=>bottom(b)-bottom(a))
    g.longestTopologicalSort(createContainer({
        in(s){
            pq.in(...oToN.get(sToO[s]).ca)
        },out(){
            for(;;){
                let c=pq.out(),n=oToN.get(c.o)
                c.paintPriority=t++
                if(!--n.remainingChildrenCount)
                    return n.s
            }
        }
    }))
    a.sort((a,b)=>a.paintPriority-b.paintPriority)
}
function bottom(c){
    return c.v.y-c.o._size.y/2
}
export default sortByPaintPriority
