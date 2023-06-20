import { Draggable, Droppable } from "react-beautiful-dnd";
import AddCard from "./AddCard";
import { ListId, demo, storess, taskIndex } from "../../atom/Atom";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import style from "./Card.module.css";
import PopupState, {
  bindTrigger,
  bindPopover,
  bindDialog,
} from "material-ui-popup-state";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import MoreHorizSharpIcon from "@mui/icons-material/MoreHorizSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Popover } from "@mui/material";
import { useState } from "react";

export default function Card({ name, items, id }) {
  const [List, setList] = useRecoilState(storess);
  const [task, settask] = useRecoilState(demo);
  const [tindex, settindex] = useRecoilState(taskIndex);
  const [lid, setlid] = useRecoilState(ListId);
  const [isEditVisible, setIsEditVisible] = useState("");

  const navigate = useNavigate();

  const handleShowEdit = (Index) => {
    setIsEditVisible(Index);
  };
  const handleHideEdit = (index) => {
    setIsEditVisible(-1);
  };

  function taskClick(taskname, index) {
    settask(taskname);
    settindex(index);
    setlid(id);
    navigate(`/popup/${id}/${index}`);
  }

  function handleListdelete(id) {
    let FilteredList = List.filter((obj) => id !== obj.id);
    localStorage.setItem("List", JSON.stringify(FilteredList));
    setList(FilteredList);
  }
  function handleDeleteCard(index) {
    let newList = List.map((item) => {
      if (item.id === id) {
        let updatedItem = { ...item };
        updatedItem.items = updatedItem.items.filter((_, id) => index !== id);

        return updatedItem;
      }
      return item;
    });
    setList(newList);
    localStorage.setItem("List", JSON.stringify(newList));
  }

  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div
          className={style.addCard}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <div className={style.card}>
            {/* Listname is printed here */}
            <h1 style={{ color: "grey" }}>{name}</h1>
            <PopupState variant="popover" popupId="demo-popup-popover">
              {(popupState) => (
                <div>
                  <IconButton variant="contained" {...bindTrigger(popupState)}>
                    <MoreHorizSharpIcon />
                  </IconButton>
                  <Popover
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <IconButton onClick={() => handleListdelete(id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Popover>
                </div>
              )}
            </PopupState>
          </div>
          <div className="items-container">
            <div>
              <div className={style.todoTasks}>
                {items.map((item, index) => (
                  <Draggable draggableId={item.id} index={index} key={item.id}>
                    {(provided) => (
                      <div
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        onMouseOver={() => handleShowEdit(index)}
                        onMouseOut={() => handleHideEdit(index)}
                      >
                        <div className={style.Cardss}>
                          <p>{item.name}</p>
                          {isEditVisible === index ? ( //checking here
                            <div className="icon_btn">
                              <IconButton
                                onClick={() => taskClick(item, index)}
                                sx={{
                                  "&:hover": {
                                    borderRadius: "5px",
                                    backgroundColor: "whitesmoke",
                                  },
                                }}
                                aria-label="edit"
                              >
                                <EditSharpIcon fontSize="small" />
                              </IconButton>

                              <IconButton
                                onClick={() => handleDeleteCard(index)}
                                sx={{
                                  "&:hover": {
                                    borderRadius: "5px",
                                    backgroundColor: "whitesmoke",
                                  },
                                }}
                                color="error"
                                aria-label="edit"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {/* buttons and adding task */}
                <AddCard index={id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </Droppable>
  );
}
