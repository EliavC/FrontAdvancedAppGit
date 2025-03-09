import PostsList from "./PostsList"
import { useState } from 'react';
function App() {
  const [index1, setIndex1] = useState(-1)
  const [index2, setIndex2] = useState(-1)
  const items1 = ['item1', 'item2', 'item3']
  const items2 = ['item4', 'item5', 'item6']


  return (
    <div>
    
      <PostsList title= "My ITEMS 1" items={items1} onItemSelected={
        (index)=>{
          setIndex1(index);
          console.log("selected item" + index)
        }
      }/>
      {index1 != -1 && <p> item : {index1} was selected</p>}
     
      <PostsList title= "My ITEMS 2" items={items2} onItemSelected={
        (index)=>{
          setIndex2(index)
          console.log("selected item" + index)
        }
      }/>
      {index2 != -1 && <p> item : {index2} was selected</p>}
      
    </div>
  )
  
}

export default App;

