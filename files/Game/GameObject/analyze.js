import {Range}from 'https://gitcdn.link/cdn/anliting/simple.js/1c1f83d1aa660bd1366b80e8736d7dfefab7e99b/src/simple.static.js'
function intersect(a,ap,b,bp){
    return rectangleIntersect(...rectangle(a,ap),...rectangle(b,bp))
}
function rectangle(o,p){
    let r=o._size.newDivN(2)
    return[p.newSub(r),p.newAdd(r)]
}
function rectangleIntersect(ah,at,bh,bt){
    return ah.lt(bt)&&bh.lt(at)
}
function calcLongestMove(child,direction,obstacles){
    let
        positive=new Range(0,Infinity),
        rate=Infinity,
        childRectangle=rectangle(child.o,child.p)
    for(let obstacle of obstacles){
        let
            obstacleRectangle=rectangle(obstacle.o,obstacle.p),
            range=collisionRange(
                childRectangle,obstacleRectangle,direction,'x'
            ).intersect(collisionRange(
                childRectangle,obstacleRectangle,direction,'y'
            ),positive)
        if(+range)
            rate=Math.min(rate,range.x)
    }
    return rate
    function collisionRange(a,b,v,axis){
        let r=new Range(
            b[1][axis]-a[0][axis],
            b[0][axis]-a[1][axis],
        )
        if(0<=v[axis])
            [r.x,r.y]=[r.y,r.x]
        return r.divN(v[axis])
    }
}
export default{
    intersect,
    rectangle,
    calcLongestMove,
}
