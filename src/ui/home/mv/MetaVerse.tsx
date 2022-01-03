import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { mvmain } from "../../../mv/mvmain";
import "./MetaVerse.scss";

function Metaverse() {
  const a = useRef(null);
  useEffect(() => {
    if (!a.current) return;
    const game: Phaser.Game = mvmain(a.current);

    return () => {
      game.destroy(true);
    };
  }, []);
  return (
    <div>
      <Link to="/mv">Other</Link> Metaverse
      <div className="mv-container">
        <canvas ref={a}/>
      </div>
    </div>
  );
}

export default Metaverse;
