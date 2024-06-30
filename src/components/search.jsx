import React from 'react';

const Search = ({ result, id,setsybl  }) => {
  

  return (
    <div onClick={() => {
      setsybl(result.symbol)
    }} className='hover:bg-slate-200' key={id}>
      <div>{result.shortname} </div>
      <div className="text-gray-700">{result.symbol}   |   {result.exchange}</div>
    </div>
  );
}

export default Search;
