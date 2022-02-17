import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { mvmain } from "../../../mv/mvmain";
import "./MetaVerse.scss";

function Metaverse() {
  const [size, setSize] = useState({width:window.innerWidth, height:window.innerHeight});
  const listener = () => {
    setTimeout(() => {
      setSize({width:window.innerWidth, height:window.innerHeight});
    }, 200);
  };
  window.addEventListener("resize", listener);
  const a = useRef(null);
  const b = useRef(null);
  useEffect(() => {
    if (!a.current || !b.current) return;
    const game: Phaser.Game = mvmain(a.current, b.current);
    return () => {
      game.destroy(true);
      window.removeEventListener("resize", listener);
    };
  }, []);
  const {width, height} = size
  return (
    <div>
      <Link to="/home">HOME</Link> Metaverse
      <div className="mv-container" ref={a} style={{ width, height }}>
        <canvas ref={b} />
      </div>
    </div>
  );
}

export default Metaverse;
