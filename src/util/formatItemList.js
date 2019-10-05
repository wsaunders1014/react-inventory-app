/* USED TO FORMAT ORIGINAL items-list.json INTO A MORE SEMANTIC OBJECT SO I CAN
DEAL WITH ONLY THE CATEGORY NEEDED AND NOT ITERATE THROUGH A 1000 ITEMS */

function formatItemList(ItemList){
  let newObj = {}
   for (let key in ItemList){

     let category = ItemList[key].category;

     //CHECK if OBJECT HAS CATEGORY PROPERTY
     if(category in newObj){
        //CREATED

     }else{
       //HASN"T BEEN CREATED YET

       newObj[category]={}
     }

     //CHECK IF OBJECT HAS sub_category
     if(ItemList[key].sub_category !=""){
        let subcategory = ItemList[key].sub_category;
        if(subcategory in newObj[category]){

        }else{
          newObj[category][subcategory]={}
        }
        newObj[category][subcategory][ItemList[key].item_name] = {
          id: ItemList[key].item_id,
          name: ItemList[key].item_name,
          size: ItemList[key].size,
          hasChildren: ItemList[key].hasChildren,
          isChild: ItemList[key].isChild,
          cf:ItemList[key].cf,
          lbs:ItemList[key].lbs,
          image:ItemList[key].image
        };
     }else{
       newObj[category][ItemList[key].item_name]={
         id: ItemList[key].item_id,
         name: ItemList[key].item_name,
         size: ItemList[key].size,
         hasChildren: ItemList[key].hasChildren,
         isChild: ItemList[key].isChild,
         cf:ItemList[key].cf,
         lbs:ItemList[key].lbs,
         image:ItemList[key].image
       };
     }
   }
 return newObj
}
export formatItemList;
