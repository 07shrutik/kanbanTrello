import React, { useEffect, useState } from "react";
// import { DateTime } from "luxon";
import comments from "./Comments.module.css";
import { useRecoilState } from "recoil";
import {
  storess,
  srcState,
  desState,
  ListId,
  srcDragIdState,
  desDragIdState,
} from "../../atom/Atom";

export default function Comments({ cardName }) {
  // const timestamp = DateTime.now().toRelative();
  let timestamp = new Date().toLocaleTimeString();
  let dateStamp = new Date().toLocaleDateString();
  let combineTime = timestamp + " " + dateStamp;
  // let times = String(timestamp)

  console.log("time", timestamp);
  const [list, setList] = useRecoilState(storess);
  const [sourceState, setSourceState] = useRecoilState(srcState);
  const [destinationState, setDestinationState] = useRecoilState(desState);
  const [draggableIdSource, setDraggableIdSource] =
    useRecoilState(srcDragIdState);
  const [draggableIdDestination, setDraggableIdDestination] =
    useRecoilState(desDragIdState);

  const [listid, setListid] = useRecoilState(ListId);

  const [names, setNames] = useState(""); // Move the declaration here

  return (
    <>
      {/* <div>
      <span className={comments.username}>PR</span>
      <span className={comments.comments}>PR added this card to {cardName}</span>
      <p className={comments.commentsTime}>{timestamp} ago</p>
    </div> */}

      <div></div>
    </>
  );
}
