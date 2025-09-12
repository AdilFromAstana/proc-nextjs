import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserShield,
  faExclamationCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

interface Action {
  id: number;
  user: { firstname: string; lastname: string };
  action_type: string;
  description?: string;
  is_warning?: boolean;
  is_archived?: boolean;
  initiator_id?: number;
  created_at: Date;
}

interface Props {
  clickable?: boolean;
  onSelected?: (action: Action) => void;
}

const AssignmentActions: React.FC<Props> = ({
  clickable = true,
  onSelected,
}) => {
  const [actions, setActions] = useState<Action[]>([
    {
      id: 1,
      user: { firstname: "Иван", lastname: "Иванов" },
      action_type: "created",
      description: "Задание создано",
      initiator_id: 1,
      created_at: new Date(),
    },
    {
      id: 2,
      user: { firstname: "Петр", lastname: "Петров" },
      action_type: "updated",
      description: "Добавлен комментарий",
      is_warning: true,
      created_at: new Date(),
    },
    {
      id: 3,
      user: { firstname: "Сидор", lastname: "Сидоров" },
      action_type: "deleted",
      description: "Удален файл",
      is_archived: true,
      created_at: new Date(),
    },
  ]);

  const actionListRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    if (actionListRef.current) {
      actionListRef.current.scrollTop = actionListRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    setTimeout(scrollToBottom, 500);
  }, [actions, scrollToBottom]);

  const canShowPreviousActions = useMemo(() => {
    return actions.length >= 10; // условие для кнопки "показать предыдущие"
  }, [actions]);

  const getActionTypeName = (type: string) => {
    switch (type) {
      case "created":
        return "Создано";
      case "updated":
        return "Обновлено";
      case "deleted":
        return "Удалено";
      default:
        return "Неизвестное действие";
    }
  };

  return (
    <div
      className="assignment-actions-component w-full"
      style={{ position: "relative" }}
    >
      {canShowPreviousActions && (
        <div
          className="show-previous-actions-btn"
          style={{
            cursor: "pointer",
            padding: "10px",
            background: "#fff",
            boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
            borderRadius: "0 0 3px 3px",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Показать предыдущие действия
        </div>
      )}

      {actions.length > 0 ? (
        <div
          className="assignment-action-list"
          ref={actionListRef}
          style={{
            width: "100%",
            maxHeight: "300px",
            overflow: "auto",
            border: "1px solid #ddd",
          }}
        >
          {actions.map((action, index) => (
            <div
              key={action.id}
              className={`assignment-action-item ${
                clickable ? "clickable" : ""
              } ${action.is_archived ? "is-archived" : ""}`}
              style={{
                display: "flex",
                padding: "8px",
                background: index % 2 === 0 ? "#FEFEFE" : "#F5F5F5",
                cursor: clickable ? "pointer" : "default",
                opacity: action.is_archived ? 0.3 : 1,
              }}
              onClick={() => onSelected?.(action)}
            >
              <div
                className="action-item-time"
                style={{
                  minWidth: "100px",
                  textAlign: "center",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  background: "rgba(150,150,150,0.1)",
                  marginRight: "10px",
                }}
              >
                <span>{action.created_at.toLocaleTimeString()}</span>
              </div>
              <div
                className="action-item-user"
                style={{
                  minWidth: "100px",
                  textAlign: "center",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  marginRight: "10px",
                }}
              >
                {action.user.firstname} {action.user.lastname}
              </div>
              <div
                className="action-item-action"
                style={{ fontSize: "0.8rem" }}
              >
                <div
                  className="action-icon"
                  style={{ display: "inline-block", width: "20px" }}
                >
                  {action.initiator_id ? (
                    <FontAwesomeIcon icon={faUserShield} color="#1a73e8" />
                  ) : action.is_warning ? (
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      color="#fcba03"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faInfoCircle} color="#999" />
                  )}
                </div>
                <div
                  className="action-action"
                  style={{ display: "inline-block", marginLeft: "10px" }}
                >
                  <span>{getActionTypeName(action.action_type)}</span>
                  {action.description && <span> — {action.description}</span>}
                </div>
                <div
                  className="action-diff"
                  style={{
                    display: "inline-block",
                    marginLeft: "10px",
                    color: "#aaa",
                  }}
                >
                  • после 5 минут
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="assignment-empty-action-list"
          style={{
            color: "#fff",
            fontSize: "1rem",
            fontWeight: 600,
            padding: "20px",
            textAlign: "center",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          Список действий пуст
        </div>
      )}
    </div>
  );
};

export default AssignmentActions;
