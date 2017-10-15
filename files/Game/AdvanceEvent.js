import simple from 'https://gitcdn.link/cdn/anliting/simple.js/fc6547da84b3403f8155a7d8a0307d5a55eacecd/src/simple.static.js'
import applyKeyEventToPressedKeys from './applyKeyEventToPressedKeys.js'
let{array}=simple
function AdvanceEvent(time){
    this.time=time
}
AdvanceEvent.prototype.forEachFragment=function(func){
    let
        pressedKeys=Object.assign({},this.pressedKeys),
        fragments=[...this.keyEvents,{time:this.time}]
    array.difference(
        fragments.map(e=>e.time)
    ).forEach((dt,i)=>{
        fragments[i].dt=dt
    })
    fragments.forEach(f=>{
        func(f.dt,pressedKeys)
        applyKeyEventToPressedKeys(f,pressedKeys)
    })
}
export default AdvanceEvent
