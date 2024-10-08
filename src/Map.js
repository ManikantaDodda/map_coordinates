import React, { useState } from 'react';
import App from './App';
function Map() {
    const [currentCordinate, setCurrentCordinates] = useState([-36.802237, 12.913736]);
    const [value, setValue] = useState();
    const handleSubmit = () => {
        if(value)
        {
            let arr = value.split(',');
            if(arr.length === 2)
            {
               setCurrentCordinates(arr);
            }
            else{
                alert("It must be comma separated two coordinates such as 23, -22 ")
            }
        }
        else{
            alert("It must be comma separated two coordinates such as 23, -22 ")
        }
    }
    return (
        <div>
          <label>Enter Current Cordinates</label>
          <input className='input-box' placeholder='Comma separated 23, -45' type='text' onChange={(e)=>setValue(e.target.value)}/>
          <input className='input-box' onClick={handleSubmit} type='submit'/>
          <App currentLoc={currentCordinate}/>
        </div>
    );
}

export default Map;