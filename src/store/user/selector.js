export const getSecondChildrenList = listArr => {
    let orgList = listArr
    // orgList = JSON.parse(orgList)
    // console.log(orgList,'selector')
    let secondList = []
    orgList.map(item => {
        if(item.children){
            item.children.map(lItem =>{
                secondList.push(lItem)
            })
        }
    })
    return secondList
}


export const getLimitList = (arrList,startNum,endNum) => {
    let limitArr = arrList.filter( item =>{
        // console.log(item)
        return (item.power_id < endNum) && (item.power_id > startNum)
    })

    return limitArr
}


export const reTreeNode = (arr,id) => {
    let treeNode = [];

    // console.log(this,reTreeNode,'selector')
    arr.map( item =>{//遍历出子节点
        if(item.parent_id === id) {
            treeNode.push(item)
        }
    })
        
    treeNode.map(tItem =>{
        let treeChildren = reTreeNode(arr,tItem.power_id)
        // console.log(treeChildren)
        if(treeChildren.length > 0) {//如果向下遍历有children便将它
            tItem.children = treeChildren
        }
    })

    return treeNode;
}