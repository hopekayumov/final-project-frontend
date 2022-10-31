import Dropdown from "react-bootstrap/Dropdown";
import axios from "../../plugins/axios";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faStar } from "@fortawesome/free-solid-svg-icons";

export default function UserControls(props) {
  const { t } = useTranslation();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  function refresh() {
    props.onReload();
  }
  async function toggleStatus(status) {
    props.onStatusLoaderOn();
    await axios
      .put(`user/${props.user._id}/change-status`, { role: status })
      .then(() => {
        refresh();
        props.onStatusLoaderOff();
        window.location.reload();
      });
    const user = await axios.get(
      `user/${localStorage.getItem("currentUser").username}`
    );
    localStorage.setItem("user", JSON.stringify(user.data));

    // window.location.reload();
  }

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="success"
        id="dropdown-basic"
        className="dropdown__toggle mb-3 flex-end"
      >
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Dropdown.Item href={`/user/edit/${props.user._id}`}>
          {t("edit-user")}
        </Dropdown.Item> */}
        {currentUser.role === "admin" && props.user.role === "user" && (
          <Dropdown.Item
            onClick={() => {
              toggleStatus("admin");
            }}
          >
            {t("make-admin")} <FontAwesomeIcon icon={faStar} />
          </Dropdown.Item>
        )}
        {currentUser.role === "admin" && props.user.role === "admin" && (
          <Dropdown.Item
            onClick={() => {
              toggleStatus("user");
            }}
          >
            {t("remove-admin")}
            <FontAwesomeIcon icon={faStar} />
          </Dropdown.Item>
        )}

        <Dropdown.Item className="delete-control">
          {t("delete-user")}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
