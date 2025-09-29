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
  const [showSettings, setShowSettings] = useState(false);

  const getCameraMode = () => {
    if (!recordValue && !uploadValue) return "Отключено";
    if (recordValue && !uploadValue) return "Стриминг";
    if (!recordValue && uploadValue) return "Запись";
    if (recordValue && uploadValue) return "Стриминг"; // Если оба true, считаем стримингом
    return "Отключено";
  };

  const mode = getCameraMode();

  const handleModeChange = (newMode: string) => {
    onModeChange?.(newMode);
  };

  const getModeDescription = () => {
    if (mode === "Стриминг") {
      return "В данном режиме будет осуществлена прямая трансляция (SFU) и запись. Требуется стабильное интернет-соединение";
    }
    if (mode === "Запись") {
      return "В данном режиме будет осуществлена прямая трансляция (P2P) и запись. Не зависит от качества интернет-соединения";
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
        {["Отключено", "Стриминг", "Запись"].map((option) => (
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

      {mode !== "Отключено" && (
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
                {showSettings ? "Скрыть настройки" : "Настройки"}
              </button>

              {showSettings && (
                <div className="ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
                  {filteredSettings.map((setting, index) => (
                    <SwitchParameter
                      key={index}
                      label={setting.label}
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
      case "Отключено":
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
      case "Стриминг":
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
      case "Запись":
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
        label:
          "Отслеживание действий (Client-Side): Включить отслеживание действий пользователя на стороне клиента",
        value: numericToBoolean(settings.head_tracking_client),
        onCheckedChange: (checked: boolean) =>
          handleSwitchChange("head_tracking_client", checked),
      },
      {
        label:
          "Отслеживание действий (Post Server-Side): Включить отслеживание действий пользователя на стороне сервера (Post)",
        value: numericToBoolean(settings.head_tracking_server_post),
        onCheckedChange: (checked: boolean) =>
          handleSwitchChange("head_tracking_server_post", checked),
      },
      {
        label:
          "Отслеживание действий (RealTime Server-Side): Включить отслеживание действий пользователя на стороне сервера (RealTime)",
        value: numericToBoolean(settings.head_tracking_server_realtime),
        onCheckedChange: (checked: boolean) =>
          handleSwitchChange("head_tracking_server_realtime", checked),
        hidden: mainCameraMode !== "Стриминг",
      },
      {
        label: "Eye Tracking: Отслеживание зрачков",
        value: numericToBoolean(settings.head_tracking_server),
        onCheckedChange: (checked: boolean) =>
          handleSwitchChange("head_tracking_server", checked),
      },
      {
        label: "Object Detection: Обнаружение предметов",
        value: numericToBoolean(settings.object_detect),
        onCheckedChange: (checked: boolean) =>
          handleSwitchChange("object_detect", checked),
      },
    ];

    return mainCameraMode === "Отключено" ? [] : settingsList;
  };

  // Вспомогательная функция для определения режима камеры
  const getCameraMode = (record: boolean, upload: boolean) => {
    if (!record && !upload) return "Отключено";
    if (record && !upload) return "Стриминг";
    if (!record && upload) return "Запись";
    return "Стриминг";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Прокторинг</DialogTitle>
          <DialogDescription>Конфигурация параметров</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <SelectParameter
            label="Приложение"
            description="Выберите тип приложения"
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
              label="Браузер"
              description="Разрешенные браузеры"
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
                Перед началом экзамена, потребуется загрузить и установить
                приложение
              </div>
            </div>
          )}

          <CameraParameter
            label="Фронтальная камера"
            description="Включить запись фронтальной камеры"
            recordValue={numericToBoolean(settings.main_camera_record)}
            uploadValue={numericToBoolean(settings.main_camera_upload)}
            onModeChange={(mode) => handleCameraModeChange("main", mode)}
            additionalSettings={getFrontCameraSettings()}
          />

          <CameraParameter
            label="Внешняя камера"
            description="Будет задействовано дополнительное устройство для записи. Захват видеопотока камеры мобильного устройства."
            recordValue={numericToBoolean(settings.second_camera_record)}
            uploadValue={numericToBoolean(settings.second_camera_upload)}
            onModeChange={(mode) => handleCameraModeChange("second", mode)}
          />

          <CameraParameter
            label="Экран"
            description="Включить запись рабочего стола (экрана)"
            recordValue={numericToBoolean(settings.screen_share_record)}
            uploadValue={numericToBoolean(settings.screen_share_upload)}
            onModeChange={(mode) => handleCameraModeChange("screen", mode)}
          />

          <CameraParameter
            label="Детектор микронаушников"
            description="Требуется обязательное подключение 'Детектор микронаушников У.М.' к устройству."
            recordValue={numericToBoolean(settings.second_microphone_record)}
            uploadValue={numericToBoolean(settings.second_microphone_upload)}
            onModeChange={(mode) => handleCameraModeChange("microphone", mode)}
          />

          <SwitchParameter
            label="Фото Идентификация"
            description="Включить идентификацию лица по фотографии"
            checked={numericToBoolean(settings.photo_head_identity)}
            onCheckedChange={(checked) =>
              handleSwitchChange("photo_head_identity", checked)
            }
          />

          <SwitchParameter
            label="Видео Идентификация"
            description="Включить идентификацию лица по видео"
            checked={numericToBoolean(settings.video_head_identity)}
            onCheckedChange={(checked) =>
              handleSwitchChange("video_head_identity", checked)
            }
          />

          <SwitchParameter
            label="Верификация"
            description="Идентификация по удостоверению личности"
            checked={numericToBoolean(settings.id_verification)}
            onCheckedChange={(checked) =>
              handleSwitchChange("id_verification", checked)
            }
          />

          <SwitchParameter
            label="Детекция шумов"
            description="Включить детекцию шумов"
            checked={numericToBoolean(settings.noise_detector)}
            onCheckedChange={(checked) =>
              handleSwitchChange("noise_detector", checked)
            }
          />

          <SwitchParameter
            label="Детекция голоса"
            description="Включить детекцию голоса"
            checked={numericToBoolean(settings.speech_detector)}
            onCheckedChange={(checked) =>
              handleSwitchChange("speech_detector", checked)
            }
          />

          <SwitchParameter
            label="Устройства отображения"
            description="Включить проверку на наличие подключенных мониторов, проекторов, TV"
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
            label="Content Protect"
            description="Запрет передачи содержимого вопроса от удаленных пользователей"
            checked={numericToBoolean(settings.content_protect)}
            onCheckedChange={(checked) =>
              handleSwitchChange("content_protect", checked)
            }
          />

          <SwitchParameter
            label="Полноэкранный режим"
            description="Включить полноэкранный режим"
            checked={numericToBoolean(settings.fullscreen_mode)}
            onCheckedChange={(checked) =>
              handleSwitchChange("fullscreen_mode", checked)
            }
          />

          <SwitchParameter
            label="Буфер обмена"
            description="Включить чтение буфера обмена"
            checked={numericToBoolean(settings.read_clipboard)}
            onCheckedChange={(checked) =>
              handleSwitchChange("read_clipboard", checked)
            }
          />

          <SwitchParameter
            label="Фокус мыши"
            description="Включить отслеживание фокуса мыши"
            checked={numericToBoolean(settings.focus_detector)}
            onCheckedChange={(checked) =>
              handleSwitchChange("focus_detector", checked)
            }
          />

          <SwitchParameter
            label="Вспомогательные расширения"
            description="Включить проверку на наличие вспомогательных расширений"
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
              className="text-blue-600 hover:text-blue-800 font-medium text-lg"
            >
              {showAdvanced
                ? "Скрыть расширенные настройки"
                : "Расширенные настройки"}
            </button>

            {showAdvanced && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <InputParameter
                  label="Интервал распознавания действий"
                  description="Интервал распознавания действий в миллисекундах. Чем меньше значение, тем больше нагрузка на CPU/GPU (Client-Side)"
                  value={settings.head_recognize_interval || ""}
                  placeholder="Интервал распознавания действий"
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("head_recognize_interval", value)
                  }
                />

                {/* 2. Интервал распознавания лица */}
                <InputParameter
                  label="Интервал распознавания лица"
                  description="Интервал проверки подмены лица"
                  value={settings.head_compare_interval || ""}
                  placeholder="Интервал распознавания лица"
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("head_compare_interval", value)
                  }
                />

                {/* 3. Чувствительность поворота головы по X */}
                <InputParameter
                  label="Чувствительность поворота головы (X)"
                  description="Допустимое значение поворота головы по оси X"
                  value={settings.head_x_sensitivity || ""}
                  placeholder="Чувствительность поворота головы по X"
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("head_x_sensitivity", value)
                  }
                />

                {/* 4. Чувствительность поворота головы по Y */}
                <InputParameter
                  label="Чувствительность поворота головы (Y)"
                  description="Допустимое значение поворота головы по оси Y"
                  value={settings.head_y_sensitivity || ""}
                  placeholder="Чувствительность поворота головы по Y"
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("head_y_sensitivity", value)
                  }
                />

                {/* 5. Чувствительность отдаления головы */}
                <InputParameter
                  label="Чувствительность отдаления головы"
                  description="Допустимое значение отдаления головы по оси Z"
                  value={settings.head_depth_sensitivity || ""}
                  placeholder="Чувствительность отдаления головы"
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("head_depth_sensitivity", value)
                  }
                />

                {/* 6. Толерантность поворота головы */}
                <InputParameter
                  label="Толерантность поворота головы"
                  description="Время в миллисекундах. При котором пользователю разрешено находиться в запрещенном положении. При достижении указанного значения, нарушение будет зафиксировано"
                  value={settings.head_tolerance_seconds || ""}
                  placeholder="Толерантность поворота головы"
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("head_tolerance_seconds", value)
                  }
                />

                {/* 7. Чувствительность микрофона к шуму */}
                <InputParameter
                  label="Чувствительность микрофона к шуму"
                  description="Чувствительность микрофона в децибелах (dB) к шуму. При превышении порога dB, сработает счетчик захвата кадров"
                  value={settings.noise_sensitivity || ""}
                  placeholder="Чувствительность микрофона к шуму"
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("noise_sensitivity", value)
                  }
                />

                {/* 8. Счетчик кадров шума */}
                <InputParameter
                  label="Счетчик кадров шума"
                  description="Счетчик захвата количества последовательных кадров превышения dB. При достижении значении счетчика сработает триггер нарушения"
                  value={settings.noise_tolerance_frames || ""}
                  placeholder="Счетчик кадров шума"
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("noise_tolerance_frames", value)
                  }
                />

                {/* 9. Толерантность к шуму */}
                <InputParameter
                  label="Толерантность к шуму"
                  description="Время в миллисекундах. В течении этого времени пользователю необходимо устранить все шумы, иначе будет зафиксировано нарушение"
                  value={settings.noise_tolerance_seconds || ""}
                  placeholder="Толерантность к шуму"
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("noise_tolerance_seconds", value)
                  }
                />

                {/* 10. Толерантность к потере фокуса */}
                <InputParameter
                  label="Толерантность к потере фокуса"
                  description="Время в миллисекундах. В течении указанного времени, пользователю необходимо вернуть указатель (фокус) на вкладку с заданием, иначе будет зафиксировано нарушение"
                  value={settings.focus_tolerance_seconds || ""}
                  placeholder="Толерантность к потере фокуса"
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("focus_tolerance_seconds", value)
                  }
                />

                {/* 11. Таймаут подключения */}
                <InputParameter
                  label="Таймаут подключения"
                  description="Время в миллисекундах. Таймаут подключения к серверу захвата видеопотока. При достижении указанного времени, функция записи камеры / рабочего стола будет отключена"
                  value={settings.rtc_connection_timeout || ""}
                  placeholder="Таймаут подключения"
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("rtc_connection_timeout", value)
                  }
                />

                {/* 12. Таймаут инициализации */}
                <InputParameter
                  label="Таймаут инициализации"
                  description="Таймаут инициализации библиотеки распознавания действий пользователя. При достижении указанного времени, функция идентификации и фиксации нарушений действий пользователя будет отключена"
                  value={settings.facemodel_init_timeout || ""}
                  placeholder="Таймаут инициализации"
                  type="number"
                  onValueChange={(value) =>
                    handleInputChange("facemodel_init_timeout", value)
                  }
                />

                {/* 13. Mobile Restrict */}
                <div className="col-span-2">
                  <SwitchParameter
                    label="Mobile Restrict"
                    description="Запретить сдачу через мобильные устройства (веб-браузер)"
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
                    label="Fallback"
                    description="При невозможности подключения выше активированных опций у пользователя - пропускать шаг"
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
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AssignmentProctoringComponent: React.FC<
  AssignmentProctoringComponentProps
> = ({ assignment, errors = {}, onAssignmentChange }) => {
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
        title="Прокторинг"
        description="Процедура наблюдения и контроля за дистанционным испытанием"
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
              Настройки прокторинга
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
