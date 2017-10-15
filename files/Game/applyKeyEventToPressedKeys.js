export default(ke,pk)=>{
    if(ke.type=='keydown')
        pk[ke.key]=1
    else if(ke.type=='keyup'&&ke.key in pk)
        delete pk[ke.key]
}
