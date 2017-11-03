import {array}from 'https://gitcdn.link/cdn/anliting/simple.js/1c1f83d1aa660bd1366b80e8736d7dfefab7e99b/src/simple.static.js'
import applyKeyEventToPressedKeys from './applyKeyEventToPressedKeys.js'
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
