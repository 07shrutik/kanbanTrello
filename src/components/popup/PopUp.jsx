import React, { useEffect, useState } from "react";
import popup from "./PopUp.module.css";
import Comments from "./Comments";
import { Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
  storess,
  demo,
  descriptionState,
  ListId,
  newTasknameState,
  taskIndex,
} from "../../atom/Atom";

export default function PopUp() {
  const [List, setList] = useRecoilState(storess);
  const [taskname, setTaskname] = useRecoilState(demo);
  const [tindex, setTindex] = useRecoilState(taskIndex);
  const [listid, setListid] = useRecoilState(ListId);
  const navigate = useNavigate();
  const [description, setDescription] = useRecoilState(descriptionState);
  const [newTaskname, setNewTaskname] = useRecoilState(newTasknameState);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [listName, setListName] = useState("");
  const [isEditingListName, setIsEditingListName] = useState(false);
  const [names, setNames] = useState("");
  function handleChange(e) {
    setDescription(e.target.value);
  }

  function addDescription(id) {
    let newList = List.map((item) => {
      if (item.id === listid) {
        let newTasklist = item.items.map((obj, index) => {
          if (index === id) {
            return { ...obj, description: description };
          } else {
            return obj;
          }
        });
        return { ...item, items: newTasklist };
      } else {
        return item;
      }
    });
    setList(newList);
    localStorage.setItem("List", JSON.stringify(newList));
    setDescription("");
    setIsEditingDescription(false);
  }

  function handleName(e) {
    setNewTaskname(e.target.value);
    setTaskname((prevTaskname) => ({ ...prevTaskname, name: e.target.value }));
  }

  const handleTaskname = (id) => {
    const newList = List.map((item) => {
      if (item.id === listid) {
        const newTasklist = item.items.map((obj, index) => {
          if (index === id) {
            return { ...obj, name: newTaskname || obj.name };
          }
          return obj;
        });
        return { ...item, items: newTasklist };
      }
      return item;
    });
    setList(newList);
    localStorage.setItem("List", JSON.stringify(newList));
    setIsEditingName(false);
  };

  useEffect(() => {
    const listObject = List.find((item) => item.id === listid);
    if (listObject) {
      const taskObject = listObject.items[tindex];
      setTaskname(taskObject);
      setListName(listObject.name);
    }
  }, [List, listid, tindex]);

  const handleTaskNameClick = () => {
    setIsEditingName(true);
  };

  const handleDescriptionClick = () => {
    setIsEditingDescription(true);
  };

  const handleCancelDescription = () => {
    setIsEditingDescription(false);
    setDescription("");
  };

  const handleListNameClick = () => {
    setIsEditingListName(true);
  };

  const handleUpdateListName = () => {
    if (listName.trim() !== "") {
      const newList = List.map((item) =>
        item.id === listid ? { ...item, name: listName } : item
      );
      setList(newList);
      localStorage.setItem("List", JSON.stringify(newList));
    }
    setIsEditingListName(false);
  };

  return (
    <>
      <div className={popup.mainDiv}>
        <div className={popup.title}>
          {isEditingName ? (
            <>
              <h2 className={popup.head}>
                <span className={popup.radio}>📻</span>
                <input
                  value={taskname.name}
                  onChange={handleName}
                  className={popup.tasknameInput}
                />
                <Button onClick={() => handleTaskname(tindex)}>Save</Button>
              </h2>
            </>
          ) : (
            <>
              <h2 className={popup.head} onClick={handleTaskNameClick}>
                <span className={popup.radio}>📻</span>
                <span>{taskname.name}</span>
              </h2>
            </>
          )}
          <span onClick={() => navigate("/")}>❌</span>
        </div>
        <div>
          {isEditingListName ? (
            <>
              <input
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                style={{ marginLeft: "2.7rem" }}
              />
              <Button onClick={handleUpdateListName}>Update List Name</Button>
            </>
          ) : (
            <>
              <span className={popup.para}>
                in list &nbsp;
                <span onClick={handleListNameClick}>
                  <u>{listName}</u>
                </span>
              </span>
            </>
          )}
        </div>
        <div className={popup.inputDiv}>
          {isEditingDescription ? (
            <>
              <div className={popup.des}>
                <MenuIcon sx={{ marginRight: "1rem" }} /> <h4>Description</h4>
              </div>
              <input
                className={popup.firstInputBox}
                placeholder="Add a more detailed description..."
                value={description}
                onChange={handleChange}
              />{" "}
              <br />
              <div className={popup.buttons}>
                <Button onClick={() => addDescription(tindex)}>Save</Button>
                <Button onClick={handleCancelDescription}>Cancel</Button>
              </div>
            </>
          ) : (
            <>
              <div className={popup.des}>
                <MenuIcon sx={{ marginRight: "1rem" }} /> <h4>Description</h4>
                <Button onClick={handleDescriptionClick}>Edit</Button>{" "}
              </div>
              <span style={{ display: "flex" }}>
                <p className={popup.description}>{taskname.description}</p>
              </span>
            </>
          )}
        </div>
        <div className={popup.activity}>
          <ReceiptLongIcon sx={{ marginRight: "1rem" }} /> <h4>Activity</h4>
        </div>
        <span className={popup.username}>PR</span>
        <input
          className={popup.secondInputBox}
          placeholder="Write a comment..."
        />
        <br /> <br />
        {taskname.activity.map((act) => (
          <li>
            User moved this card from {act} to {listName}
          </li>
        ))}
        {/* code to update the activity name */}
        <Comments cardName={listName} />
      </div>
    </>
  );
}
