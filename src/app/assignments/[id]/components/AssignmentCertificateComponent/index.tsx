// components/Assignment/CertificateComponent.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCertificate } from "@/hooks/useCertificate"; // Импортируем хук
import {
  AssignmentDetail,
  CertificateIssueType,
  CertificateSettings,
} from "@/types/assignment/detail";
import { Certificate } from "@/types/assignment/certificate"; // Импортируем тип Certificate
import CollapsibleCard from "@/components/Oqylyk/Assignment/CollapsibleCard";
import { Image } from "lucide-react";
import { useTranslations } from "next-intl";

// --- Вспомогательный компонент: Карточка Сертификата ---
const SimpleCertificateCard: React.FC<{
  certificate: Certificate;
  onClick: () => void;
}> = ({ certificate, onClick }) => (
  <div
    className="border rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    onClick={onClick}
    aria-label={`Просмотреть сертификат ${certificate.name}`} // Для доступности
  >
    <div className="flex items-center p-4 space-x-4">
      {certificate.image ? (
        <img
          src={certificate.image}
          alt={certificate.name}
          className="w-16 h-16 object-cover rounded-md"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
          {/* Иконка по умолчанию, если изображение отсутствует */}
          {/* <FileText className="h-6 w-6" /> */}
          No Image
        </div>
      )}
      <div className="min-w-0">
        {" "}
        {/* min-w-0 для корректной работы truncate */}
        <h3 className="font-medium truncate">{certificate.name}</h3>
        {certificate.description && (
          <p className="text-sm text-gray-500 truncate">
            {certificate.description}
          </p>
        )}
      </div>
    </div>
  </div>
);
// ----------------------------------------------------

interface AssignmentCertificateComponentProps {
  assignment: AssignmentDetail;
  errors?: Record<string, string[]>;
  onAssignmentChange: (assignment: AssignmentDetail) => void;
}

const AssignmentCertificateComponent: React.FC<
  AssignmentCertificateComponentProps
> = ({ assignment, errors = {}, onAssignmentChange }) => {
  const t = useTranslations();

  const { toast } = useToast();

  // --- Состояния для модальных окон ---
  // TODO: Заменить на реальные модальные окна
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [certificateListModalOpen, setCertificateListModalOpen] =
    useState(false);
  // ------------------------------------

  // --- Получаем данные сертификата с помощью хука ---
  const {
    data: certificateData,
    isLoading: isCertificateLoading,
    isError: isCertificateError,
    error: certificateError,
  } = useCertificate(assignment.certificate_id ?? null);
  // --------------------------------------------------

  // --- Вычисляемые значения ---
  const issueTypeOptions = useMemo(
    () => [
      { id: "auto-all", label: "Автоматически для всех" },
      { id: "auto-conditions", label: "Автоматически по условиям" },
      { id: "manual", label: "Вручную" },
    ],
    []
  );

  // Получаем объект сертификата из данных запроса
  const certificateEntity: Certificate | undefined | null =
    certificateData?.entity || null;
  // ----------------------------

  // --- Эффекты ---
  // Обработка ошибок загрузки сертификата
  useEffect(() => {
    if (isCertificateError && certificateError) {
      toast({
        title: "Ошибка загрузки",
        description: `Не удалось загрузить сертификат: ${
          certificateError?.message || "Неизвестная ошибка"
        }`,
      });
    }
  }, [isCertificateError, certificateError, toast]);
  // --------------

  // --- Handlers ---
  const showCertificateModal = () => {
    // TODO: Открыть модальное окно редактирования сертификата
    setCertificateModalOpen(true);
    console.log("TODO: Открыть модальное окно редактирования сертификата");
  };

  const showCertificateListModal = () => {
    // TODO: Открыть модальное окно выбора сертификата
    setCertificateListModalOpen(true);
    console.log("TODO: Открыть модальное окно выбора сертификата");
  };

  const onCertificateSelected = (certificate: Certificate) => {
    // TODO: Эта функция будет вызываться из модального окна выбора
    console.log("Сертификат выбран:", certificate);
    onAssignmentChange({
      ...assignment,
      certificate_id: certificate.id,
    });
    // Закрыть модальное окно выбора
    setCertificateListModalOpen(false);
  };

  const onCertificateDetached = () => {
    onAssignmentChange({
      ...assignment,
      certificate_id: null,
      // Опционально: сбросить настройки сертификата
      // settings: {
      //   ...assignment.settings,
      //   certificate: undefined // или {}
      // }
    });
  };

  const handleIssueTypeChange = (value: CertificateIssueType) => {
    onAssignmentChange({
      ...assignment,
      settings: {
        ...assignment.settings,
        certificate: {
          ...(assignment.settings?.certificate as
            | CertificateSettings
            | undefined),
          issue_type: value,
        },
      },
    });
  };

  const handleShowReportChange = (checked: boolean) => {
    onAssignmentChange({
      ...assignment,
      settings: {
        ...assignment.settings,
        certificate: {
          ...(assignment.settings?.certificate as
            | CertificateSettings
            | undefined),
          show_report: checked,
        },
      },
    });
  };
  // ----------------

  return (
    <CollapsibleCard
      title={t("label-assignment-certificate-title")}
      description={t("label-assignment-certificate-description")}
      icon={<Image className="h-5 w-5 text-blue-600" />}
    >
      <div className="space-y-4">
        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={showCertificateListModal}>
            {/* <Menu className="mr-2 h-4 w-4" /> */}
            {t("btn-course-select-certificate")}
          </Button>

          {assignment.certificate_id && (
            <Button variant="outline" onClick={onCertificateDetached}>
              {/* <LinkOff className="mr-2 h-4 w-4" /> */}
              {t("btn-course-detach-certificate")}
            </Button>
          )}
        </div>

        {/* LOADING STATE */}
        {isCertificateLoading && assignment.certificate_id && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2">{t("label-upload")}</span>
          </div>
        )}

        {/* ERROR STATE */}
        {isCertificateError &&
          assignment.certificate_id &&
          !isCertificateLoading && (
            <div className="text-red-500 p-4 bg-red-50 rounded-md">
              Ошибка загрузки сертификата. Попробуйте обновить страницу.
            </div>
          )}

        {/* SELECTED CERTIFICATE */}
        {certificateEntity && !isCertificateLoading && (
          <>
            <SimpleCertificateCard
              certificate={certificateEntity}
              onClick={showCertificateModal}
            />

            {/* SETTINGS */}
            <div className="space-y-4 pt-2 border-t">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Тип выдачи сертификата
                </Label>
                <Select
                  value={
                    assignment.settings?.certificate?.issue_type || "auto-all"
                  }
                  onValueChange={handleIssueTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип выдачи" />
                  </SelectTrigger>
                  <SelectContent>
                    {issueTypeOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Выберите, как будет выдаваться сертификат
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label className="text-sm font-medium">
                    Показывать отчет
                  </Label>
                  <p className="text-xs text-gray-500">
                    Отчет будет доступен студенту после получения сертификата
                  </p>
                </div>
                <Switch
                  checked={!!assignment.settings?.certificate?.show_report}
                  onCheckedChange={handleShowReportChange}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* MODALS */}
      {/* 
      TODO: Реализовать модальные окна
      <CertificateCreateModalComponent
        open={certificateModalOpen}
        onOpenChange={setCertificateModalOpen}
        certificate={certificateEntity}
        // onSaved={(updatedCert) => { ... }}
      />

      <CertificateListModalComponent
        open={certificateListModalOpen}
        onOpenChange={setCertificateListModalOpen}
        selectedCertificates={[assignment.certificate_id]} // Передаем ID как массив
        onCertificateSelected={onCertificateSelected}
      /> 
      */}
    </CollapsibleCard>
  );
};

export default AssignmentCertificateComponent;
