import React, { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import styles from "./Board.module.css";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import Card from "../card/Card";
import { useRecoilState } from "recoil";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  storess,
  srcState,
  desState,
  srcDragIdState,
  desDragIdState,
} from "../../atom/Atom";

function Board() {
  const [sourceState, setSourceState] = useRecoilState(srcState);
  const [destinationState, setDestinationState] = useRecoilState(desState);
  const [draggableIdSource, setDraggableIdSource] =
    useRecoilState(srcDragIdState);
  const [draggableIdDestination, setDraggableIdDestination] =
    useRecoilState(desDragIdState);

  const [stores, setStores] = useRecoilState(storess);
  const [isShow, setisShow] = useState(false);
  const [isShowBtn, setisShowBtn] = useState(true);
  const [inputvalue, setinputvalue] = useState("");
  const [names, setNames] = useState("");
  useEffect(() => {
    stores.map((item) => {
      if (item.id == sourceState) {
        setNames(item.name);
      }
    });
  }, [sourceState]);

  useEffect(() => {
    let newList = stores.map((item) => {
      if (item.id === destinationState) {
        let newTasklist = item.items.map((obj) => {
          if (obj.id === draggableIdSource && names) {
            return { ...obj, activity: [...obj.activity, names] };
          } else {
            return obj;
          }
        });
        return { ...item, items: newTasklist };
      } else {
        return item;
      }
    });
    setStores(newList);
    localStorage.setItem("List", JSON.stringify(newList));
  }, [names]);

  const handleDragAndDrop = (results) => {
    console.log("res", results);
    const { source, destination, type } = results;
    setDraggableIdSource(results.draggableId);
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "group") {
      const reorderedStores = [...stores];

      const storeSourceIndex = source.index;
      const storeDestinatonIndex = destination.index;

      const [removedStore] = reorderedStores.splice(storeSourceIndex, 1);
      reorderedStores.splice(storeDestinatonIndex, 0, removedStore);
      localStorage.setItem("List", JSON.stringify(reorderedStores));

      return setStores(reorderedStores);
    }
    const itemSourceIndex = source.index;
    const itemDestinationIndex = destination.index;
    setSourceState(source.droppableId);
    setDestinationState(destination.droppableId);

    //from which last task has been picked
    const storeSourceIndex = stores.findIndex(
      (store) => store.id === source.droppableId
    );
    //where user is dropping that particular task
    const storeDestinationIndex = stores.findIndex(
      (store) => store.id === destination.droppableId
    );

    const newSourceItems = [...stores[storeSourceIndex].items];
    const newDestinationItems =
      source.droppableId !== destination.droppableId
        ? [...stores[storeDestinationIndex].items] //same list just posiiton changed
        : newSourceItems; //new list

    const [deletedItem] = newSourceItems.splice(itemSourceIndex, 1);
    newDestinationItems.splice(itemDestinationIndex, 0, deletedItem);

    const newStores = [...stores];

    newStores[storeSourceIndex] = {
      ...stores[storeSourceIndex],
      items: newSourceItems, // is removed or position cahnge of task
    };
    newStores[storeDestinationIndex] = {
      ...stores[storeDestinationIndex],
      items: newDestinationItems, // new added task
    };

    setStores(newStores);
    localStorage.setItem("List", JSON.stringify(newStores));
  };

  function handleChange(e) {
    setinputvalue(e.target.value);
  }

  function handleTaskAdd() {
    if (inputvalue.length === 0) {
      input.focus();
    } else if (inputvalue.length > 0) {
      let newlist = { name: inputvalue, id: uuidv4(), items: [] };
      setStores((prev) => [...prev, newlist]);
      localStorage.setItem("List", JSON.stringify([...stores, newlist]));

      setinputvalue("");
      console.log(stores);
    }
  }

  function handleClick() {
    setisShow(true);
    setisShowBtn(false);
  }

  function handleBtnDisplay() {
    setisShowBtn(true);
    setisShow(false);
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.wrappercontainer}>
        <DragDropContext onDragEnd={handleDragAndDrop}>
          {/* droppableId is static because we r droping a list in a parent container */}
          <Droppable droppableId="ROOT" type="group">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={styles.container}
              >
                {stores.map((store, index) => (
                  <Draggable
                    draggableId={store.id}
                    index={index}
                    key={store.id}
                  >
                    {(provided) => (
                      <div
                        className={styles.card}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <Card {...store} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {isShowBtn && (
            <Button
              variant="outlined"
              onClick={handleClick}
              startIcon={<AddSharpIcon />}
              className={styles.btn}
              sx={{
                border: "none",
                backgroundColor: "#e7e9ea4a",
                borderRadius: "10px",
                color: "white",
                width: "22rem",
                height: "2.5rem",
                marginLeft: "10px",
                "&:hover": {
                  backgroundColor: "#ffffff26",
                  border: "none",
                },
              }}
            >
              Add Another List
            </Button>
          )}
          {isShow && (
            <div className={styles.taskAdd}>
              <input
                type="text"
                id="input"
                onChange={handleChange}
                value={inputvalue}
              />
              <div className={styles.taskAddBtn}>
                <Button
                  onClick={handleTaskAdd}
                  variant="contained"
                  size="small"
                  startIcon={<AddSharpIcon />}
                >
                  Add Card
                </Button>
                <IconButton onClick={handleBtnDisplay}>
                  <CloseSharpIcon />
                </IconButton>
              </div>
            </div>
          )}
        </DragDropContext>
      </div>
    </div>
  );
}

export default Board;
