import BaseCard from "../UI/BaseCard";
// import Loader from "../UI/Loader";
import axios from "../../plugins/axios";
import "./Item.modules.css";
import { useState } from "react";
import ItemControls from "./ItemControls";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPaperPlane,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
// import { faComment } from "@fortawesome/free-solid-svg-icons";

// import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

// import Backdrop from "./UI/Backdrop";
import Modal from "../UI/Modal";
import { useEffect } from "react";

export default function Item(props) {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const noImage =
    "https://media.istockphoto.com/vectors/no-image-available-picture-coming-soon-missing-photo-image-vector-id1379257950?b=1&k=20&m=1379257950&s=170667a&w=0&h=RyBlzT5Jt2U87CNkopCku3Use3c_3bsKS3yj6InGx1I=";

  function chechIfLiked() {
    const liked = props.item.likes.find((like) => {
      return like === currentUser.username;
    });
    if (liked) {
      setLiked(true);
    }
  }
  function likeItem() {
    setLikeLoading(true);
    props.like();
    props.refresh();
    setLiked(true);
    setLikeLoading(false);
  }
  function unlikeItem() {
    setLikeLoading(true);
    props.unlike();
    props.refresh();
    setLiked(false);
    setLikeLoading(false);
  }
  const sendComment = async () => {
    setCommentLoading(true);
    const comment = {
      commentID: v4(),
      username: currentUser.username,
      comment: commentInput,
    };
    if (commentInput.trim() !== "") {
      await axios.put(`item/comment/${props.item._id}`, comment).then(() => {
        setCommentLoading(false);
        setCommentInput("");
        props.refresh();
      });
    } else {
      setCommentLoading(false);
      alert("Comment cannot be empty");
      return false;
    }
    setCommentLoading(false);
  };
  const getDate = (date) => {
    const date1 = new Date(date);
    return new Intl.DateTimeFormat().format(date1);
  };
  useEffect(() => {
    chechIfLiked();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <BaseCard className="card">
        <div className="item">
          <div className="flexcontainer">
            <div className="flexcontainer">
              <div className="image">
                {props.item.image === "" ? (
                  <img src={noImage} alt="" />
                ) : (
                  <img
                    src={`https://firebasestorage.googleapis.com/v0/b/itransition-4defc.appspot.com/o/images%2F${props.item.image}?alt=media`}
                    alt={props.item.image}
                  />
                )}
              </div>
              <div>
                <h3>{props.item.name}</h3>
                <Link
                  className="italic username"
                  to={`/user/${props.item.username}`}
                >
                  @{props.item.username}
                </Link>
                <p>
                  {t("i-description")}:{" "}
                  {props.item.description.trim() === ""
                    ? t("i-no-description")
                    : props.item.description}
                </p>
                {props.item.price && (
                  <p>
                    {t("i-price")}: ${props.item.price}
                  </p>
                )}
                {props.item.year && (
                  <p>
                    {t("i-year")}: {props.item.year}
                  </p>
                )}
                {props.item.from && (
                  <p>
                    {t("i-from")}: {props.item.from}
                  </p>
                )}
                {props.item.link && (
                  <p>
                    {t("i-link")}:{" "}
                    <a href={props.item.link}>{props.item.link}</a>
                  </p>
                )}

                <div className="tags">
                  {props.item.tags.map((tag) => {
                    return (
                      <Link className="tag" key={tag.id} to={`/tag/${tag.tag}`}>
                        {tag.tag}
                      </Link>
                    );
                  })}
                </div>
                <div className="likes">
                  <div className="like mt-1">
                    {liked && !likeLoading ? (
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="heart-icon"
                        onClick={unlikeItem}
                      />
                    ) : null}
                    {!liked && !likeLoading ? (
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="heart-icon-cracked"
                        onClick={likeItem}
                      />
                    ) : null}
                    {likeLoading ? (
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">...</span>
                      </div>
                    ) : null}
                  </div>
                  <div className="liked-by">
                    {props.item.likes.length !== 0 ? (
                      <div>
                        <span>
                          {t("i-liked-by")}{" "}
                          <strong>
                            <Link to="/">{props.item.likes[0]}</Link>
                          </strong>
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <span
                    className="btn-liked-usernames"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    {props.item.likes.length > 1 ? (
                      <span className="underline">
                        {" "}
                        and other {props.item.likes.length - 1} users
                      </span>
                    ) : null}
                  </span>
                  <Modal title="Likes">
                    <ul className="list-group">
                      {props.item.likes.map((username) => {
                        return (
                          <li
                            className="list-group-item"
                            key={v4()}
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                          >
                            <Link to={`/user/${username}`}>{username}</Link>
                          </li>
                        );
                      })}
                    </ul>
                  </Modal>
                </div>
              </div>
            </div>
            <div className="control">
              {props.item.username === currentUser.username ||
              currentUser.role === "admin" ? (
                <ItemControls className="item-control" item={props.item} />
              ) : null}
            </div>
          </div>

          {commentLoading ? (
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{t("user-loading")}</span>
            </div>
          ) : (
            <div>
              <div className="form-item">
                <div className="d-flex justify-content-between">
                  <input
                    className="form-control input-inline input p-2"
                    type="text"
                    placeholder={t("i-type-comment")}
                    onChange={(e) => {
                      setCommentInput(e.target.value);
                    }}
                  />
                  <button
                    className="btn btn-danger btn-inline p-2"
                    onClick={sendComment}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="form-item">
            <br />
            {props.item.comments.length !== 0 ? (
              <p className="dt">{t("i-comments")}</p>
            ) : (
              <p className="dt">{t("i-no-comments")}.</p>
            )}
            <ul className="list-group">
              {props.item.comments.map((comment) => {
                return (
                  <li className="list-group-item" key={comment.commentID}>
                    <div className="comment">
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon
                          icon={faComment}
                          className="p-2 badge bg-primary text-wrap"
                        />
                        <Link to={`/user/${comment.username}`} className="p-2">
                          @{comment.username}
                        </Link>
                        <span className="ms-auto p-2">
                          {getDate(comment.date)}
                        </span>
                      </div>
                      <p className="p-2">{comment.comment}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </BaseCard>
    </>
  );
}
