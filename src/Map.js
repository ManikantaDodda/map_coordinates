import React, { useEffect, useState } from 'react';
import App from './App';

function Map() {
  const [currentCordinate, setCurrentCordinates] = useState([-36.802237, 12.913736]);
  const [value, setValue] = useState('');
  const [isMovingToEnd, setIsMovingToEnd] = useState(false);
  const [isMove, setIsMove] = useState(false);

  const EndCoordinates = [40.7128, -74.0060];
  const middleCordinates = [-6.784086, -30.615036];
  const InitialCurrentCoordinates = [-36.802237, 12.913736];

  // Function to interpolate coordinates
  const interpolate = (start, end, t) => {
    const lat = start[0] + (end[0] - start[0]) * t;
    const lng = start[1] + (end[1] - start[1]) * t;
    return [lat, lng];
  };

  const moveShip = ()=>{
    setIsMove(true);
  }

  useEffect(() => {
    if (isMove) {
      let t = 0;

      const interval = setInterval(() => {
        if (t < 1) {
          const newCoordinates = isMovingToEnd
            ? interpolate(middleCordinates, EndCoordinates, t) // Middle to End
            : interpolate(InitialCurrentCoordinates, middleCordinates, t); // Initial to Middle

          setCurrentCordinates(newCoordinates);
          t += 0.01;
        } else {
          if (!isMovingToEnd) {
            setIsMovingToEnd(true);
            t = 0;
          } else {
            clearInterval(interval);
          }
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isMove, isMovingToEnd]);

  // Validation for the user-inputted coordinates
  function isValidNumber(value) {
    return typeof parseFloat(value) === 'number' && !isNaN(value);
  }

  // Handling form submission
  const handleSubmit = () => {
    if (value) {
      let arr = value.split(',');
      if (arr.length === 2) {
        if (isValidNumber(arr[0]) && isValidNumber(arr[1])) {
          setCurrentCordinates(arr);
        } else {
          alert('It must be valid numbers');
        }
      } else {
        alert('It must be comma-separated coordinates such as 23, -22');
      }
    } else {
      alert('It must be comma-separated coordinates such as 23, -22');
    }
  };

  return (
    <div>
      <label>Enter Current Coordinates</label>
      <input
        className='input-box'
        placeholder='Comma separated 23, -45'
        type='text'
        onChange={(e) => setValue(e.target.value)}
      />
      <input className='input-box' onClick={handleSubmit} disabled={isMove}  type='submit' />
      <input className='input-box' onClick={moveShip} type='button' disabled={isMove} value="Move Ship" />
      <App currentLoc={currentCordinate}/>
    </div>
  );
}

export default Map;
