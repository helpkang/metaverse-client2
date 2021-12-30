import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { mvmain } from '../../../mv/mvmain';
import './MetaVerse.scss';

function Metaverse() {
    const a = useRef(null);
    useEffect(() => {
        console.log('Metaverse');
        if(!a.current) return
        const game:Phaser.Game = mvmain(a.current)

        return ()=>{
          game.destroy(true)
        }
    }, []);
  return (
   <div>
     <Link to='/'>home</Link> Metaverse
     <div ref={a}/>
   </div>
  );
}

export default Metaverse;
