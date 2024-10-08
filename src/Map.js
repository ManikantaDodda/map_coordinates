import React, { useEffect, useState } from 'react';
import App from './App';
function Map() {
    const [currentCordinate, setCurrentCordinates] = useState([-36.802237, 12.913736]);
    const [value, setValue] = useState();
    const [index, setIndex] = useState(5);
    const EndCoordinates = [40.7128, -74.0060];
    const middleCordinates = [-6.784086, -30.615036];
    const InitialCurrentCoordinates = [-36.802237, 12.913736];

    const interpolate = (start, end, t) => {
        const lat = start[0] + (end[0] - start[0]) * t;
        const lng = start[1] + (end[1] - start[1]) * t;
        return [lat, lng];
      };

  useEffect(() => {
    if(value)
    {
    let t = 0;
    const interval = setInterval(() => {
      if (t < 1) {
        const newCoordinates = interpolate(InitialCurrentCoordinates, EndCoordinates, t);
        setCurrentCordinates(newCoordinates);
        setIndex((pre)=> pre +1);
        t += 0.01;
      } else {
        clearInterval(interval); 
      }
    }, 200);
    
    return () => clearInterval(interval);
}
  }, [value]);
    function isValidNumber(value) {
        return typeof parseFloat(value) === 'number' && !isNaN(value);
    }
    const handleSubmit = () => {
        if(value)
        {
            let arr = value.split(',');
            if(arr.length === 2)
            {
               if(isValidNumber(arr[0]) && isValidNumber(arr[1]))
               {
               setCurrentCordinates(arr);
               setIndex(index + 1);
               }
               else{
                alert("It must be valid Numbers ")
            }
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
          <App currentLoc={currentCordinate} index={index}/>
        </div>
    );
}

export default Map;