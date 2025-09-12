import React, { useState, useRef, useCallback } from "react";
import { Download, Upload } from "lucide-react";
import CertificateInfoComponent from "../../Certificate/CertificateInfoComponent";
import { Student } from "@/types/students";

// Локальный Toast интерфейс
interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}

interface Assignment {
  id: number;
}

interface Certificate {
  placeholders?: Array<{
    isCustomVariable: () => boolean;
    type: string;
    variable: string;
    label?: string;
  }>;
}

interface UserCertificate {
  id: number;
  is_active: number;
  certificate_number?: string;
  placeholders?: Record<string, any>;
}

interface ConfirmModalRef {
  open: (message: string) => Promise<boolean>;
}

interface ButtonRef {
  showLoader: () => void;
  hideLoader: () => void;
}

interface AssignmentStudentCertificateComponentProps {
  assignment?: Assignment;
  certificate?: Certificate;
  userCertificate?: UserCertificate | null;
  student?: Student;
  allow?: boolean;
  onIssued?: () => void;
  onRevoked?: () => void;
}

const mock = {
  assignment: {
    id: 126,
  },
  certificate: {
    placeholders: [
      {
        isCustomVariable: () => true,
        type: "text",
        variable: "student_name",
        label: "Елена Васильева",
      },
      {
        isCustomVariable: () => true,
        type: "text",
        variable: "course_name",
        label: "Программирование",
      },
      {
        isCustomVariable: () => true,
        type: "image",
        variable: "signature",
        label: "",
      },
      {
        isCustomVariable: () => true,
        type: "text",
        variable: "instructor",
        label: "Профессор Смит",
      },
      {
        isCustomVariable: () => false, // Не кастомная
        type: "text",
        variable: "date",
        label: "01.01.2023",
      },
    ],
  },
  userCertificate: {
    id: 458,
    is_active: 1,
    certificate_number: "CERT-2023-003",
    placeholders: {
      student_name: "Елена Васильева",
      course_name: "Программирование",
      signature: "https://example.com/signature.png",
      instructor: "Профессор Смит",
    },
  },
  student: {
    id: 793,
    user: {
      getFullName: () => "Елена Васильева",
    },
  },
  allow: true,
};

const CertificateComponent: React.FC<
  AssignmentStudentCertificateComponentProps
> = ({
  assignment = mock.assignment,
  certificate = mock.certificate,
  userCertificate = mock.userCertificate,
  student = mock.student,
  allow = mock.allow,
  onIssued,
  onRevoked,
}) => {
  // Локальное состояние для тостов
  const [toasts, setToasts] = useState<Toast[]>([]);
  const confirmModalRef = useRef<ConfirmModalRef>(null);
  const downloadCertificateBtnRef = useRef<ButtonRef>(null);

  // Локальная функция toast
  const showToast = useCallback(
    ({ title, description, variant = "default" }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = { id, title, description, variant };

      setToasts((prev) => [...prev, newToast]);

      // Автоматическое удаление через 5 секунд
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  // Функция для закрытия тоста
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Computed values
  const issueStudentCertificateApiUrl = `/api/assignment/certificates/${assignment.id}/issue.json`;
  const revokeStudentCertificateApiUrl = `/api/assignment/certificates/${assignment.id}/revoke.json`;
  const downloadCertificateApiUrl = `/api/user/certificates/${userCertificate?.id}.pdf`;

  const variables = (() => {
    const vars: any[] = [];

    if (certificate && certificate.placeholders) {
      certificate.placeholders.forEach((item) => {
        if (item.isCustomVariable && item.isCustomVariable()) {
          vars.push(item);
        }
      });
    }

    if (userCertificate && userCertificate.placeholders) {
      try {
        // Безопасно получаем записи
        const entries = Object.entries(
          userCertificate.placeholders as Record<string, any>
        );

        entries.forEach(([key, value]) => {
          vars.forEach((item, index) => {
            if (item.variable === key) {
              vars[index] = value;
            }
          });
        });
      } catch (error) {
        console.warn("Error processing user certificate placeholders:", error);
      }
    }

    return vars;
  })();

  // Methods
  const issueStudentCertificate = async () => {
    if (!confirmModalRef.current) return;

    const isConfirm = await confirmModalRef.current.open(
      "Подтвердить действие"
    );

    if (!isConfirm) {
      return;
    }

    try {
      const response = await fetch(issueStudentCertificateApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_id: student.id }),
      });

      if (response.ok) {
        if (onIssued) onIssued();
        showToast({
          title: "Успех",
          description: "Сертификат успешно выдан",
          variant: "success",
        });
      } else {
        throw new Error("Failed to issue certificate");
      }
    } catch (error) {
      console.error("Error issuing certificate:", error);
      showToast({
        title: "Ошибка",
        description: "Не удалось выдать сертификат",
        variant: "destructive",
      });
    }
  };

  const revokeStudentCertificate = async () => {
    if (!confirmModalRef.current) return;

    const isConfirm = await confirmModalRef.current.open(
      "Подтвердить действие"
    );

    if (!isConfirm) {
      return;
    }

    try {
      const response = await fetch(revokeStudentCertificateApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_id: student.id }),
      });

      if (response.ok) {
        if (onRevoked) onRevoked();
        showToast({
          title: "Успех",
          description: "Сертификат успешно отозван",
          variant: "success",
        });
      } else {
        throw new Error("Failed to revoke certificate");
      }
    } catch (error) {
      console.error("Error revoking certificate:", error);
      showToast({
        title: "Ошибка",
        description: "Не удалось отозвать сертификат",
        variant: "destructive",
      });
    }
  };

  const downloadCertificate = async () => {
    if (downloadCertificateBtnRef.current) {
      downloadCertificateBtnRef.current.showLoader();
    }

    try {
      const response = await fetch(downloadCertificateApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const name = new Date().getTime();
        const linkDom = document.createElement("a");

        linkDom.href = window.URL.createObjectURL(blob);
        linkDom.download = `${name}.pdf`;
        linkDom.click();
      } else {
        throw new Error("Failed to download certificate");
      }
    } catch (error) {
      console.error("Error downloading certificate:", error);
      showToast({
        title: "Ошибка",
        description: "Не удалось скачать сертификат",
        variant: "destructive",
      });
    } finally {
      if (downloadCertificateBtnRef.current) {
        downloadCertificateBtnRef.current.hideLoader();
      }
    }
  };

  const onImageVariableUploaded = (response: any, variable: any) => {
    const image = new Image();

    image.onload = () => {
      variable.image = response.src;
    };

    image.src = response.src;
  };

  // Локальный Toast компонент
  const ToastComponent = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            relative flex items-start p-4 rounded-lg shadow-lg border transition-all duration-300
            ${
              toast.variant === "success"
                ? "bg-green-500 text-white border-green-600"
                : ""
            }
            ${
              toast.variant === "destructive"
                ? "bg-red-500 text-white border-red-600"
                : ""
            }
            ${
              toast.variant === "default"
                ? "bg-gray-800 text-white border-gray-700"
                : ""
            }
          `}
        >
          <div className="flex-1">
            {toast.title && (
              <h4 className="font-medium text-sm">{toast.title}</h4>
            )}
            {toast.description && (
              <p className="text-sm opacity-90 mt-1">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="flex-shrink-0 ml-4 opacity-70 hover:opacity-100 transition-opacity"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="assignment-student-certificate-component">
      {/* Локальные тосты */}
      <ToastComponent />

      {/* CERTIFICATE */}
      {userCertificate && userCertificate.id && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">Сертификат</h3>
              <p className="text-sm text-gray-600">Детали сертификата</p>
            </div>
            <button
              onClick={downloadCertificate}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Скачать
            </button>
          </div>

          <CertificateInfoComponent
            certificate={{
              ...certificate,
              certificate_number: userCertificate.certificate_number || "",
              getIssuedAtDate: () => "—",
              placeholders: variables,
              is_active: userCertificate.is_active,
            }}
            student={{ ...student, user: student.user || {} }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ISSUE CERTIFICATE BUTTON */}
        <div>
          <div className="mb-2 text-sm font-medium text-gray-700">
            Выдать сертификат студенту
          </div>
          {!userCertificate ? (
            <button
              onClick={issueStudentCertificate}
              disabled={!allow}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                allow
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Выдать сертификат
            </button>
          ) : (
            <button
              onClick={issueStudentCertificate}
              disabled={userCertificate.is_active === 1}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                userCertificate.is_active !== 1
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Восстановить сертификат
            </button>
          )}
        </div>

        {/* REVOKE CERTIFICATE BUTTON */}
        <div>
          <div className="mb-2 text-sm font-medium text-gray-700">
            Отозвать сертификат
          </div>
          <button
            onClick={revokeStudentCertificate}
            disabled={!userCertificate || userCertificate.is_active === 0}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              userCertificate && userCertificate.is_active !== 0
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Отозвать сертификат
          </button>
        </div>
      </div>

      {/* CERTIFICATE VARIABLES */}
      {variables && variables.length > 0 && (
        <div className="certificate-variable-list mt-6">
          {variables.map((variable, index) => (
            <div key={`certificate-variable-${index}`} className="mb-4">
              {/* IF TYPE IS TEXT */}
              {variable.type === "text" && (
                <input
                  type="text"
                  value={variable.label || ""}
                  onChange={(e) => (variable.label = e.target.value)}
                  placeholder="Текст элемента сертификата"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              {/* IF TYPE IS IMAGE */}
              {variable.type === "image" && (
                <div className="border-2 border-dashed border-blue-300 rounded-md p-4 text-center">
                  <input
                    type="file"
                    accept="image/jpg, image/png, image/svg"
                    onChange={(e) => {
                      // TODO: реализовать загрузку файла
                      console.log("File selected:", e.target.files?.[0]);
                    }}
                    className="hidden"
                    id={`image-upload-${index}`}
                  />
                  <label
                    htmlFor={`image-upload-${index}`}
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Загрузить изображение
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CONFIRM ACTION MODAL */}
      {/* TODO: реализовать модальное окно подтверждения */}
    </div>
  );
};

export default CertificateComponent;
