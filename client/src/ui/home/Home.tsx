import React from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

function Home() {
  return (
   <div>
     HOME <Link to='/mv'>Metaverse</Link> 
   </div>
  );
}

export default Home;
