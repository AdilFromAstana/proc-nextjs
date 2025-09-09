// AssignmentActionsComponent.tsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserShield,
  faExclamationCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

interface AssignmentAction {
  id: string;
  assignment_id: string;
  student_id?: string;
  action_type: string;
  description?: string;
  screenshot?: string;
  is_warning: boolean;
  is_archived?: boolean;
  created_at: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    getFullName?: () => string;
  };
  initiator_id?: string;
  diff?: number;
  getTime: () => string;
  getDiffTime?: () => string;
  getDiffTermType?: () => string;
}

interface AssignmentModel {
  id: string;
  [key: string]: any;
}

interface StudentModel {
  id: string;
  [key: string]: any;
}

interface AssignmentAttemptModel {
  id: string;
  [key: string]: any;
}

interface Props {
  apiUrl?: string;
  assignment: AssignmentModel;
  student?: StudentModel;
  attempt?: AssignmentAttemptModel;
  list?: any;
  clickable?: boolean;
  fetching?: boolean;
  live?: boolean;
  refreshing?: boolean;
  interval?: number;
  portion?: number;
  onSelected?: (action: AssignmentAction) => void;
}

const AssignmentActionsComponent: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const actionListRef = useRef<HTMLDivElement>(null);

  // State как data в Vue
  const [types] = useState(() => ({
    fetch: () => Promise.resolve(),
    getName: (type: string) => type,
  }));

  const [actions, setActions] = useState(
    () =>
      props.list || {
        models: [],
        length: 0,
        assignment_id: undefined,
        isLastPage: () => true,
        page: (pageNum: number, reset: boolean) => actions,
        fetch: async (params: any) => actions,
        push: (action: any) => {
          actions.models.push(action);
          actions.length = actions.models.length;
        },
        diff: () => actions.models,
      }
  );

  const [limit] = useState(props.portion || 10);
  const [page, setPage] = useState(1);
  const [syncInterval, setSyncInterval] = useState<NodeJS.Timeout | null>(null);
  const [assignmentSubscription, setAssignmentSubscription] =
    useState<any>(null);

  // Computed properties
  const actionsApiParams = {
    page: page,
    limit: limit,
    orderBy: "desc" as const,
    ...(props.student && { context: props.student.id }),
    ...(props.attempt && { assignment_attempt_id: props.attempt.id }),
  };

  const assignmentChannelName = `$private:assignment-actions.${props.assignment.id}`;

  const canShowPreviousActions =
    actions.isLastPage?.() === false &&
    actions.length > 0 &&
    actions.length >= limit;

  // Methods
  const scrollToBottom = () => {
    if (actionListRef.current) {
      actionListRef.current.scrollTop = actionListRef.current.scrollHeight;
    }
  };

  const fetchActions = async () => {
    try {
      const fetchParams: any = {
        headers: {
          "X-Requested-Fields": [
            "id",
            "assignment_id",
            "student_id",
            "action_type",
            "description",
            "screenshot",
            "is_warning",
            "created_at",
            "user:id",
            "user:firstname",
            "user:lastname",
          ].join(","),
        },
        params: actionsApiParams,
      };

      // @ts-ignore
      actions.assignment_id = props.assignment.id;

      if (props.apiUrl) {
        fetchParams.url = props.apiUrl;
      }

      // @ts-ignore
      return await actions.page(page, true).fetch(fetchParams);
    } catch (error) {
      console.error("Failed to fetch actions:", error);
    }
  };

  const onActionReceived = (actionData: any) => {
    if (actions.length > 100) {
      actions.models.splice(1, 50);
    }

    actions.push(actionData);

    setTimeout(scrollToBottom, 500);
  };

  const subscribeToChannel = () => {
    // Реализация подписки на centrifuge
    if (typeof window !== "undefined" && (window as any).$centrifuge) {
      // @ts-ignore
      const subscription = (window as any).$centrifuge.subscribe(
        assignmentChannelName,
        (message: any) => {
          const data = message.data;
          if (data.event === "AssignmentActionCreated") {
            onActionReceived(data);
          }
        }
      );
      setAssignmentSubscription(subscription);
    }
  };

  const unsubscribeFromChannel = () => {
    if (assignmentSubscription) {
      assignmentSubscription.unsubscribe();
      assignmentSubscription.removeAllListeners();
      setAssignmentSubscription(null);
    }
  };

  const showPreviousActions = () => {
    setPage((prev) => prev + 1);
    fetchActions();
  };

  const onActionSelected = (action: AssignmentAction) => {
    props.onSelected?.(action);
  };

  // Lifecycle - mounted и beforeDestroy
  useEffect(() => {
    // Инициализация
    types.fetch();

    const initialize = async () => {
      if (props.fetching !== false) {
        await fetchActions();
        setTimeout(scrollToBottom, 500);
      }

      if (props.live) {
        subscribeToChannel();
      }

      if (props.refreshing !== false) {
        if ((props.interval || 20000) > 0) {
          const intervalId = setInterval(() => {
            fetchActions();
            setTimeout(scrollToBottom, 500);
          }, props.interval || 20000);
          setSyncInterval(intervalId);
        }
      }
    };

    initialize();

    // Cleanup - beforeDestroy
    return () => {
      if (props.live) {
        unsubscribeFromChannel();
      }
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, []);

  // Render
  return (
    <div className="assignment-actions-component">
      {canShowPreviousActions && (
        <div
          className="show-previous-actions-btn"
          onClick={(e) => {
            e.preventDefault();
            showPreviousActions();
          }}
        >
          {t("btn-assignment-show-previous-actions")}
        </div>
      )}

      {actions.length > 0 ? (
        <div className="assignment-action-list" ref={actionListRef}>
          {(actions.diff?.() || actions.models).map(
            (action: AssignmentAction, index: number) => (
              <div
                key={index}
                className={`assignment-action-item ${
                  props.clickable ? "clickable" : ""
                } ${action.is_archived ? "is-archived" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (props.clickable) {
                    onActionSelected(action);
                  }
                }}
              >
                <div className="action-item-time">
                  <span>{action.getTime()}</span>
                </div>

                {!props.student && (
                  <div className="action-item-user">
                    {action.user.getFullName?.() ||
                      `${action.user.firstname} ${action.user.lastname}`}
                  </div>
                )}

                <div className="action-item-action">
                  <div className="action-icon">
                    {action.initiator_id ? (
                      <FontAwesomeIcon icon={faUserShield} />
                    ) : action.is_warning ? (
                      <FontAwesomeIcon icon={faExclamationCircle} />
                    ) : (
                      <FontAwesomeIcon icon={faInfoCircle} />
                    )}
                  </div>

                  <div className="action-action">
                    <span>
                      {types.getName(action.action_type) || action.action_type}
                    </span>
                    {action.description && <span>{action.description}</span>}
                  </div>

                  {action.diff &&
                    action.getDiffTime &&
                    action.getDiffTermType && (
                      <div className="action-diff">
                        <span>
                          {t("label-after-time")} {action.getDiffTime()}
                        </span>
                        <span>
                          {t(`label-${action.getDiffTermType()}-min`)}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="assignment-empty-action-list">
          {t("label-empty-action-list")}
        </div>
      )}

      <style jsx>{`
        .assignment-actions-component {
          position: relative;
        }

        .assignment-action-list {
          width: 100%;
          max-height: 300px;
          overflow: auto;
        }

        .assignment-action-item {
          width: inherit;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: flex-start;
          align-items: center;
          padding: 8px 8px;
        }

        .assignment-action-item:nth-child(even) {
          background-color: #fefefe;
        }

        .assignment-action-item:nth-child(odd) {
          background-color: #f5f5f5;
        }

        .assignment-action-item.clickable {
          cursor: pointer;
        }

        .assignment-action-item.clickable:hover {
          background-color: #f0f0f0;
        }

        .assignment-action-item.is-archived {
          opacity: 0.1;
        }

        .action-item-time {
          align-self: stretch;
          max-width: 100px;
          min-width: 100px;
          color: #333;
          font-size: 0.7rem;
          font-weight: 500;
          line-height: 14px;
          text-align: center;
          position: relative;
          padding: 6px;
          margin-top: -8px;
          margin-bottom: -8px;
          margin-left: -8px;
          background-color: rgba(150, 150, 150, 0.1);
        }

        .action-item-time > span {
          width: 100%;
          display: block;
          transform: translateY(-50%);
          position: relative;
          top: 50%;
          left: 0;
        }

        .action-item-user {
          max-width: 100px;
          min-width: 100px;
          color: #333;
          font-size: 0.8rem;
          font-weight: 600;
          line-height: 16px;
          text-align: center;
          margin-left: 10px;
        }

        .action-item-action {
          color: #111;
          font-size: 0.8rem;
          font-weight: 400;
          margin-left: 10px;
          white-space: nowrap;
        }

        .action-icon,
        .action-action,
        .action-diff {
          display: inline-block;
          vertical-align: middle;
        }

        .action-action {
          margin-left: 10px;
        }

        .action-diff {
          color: #aaa;
          font-weight: 400;
          margin-left: 5px;
        }

        .action-diff:before {
          content: "•";
          display: inline-block;
          vertical-align: middle;
          margin-top: 1px;
          margin-right: 5px;
        }

        .action-icon {
          width: 20px;
          text-align: center;
        }

        .fa-exclamation-circle {
          color: #fcba03;
        }

        .fa-user-shield {
          color: #1a73e8;
        }

        .fa-info-circle {
          color: #eee;
        }

        .assignment-empty-action-list {
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          padding: 20px;
          text-align: center;
          background-color: rgba(0, 0, 0, 0.2);
        }

        .show-previous-actions-btn {
          cursor: pointer;
          width: auto;
          color: #333;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 10px 10px 8px 10px;
          background-color: #fff;
          box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2);
          border-radius: 0px 0px 3px 3px;
          white-space: nowrap;
          display: inline-block;
          transform: translateX(-50%);
          position: absolute;
          top: 0;
          left: 50%;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

export default AssignmentActionsComponent;
