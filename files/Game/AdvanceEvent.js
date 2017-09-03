;(async()=>{
    let[
        template,
        applyKeyEventToPressedKeys,
    ]=await Promise.all([
        module.repository.template,
        module.repository.applyKeyEventToPressedKeys,
    ])
    function AdvanceEvent(time){
        this.time=time
    }
    AdvanceEvent.prototype.forEachFragment=function(func){
        let
            pressedKeys=Object.assign({},this.pressedKeys),
            fragments=[...this.keyEvents,{time:this.time}]
        template.array.difference(
            fragments.map(e=>e.time)
        ).forEach((dt,i)=>{
            fragments[i].dt=dt
        })
        fragments.forEach(f=>{
            func(f.dt,pressedKeys)
            applyKeyEventToPressedKeys(f,pressedKeys)
        })
    }
    return AdvanceEvent
})()
