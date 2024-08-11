import React, { useState, useEffect } from 'react';
import axios from "axios";
 
function App() {
  const [item, setItem] = useState(null);
  useEffect(() => {
    axios.get('http://localhost:8000/items/1?q=test')
      .then(response => setItem(response.data));
  }, []);
 
  return (
    <div className="App">
      <header className="App-header">
        <h1>Item Data</h1>
        {console.log(item)}
        {item && <p>{`Item ID: ${item.item_id}, Query: ${item.q}`}</p>}
      </header>
    </div>
  );
}
 
export default App;
