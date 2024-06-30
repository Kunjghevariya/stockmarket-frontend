import React from 'react'
import Search from './search'


const Serchs = ({results, setsybl}) => {
  
    
  return (
    <div className="searchs rounded-lg absolute w-72  bg-white text-black overflow-scroll z-10">
      
        {results.map((result, id) => (
    
        <Search  result={result} key={id} setsybl={setsybl} />
      ))}

    </div>
  )
}

export default Serchs