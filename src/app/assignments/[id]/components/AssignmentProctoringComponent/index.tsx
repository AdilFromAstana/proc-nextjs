import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  AssignmentDetail,
  ProctoringSettings,
} from "@/types/assignment/detail";
import CollapsibleCard from "@/components/Oqylyk/Assignment/CollapsibleCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { numericToBoolean } from "@/utils/numericToBoolean";
import { useTranslations } from "next-intl";

interface AssignmentProctoringComponentProps {
  assignment: AssignmentDetail;
  errors?: Record<string, string[]>;
  onAssignmentChange: (assignment: AssignmentDetail) => void;
}

interface ProctoringSettingsModalProps {
  proctoringSettings: ProctoringSettings;
  applicationType: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSettingsChange: (
    settings: ProctoringSettings,
    applicationType: string
  ) => void;
}

export function Robot(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M17.5 15.5c0 1.11-.89 2-2 2s-2-.89-2-2s.9-2 2-2s2 .9 2 2m-9-2c-1.1 0-2 .9-2 2s.9 2 2 2s2-.89 2-2s-.89-2-2-2M23 15v3c0 .55-.45 1-1 1h-1v1c0 1.11-.89 2-2 2H5a2 2 0 0 1-2-2v-1H2c-.55 0-1-.45-1-1v-3c0-.55.45-1 1-1h1c0-3.87 3.13-7 7-7h1V5.73c-.6-.34-1-.99-1-1.73c0-1.1.9-2 2-2s2 .9 2 2c0 .74-.4 1.39-1 1.73V7h1c3.87 0 7 3.13 7 7h1c.55 0 1 .45 1 1m-2 1h-2v-2c0-2.76-2.24-5-5-5h-4c-2.76 0-5 2.24-5 5v2H3v1h2v3h14v-3h2z"
      ></path>
    </svg>
  );
}

// Компонент для отображения параметра с переключателем
const SwitchParameter: React.FC<{
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}> = ({ label, description, checked, onCheckedChange }) => (
  <div className="flex items-center justify-between py-2">
    <div className="space-y-1">
      <div className="font-medium">{label}</div>
      {description && (
        <div className="text-sm text-gray-500">{description}</div>
      )}
    </div>
    <Switch
      checked={numericToBoolean(checked)}
      onCheckedChange={onCheckedChange}
    />
  </div>
);

// Компонент для отображения параметра с выбором из вариантов
const SelectParameter: React.FC<{
  label: string;
  description?: string;
  value: string;
  options: { value: string; label: string }[];
  onValueChange?: (value: string) => void;
}> = ({ label, description, value, options, onValueChange }) => (
  <div className="py-2">
    <div className="font-medium">{label}</div>
    {description && (
      <div className="text-sm text-gray-500 mb-2">{description}</div>
    )}
    <div className="flex gap-2 flex-wrap">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onValueChange?.(option.value)}
          className={`px-3 py-1 rounded-full text-sm border ${
            value === option.value
              ? "bg-blue-100 text-blue-800 border-blue-200"
              : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

// Компонент для поля ввода
const InputParameter: React.FC<{
  label: string;
  description?: string;
  value: string | number;
  placeholder: string;
  type?: "text" | "number";
  onValueChange?: (value: string) => void;
}> = ({
  label,
  description,
  value,
  placeholder,
  type = "text",
  onValueChange,
}) => (
  <div className="py-2">
    <div className="font-medium">{label}</div>
    {description && (
      <div className="text-sm text-gray-500 mb-2">{description}</div>
    )}
    <Input
      type={type}
      value={value || ""}
      onChange={(e) => onValueChange?.(e.target.value)}
      placeholder={placeholder}
      className=""
    />
  </div>
);

const CameraParameter: React.FC<{
  label: string;
  description?: string;
  recordValue: boolean;
  uploadValue: boolean;
  onModeChange?: (mode: string) => void;
  additionalSettings?: {
    label: string;
    description: string;
    value: boolean;
    hidden?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }[];
}> = ({
  label,
  description,
  recordValue,
  uploadValue,
  onModeChange,
  additionalSettings,
}) => {
  const t = useTranslations();
  const [showSettings, setShowSettings] = useState(false);

  const getCameraMode = () => {
    if (!recordValue && !uploadValue)
      return t("label-webinar-record-type-disabled");
    if (recordValue && !uploadValue)
      return t("label-webinar-record-type-streaming");
    if (!recordValue && uploadValue)
      return t("label-webinar-record-type-recording");
    return t("label-webinar-record-type-disabled");
  };

  const mode = getCameraMode();

  const handleModeChange = (newMode: string) => {
    onModeChange?.(newMode);
  };

  const getModeDescription = () => {
    if (mode === t("label-webinar-record-type-streaming")) {
      return t("hint-webinar-record-type-streaming");
    }
    if (mode === t("label-webinar-record-type-recording")) {
      return t("hint-webinar-record-type-recording");
    }
    return null;
  };

  const filteredSettings = additionalSettings?.filter(
    (setting) => !setting.hidden
  );

  return (
    <div className="py-2">
      <div className="font-medium">{label}</div>
      {description && (
        <div className="text-sm text-gray-500 mb-2">{description}</div>
      )}

      <div className="flex gap-2 mb-2">
        {[
          t("label-webinar-record-type-disabled"),
          t("label-webinar-record-type-streaming"),
          t("label-webinar-record-type-recording"),
        ].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleModeChange(option)}
            className={`px-3 py-1 rounded-full text-sm border ${
              mode === option
                ? "bg-blue-100 text-blue-800 border-blue-200"
                : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {mode !== t("label-webinar-record-type-disabled") && (
        <>
          <div className="py-1 px-2 bg-yellow-50 border border-yellow-200 rounded-md mb-2">
            <div className="text-sm text-gray-500">{getModeDescription()}</div>
          </div>

          {filteredSettings && filteredSettings.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2"
              >
                {t("btn-settings")}
              </button>

              {showSettings && (
                <div className="ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
                  {filteredSettings.map((setting, index) => (
                    <SwitchParameter
                      key={index}
                      label={setting.label}
                      description={setting.description}
                      checked={setting.value}
                      onCheckedChange={setting.onCheckedChange}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

const ProctoringSettingsModal: React.FC<ProctoringSettingsModalProps> = ({
  proctoringSettings,
  applicationType,
  open,
  onOpenChange,
  onSettingsChange,
}) => {
  const t = useTranslations();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [settings, setSettings] = useState(proctoringSettings);
  const [appType, setAppType] = useState(applicationType);

  // Синхронизируем состояние с props при их изменении
  useEffect(() => {
    setSettings(proctoringSettings);
  }, [proctoringSettings]);

  useEffect(() => {
    setAppType(applicationType);
  }, [applicationType]);

  const handleSettingsChange = (newSettings: ProctoringSettings) => {
    setSettings(newSettings);
    onSettingsChange(newSettings, appType);
  };

  const handleAppTypeChange = (type: string) => {
    setAppType(type);
    onSettingsChange(settings, type);
  };

  const handleCameraModeChange = (cameraType: string, mode: string) => {
    const newSettings = { ...settings };

    switch (mode) {
      case t("label-webinar-record-type-disabled"):
        if (cameraType === "main") {
          newSettings.main_camera_record = false;
          newSettings.main_camera_upload = false;
        } else if (cameraType === "second") {
          newSettings.second_camera_record = false;
          newSettings.second_camera_upload = false;
        } else if (cameraType === "screen") {
          newSettings.screen_share_record = false;
          newSettings.screen_share_upload = false;
        } else if (cameraType === "microphone") {
          newSettings.second_microphone_record = false;
          newSettings.second_microphone_upload = false;
        }
        break;
      case t("label-webinar-record-type-streaming"):
        if (cameraType === "main") {
          newSettings.main_camera_record = true;
          newSettings.main_camera_upload = false;
        } else if (cameraType === "second") {
          newSettings.second_camera_record = true;
          newSettings.second_camera_upload = false;
        } else if (cameraType === "screen") {
          newSettings.screen_share_record = true;
          newSettings.screen_share_upload = false;
        } else if (cameraType === "microphone") {
          newSettings.second_microphone_record = true;
          newSettings.second_microphone_upload = false;
        }
        break;
      case t("label-webinar-record-type-recording"):
        if (cameraType === "main") {
          newSettings.main_camera_record = false;
          newSettings.main_camera_upload = true;
        } else if (cameraType === "second") {
          newSettings.second_camera_record = false;
          newSettings.second_camera_upload = true;
        } else if (cameraType === "screen") {
          newSettings.screen_share_record = false;
          newSettings.screen_share_upload = true;
        } else if (cameraType === "microphone") {
          newSettings.second_microphone_record = false;
          newSettings.second_microphone_upload = true;
        }
        break;
    }

    handleSettingsChange(newSettings);
  };

  const handleSwitchChange = (
    key: keyof ProctoringSettings,
    value: boolean
  ) => {
    const newSettings = { ...settings, [key]: value };
    handleSettingsChange(newSettings);
  };

  const handleInputChange = (key: keyof ProctoringSettings, value: string) => {
    // Преобразуем строку в число, если это числовое поле
    const numValue = isNaN(Number(value)) ? value : Number(value);
    const newSettings = { ...settings, [key]: numValue };
    handleSettingsChange(newSettings);
  };

  const handleBrowserTypeChange = (value: string) => {
    const newSettings = { ...settings, browser_type: value };
    handleSettingsChange(newSettings);
  };

  // Дополнительные настройки для фронтальной камеры
  const getFrontCameraSettings = () => {
    const mainCameraMode = getCameraMode(
      numericToBoolean(settings.main_camera_record),
      numericToBoolean(settings.main_camera_upload)
    );

    const settingsList = [
      {
        label: t("label-proctoring-head-tracking-client"),
        description: t("hint-proctoring-head-tracking-client"),
        value: numericToBoolean(settings.head_tracking_client),
        onCheckedChange: (checked: boolean) =>
          handleSwitchChange("head_tracking_client", checked),
      },
      {
        label: t("label-proctoring-head-tracking-server-post"),
        description: t("hint-proctoring-head-tracking-server-post"),
        value: numericToBoolean(settings.head_tracking_server_post),
        onCheckedChange: (checked: boolean) =>
          handleSwitchChange("head_tracking_server_post", checked),
      },
      {
        label: t("label-proctoring-head-tracking-server-realtime"),
        description: t("hint-proctoring-head-tracking-server-realtime"),
        value: numericToBoolean(settings.head_tracking_server_realtime),
        onCheckedChange: (checked: boolean) =>
          handleSwitchChange("head_tracking_server_realtime", checked),
        hidden: mainCameraMode !== "Стриминг",
      },
      {
        label: t("label-proctoring-eye-tracking"),
        description: t("hint-proctoring-eye-tracking"),
        value: numericToBoolean(settings.head_tracking_server),
        onCheckedChange: (checked: boolean) =>
          handleSwitchChange("head_tracking_server", checked),
      },
      {
        label: t("label-proctoring-object-detect"),
        description: t("hint-proctoring-object-detect"),
        value: numericToBoolean(settings.object_detect),
        onCheckedChange: (checked: boolean) =>
          handleSwitchChange("object_detect", checked),
      },
    ];

    return mainCameraMode === t("label-webinar-record-type-disabled")
      ? []
      : settingsList;
  };

  // Вспомогательная функция для определения режима камеры
  const getCameraMode = (record: boolean, upload: boolean) => {
    if (!record && !upload) return t("label-webinar-record-type-disabled");
    if (record && !upload) return t("label-webinar-record-type-streaming");
    if (!record && upload) return t("label-webinar-record-type-recording");
    return t("label-webinar-record-type-disabled");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("label-proctoring-modal-title")}</DialogTitle>
          <DialogDescription>
            {t("label-proctoring-modal-description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <SelectParameter
            label={t("label-assignment-application-type")}
            description={t("hint-assignment-application-type")}
            value={appType}
            options={[
              { value: "browser", label: "Браузер" },
              { value: "tray", label: "Tray" },
              { value: "desktop", label: "Desktop" },
            ]}
            onValueChange={handleAppTypeChange}
          />

          {appType === "browser" && (
            <SelectParameter
              label={t("label-assignment-browser-type")}
              description={t("hint-assignment-browser-type")}
              value={settings.browser_type}
              options={[
                { value: "*", label: "All" },
                { value: "Chrome", label: "Chrome" },
                { value: "Safari", label: "Safari" },
                { value: "Edge", label: "Edge" },
                { value: "Yandex", label: "Yandex" },
              ]}
              onValueChange={handleBrowserTypeChange}
            />
          )}

          {(appType === "desktop" || appType === "tray") && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="text-sm text-yellow-800">
                {t("hint-assignment-application-type-alt")}
              </div>
            </div>
          )}

          <CameraParameter
            label={t("label-proctoring-camera-record")}
            description={t("hint-proctoring-camera-record")}
            recordValue={numericToBoolean(settings.main_camera_record)}
            uploadValue={numericToBoolean(settings.main_camera_upload)}
            onModeChange={(mode) => handleCameraModeChange("main", mode)}
            additionalSettings={getFrontCameraSettings()}
          />

          <CameraParameter
            label={t("label-proctoring-second-camera")}
            description={t("hint-proctoring-two-camera")}
            recordValue={numericToBoolean(settings.second_camera_record)}
            uploadValue={numericToBoolean(settings.second_camera_upload)}
            onModeChange={(mode) => handleCameraModeChange("second", mode)}
          />

          <CameraParameter
            label={t("label-proctoring-screen-record")}
            description={t("hint-proctoring-screen-record")}
            recordValue={numericToBoolean(settings.screen_share_record)}
            uploadValue={numericToBoolean(settings.screen_share_upload)}
            onModeChange={(mode) => handleCameraModeChange("screen", mode)}
          />

          <CameraParameter
            label={t("label-proctoring-antimicro-record")}
            description={t("hint-proctoring-antimicro-record")}
            recordValue={numericToBoolean(settings.second_microphone_record)}
            uploadValue={numericToBoolean(settings.second_microphone_upload)}
            onModeChange={(mode) => handleCameraModeChange("microphone", mode)}
          />

          <SwitchParameter
            label={t("label-proctoring-photo-head-identity")}
            description={t("hint-proctoring-photo-head-identity")}
            checked={numericToBoolean(settings.photo_head_identity)}
            onCheckedChange={(checked) =>
              handleSwitchChange("photo_head_identity", checked)
            }
          />

          <SwitchParameter
            label={t("label-proctoring-video-head-identity")}
            description={t("hint-proctoring-video-head-identity")}
            checked={numericToBoolean(settings.video_head_identity)}
            onCheckedChange={(checked) =>
              handleSwitchChange("video_head_identity", checked)
            }
          />

          <SwitchParameter
            label={t("label-proctoring-id-verification")}
            description={t("hint-proctoring-id-verification")}
            checked={numericToBoolean(settings.id_verification)}
            onCheckedChange={(checked) =>
              handleSwitchChange("id_verification", checked)
            }
          />

          <SwitchParameter
            label={t("label-proctoring-noise-detector")}
            description={t("hint-proctoring-noise-detector")}
            checked={numericToBoolean(settings.noise_detector)}
            onCheckedChange={(checked) =>
              handleSwitchChange("noise_detector", checked)
            }
          />

          <SwitchParameter
            label={t("label-proctoring-voice-detector")}
            description={t("hint-proctoring-voice-detector")}
            checked={numericToBoolean(settings.speech_detector)}
            onCheckedChange={(checked) =>
              handleSwitchChange("speech_detector", checked)
            }
          />

          <SwitchParameter
            label={t("label-proctoring-displays-check")}
            description={t("hint-proctoring-displays-check")}
            checked={numericToBoolean(settings.displays_check)}
            onCheckedChange={(checked) =>
              handleSwitchChange("displays_check", checked)
            }
          />

          <SwitchParameter
            label="HDCP проверка"
            description="Детальная проверка подключенных устройств отображения (Beta)"
            checked={numericToBoolean(settings.hdcp_check)}
            onCheckedChange={(checked) =>
              handleSwitchChange("hdcp_check", checked)
            }
          />

          <SwitchParameter
            label={t("label-proctoring-content-protect")}
            description={t("hint-proctoring-content-protect")}
            checked={numericToBoolean(settings.content_protect)}
            onCheckedChange={(checked) =>
              handleSwitchChange("content_protect", checked)
            }
          />

          <SwitchParameter
            label={t("label-proctoring-fullscreen-mode")}
            description={t("hint-proctoring-fullscreen-mode")}
            checked={numericToBoolean(settings.fullscreen_mode)}
            onCheckedChange={(checked) =>
              handleSwitchChange("fullscreen_mode", checked)
            }
          />

          <SwitchParameter
            label={t("label-proctoring-read-clipboard")}
            description={t("hint-proctoring-read-clipboard")}
            checked={numericToBoolean(settings.read_clipboard)}
            onCheckedChange={(checked) =>
              handleSwitchChange("read_clipboard", checked)
            }
          />

          <SwitchParameter
            label={t("label-proctoring-focus-detector")}
            description={t("hint-proctoring-focus-detector")}
            checked={numericToBoolean(settings.focus_detector)}
            onCheckedChange={(checked) =>
              handleSwitchChange("focus_detector", checked)
            }
          />

          <SwitchParameter
            label={t("label-proctoring-extension-detector")}
            description={t("hint-proctoring-extension-detector")}
            checked={numericToBoolean(settings.extension_detector)}
            onCheckedChange={(checked) =>
              handleSwitchChange("extension_detector", checked)
            }
          />

          {/* Расширенные настройки */}
          <div className="border-t pt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-blue-600 hover:text-blue-800"
            >
              {t("btn-advanced-proctoring-settings")}
            </button>

            {showAdvanced && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <InputParameter
                  label={t("label-proctoring-head-recognize-interval")}
                  description={t("hint-proctoring-head-recognize-interval")}
                  value={settings.head_recognize_interval || ""}
                  placeholder={t("label-proctoring-head-recognize-interval")}
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("head_recognize_interval", value)
                  }
                />

                {/* 2. Интервал распознавания лица */}
                <InputParameter
                  label={t("label-proctoring-head-compare-interval")}
                  description={t("hint-proctoring-head-compare-interval")}
                  value={settings.head_compare_interval || ""}
                  placeholder={t("label-proctoring-head-compare-interval")}
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("head_compare_interval", value)
                  }
                />

                {/* 3. Чувствительность поворота головы по X */}
                <InputParameter
                  label={t("label-proctoring-head-x-rotate-sensitivity")}
                  description={t("hint-proctoring-head-x-rotate-sensitivity")}
                  value={settings.head_x_sensitivity || ""}
                  placeholder={t("label-proctoring-head-x-rotate-sensitivity")}
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("head_x_sensitivity", value)
                  }
                />

                {/* 4. Чувствительность поворота головы по Y */}
                <InputParameter
                  label={t("hint-proctoring-head-y-rotate-sensitivity")}
                  description={t("hint-proctoring-head-y-rotate-sensitivity")}
                  value={settings.head_y_sensitivity || ""}
                  placeholder={t("hint-proctoring-head-y-rotate-sensitivity")}
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("head_y_sensitivity", value)
                  }
                />

                {/* 5. Чувствительность отдаления головы */}
                <InputParameter
                  label={t("label-proctoring-head-depth-sensitivity")}
                  description={t("hint-proctoring-head-depth-sensitivity")}
                  value={settings.head_depth_sensitivity || ""}
                  placeholder={t("label-proctoring-head-depth-sensitivity")}
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("head_depth_sensitivity", value)
                  }
                />

                {/* 6. Толерантность поворота головы */}
                <InputParameter
                  label={t("label-proctoring-head-tolerance-seconds")}
                  description={t("hint-proctoring-head-tolerance-seconds")}
                  value={settings.head_tolerance_seconds || ""}
                  placeholder={t("label-proctoring-head-tolerance-seconds")}
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("head_tolerance_seconds", value)
                  }
                />

                {/* 7. Чувствительность микрофона к шуму */}
                <InputParameter
                  label={t("label-proctoring-noise-sensitivity")}
                  description={t("hint-proctoring-noise-sensitivity")}
                  value={settings.noise_sensitivity || ""}
                  placeholder={t("label-proctoring-noise-sensitivity")}
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("noise_sensitivity", value)
                  }
                />

                {/* 8. Счетчик кадров шума */}
                <InputParameter
                  label={t("label-proctoring-noise-tolerance-frames")}
                  description={t("hint-proctoring-noise-tolerance-frames")}
                  value={settings.noise_tolerance_frames || ""}
                  placeholder={t("label-proctoring-noise-tolerance-frames")}
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("noise_tolerance_frames", value)
                  }
                />

                {/* 9. Толерантность к шуму */}
                <InputParameter
                  label={t("label-proctoring-noise-tolerance-seconds")}
                  description={t("hint-proctoring-noise-tolerance-seconds")}
                  value={settings.noise_tolerance_seconds || ""}
                  placeholder={t("label-proctoring-noise-tolerance-seconds")}
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("noise_tolerance_seconds", value)
                  }
                />

                {/* 10. Толерантность к потере фокуса */}
                <InputParameter
                  label={t("label-proctoring-focus-tolerance-seconds")}
                  description={t("hint-proctoring-focus-tolerance-seconds")}
                  value={settings.focus_tolerance_seconds || ""}
                  placeholder={t("label-proctoring-focus-tolerance-seconds")}
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("focus_tolerance_seconds", value)
                  }
                />

                {/* 11. Таймаут подключения */}
                <InputParameter
                  label={t("label-proctoring-rtc-connection-timeout")}
                  description={t("hint-proctoring-rtc-connection-timeout")}
                  value={settings.rtc_connection_timeout || ""}
                  placeholder={t("label-proctoring-rtc-connection-timeout")}
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("rtc_connection_timeout", value)
                  }
                />

                {/* 12. Таймаут инициализации */}
                <InputParameter
                  label={t("label-proctoring-identification-timeout")}
                  description={t("hint-proctoring-identification-timeout")}
                  value={settings.facemodel_init_timeout || ""}
                  placeholder={t("label-proctoring-identification-timeout")}
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("facemodel_init_timeout", value)
                  }
                />

                {/* 13. Mobile Restrict */}
                <div className="col-span-2">
                  <SwitchParameter
                    label={t("label-proctoring-mobile-restrict")}
                    description={t("hint-proctoring-mobile-restrict")}
                    checked={numericToBoolean(
                      settings.proctoring_mobile_restrict
                    )}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("proctoring_mobile_restrict", checked)
                    }
                  />
                </div>

                {/* 14. Fallback */}
                <div className="col-span-2">
                  <SwitchParameter
                    label={t("label-proctoring-fallback-allow")}
                    description={t("hint-proctoring-fallback-allow")}
                    checked={numericToBoolean(
                      settings.proctoring_fallback_allow
                    )}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("proctoring_fallback_allow", checked)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("btn-close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AssignmentProctoringComponent: React.FC<
  AssignmentProctoringComponentProps
> = ({ assignment, errors = {}, onAssignmentChange }) => {
  const t = useTranslations();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Определяем включен ли прокторинг
  const isProctoringEnable = numericToBoolean(assignment.is_proctoring);

  const handleProctoringToggle = (enabled: boolean) => {
    const updatedAssignment = {
      ...assignment,
      is_proctoring: enabled ? 1 : 0,
    };
    onAssignmentChange(updatedAssignment);
  };

  const handleProctoringSettingsChange = (
    settings: ProctoringSettings,
    applicationType: string
  ) => {
    const updatedAssignment = {
      ...assignment,
      application: applicationType,
      settings: {
        ...assignment.settings,
        proctoring_settings: settings,
      },
    };
    onAssignmentChange(updatedAssignment);
  };

  return (
    <>
      <CollapsibleCard
        title={t("label-assignment-proctoring-title")}
        description={t("label-assignment-proctoring-description")}
        icon={<Robot className="h-5 w-5 text-blue-600" />}
      >
        <div className="flex items-center justify-between">
          <Switch
            checked={isProctoringEnable}
            onCheckedChange={handleProctoringToggle}
          />
        </div>

        {isProctoringEnable && (
          <div className="space-y-4 py-2">
            <Button onClick={() => setIsModalOpen(true)}>
              {t("btn-settings")}
            </Button>
          </div>
        )}
      </CollapsibleCard>

      <ProctoringSettingsModal
        proctoringSettings={assignment.settings.proctoring_settings}
        applicationType={assignment.application}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSettingsChange={handleProctoringSettingsChange}
      />
    </>
  );
};

export default AssignmentProctoringComponent;
