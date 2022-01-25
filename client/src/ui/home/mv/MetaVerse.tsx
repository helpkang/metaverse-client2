import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { mvmain } from "../../../mv/root/mvmain";
import "./MetaVerse.scss";

function Metaverse() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  });
  const a = useRef(null);
  const b = useRef(null);
  useEffect(() => {
    if (!a.current||!b.current) return;
    const game: Phaser.Game = mvmain(a.current, b.current);

    return () => {
      game.destroy(true);
    };
  }, []);
  return (
    <div>
      <Link to="/">Other</Link> Metaverse
      <div className="mv-container" ref={a} style={{width,height}}>
        <canvas ref={b}/>
      </div>
    </div>
  );
}

export default Metaverse;
