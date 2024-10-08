import React from 'react'
import { useState } from 'react';

function Searchbar({setresult,setshowmenu,showMenu}) {
 const [input, setinput] = useState("");

 const fetchdata = (value)=>{


	fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete?q=${value}&region=IN`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'e76dbecff5mshb31c0d084ee300fp193f62jsncc56175d94d4',
		'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
        }
      }).then((response) => response.json()).then((json)=>{
        console.log(json);
        setresult(json.quotes)
      })
      

 }
 const handleSearch =(value)=>{
    setinput(value);
    fetchdata(value);
 }
 const handleMenuToggle = () => {
  setshowmenu(!showMenu);
};
const handleClear = () => {
  setshowmenu(false)
  setinput("")
}
 
 

  return (
    <div className=''>
    <input className='m-1 bg-neutral-100 p-2 rounded-md" type="text" placeholder="search' type="text" placeholder="Search" onFocus={handleMenuToggle} value={input} onChange={(e) =>{ handleSearch(e.target.value);
      } } />
      <button onClick={handleClear} className=' font-bold text-1xl mr-5' >X</button>
</div>
  )
}

export default Searchbar