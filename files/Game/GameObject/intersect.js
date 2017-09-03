function intersect(a,ap,b,bp){
    return rectIntersect(...rect(a,ap),...rect(b,bp))
}
function rect(o,p){
    let r=o._size.newDivN(2)
    return[p.newSub(r),p.newAdd(r)]
}
function rectIntersect(ah,at,bh,bt){
    return ah.lt(bt)&&bh.lt(at)
}
intersect
