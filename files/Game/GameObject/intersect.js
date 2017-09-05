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
;({
    intersect,
    rectangle,
})
