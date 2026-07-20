import { useContext } from "react";
import { UserContext } from "../Entry/Titus";


export default function Sample() {
  const {count} = useContext(UserContext);
  const {setCount} = useContext(UserContext);
  console.log(count)
  const hanldeCount =()=>{
    setCount(count + 1)
  }
  return(
    <>
    <button onClick={()=>setCount(count + 1)}>asd</button>
    </>
  )
}

