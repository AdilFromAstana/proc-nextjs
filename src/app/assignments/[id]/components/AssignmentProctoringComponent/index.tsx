import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AssignmentDetail } from "@/types/assignment/detail";
import CollapsibleCard from "@/components/Oqylyk/Assignment/CollapsibleCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AssignmentProctoringComponentProps {
  assignment: AssignmentDetail;
  errors?: Record<string, string[]>;
  onAssignmentChange: (assignment: AssignmentDetail) => void;
}

interface ProctoringSettingsModalProps {
  assignment: AssignmentDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const ProctoringSettingsModal: React.FC<ProctoringSettingsModalProps> = ({
  assignment,
  open,
  onOpenChange,
}) => {
  const proctoringSettings = Object.entries(
    assignment.settings?.proctoring_settings || {}
  );

  // Словарь с описаниями параметров
  const settingDescriptions: Record<string, string> = {
    check_env: "Проверка окружения",
    browser_type: "Тип браузера",
    head_tracking: "Отслеживание головы",
    object_detect: "Object Detection",
    displays_check: "Устройства отображения",
    focus_detector: "Фокус мыши",
    noise_detector: "Детекция шумов",
    read_clipboard: "Буфер обмена",
    content_protect: "Content Protect",
    face_landmarker: "Маркировщик лица",
    fullscreen_mode: "Полноэкранный режим",
    id_verification: "Верификация",
    speech_detector: "Детекция голоса",
    mute_frames_count: "Количество кадров без звука",
    noise_sensitivity: "Чувствительность микрофона к шуму",
    extension_detector: "Вспомогательные расширения",
    head_x_sensitivity: "Чувствительность поворота головы X",
    head_y_sensitivity: "Чувствительность поворота головы Y",
    main_camera_record: "Запись основной камеры",
    main_camera_upload: "Загрузка основной камеры",
    quite_frames_count: "Количество тихих кадров",
    photo_head_identity: "Фото Идентификация",
    screen_share_record: "Запись экрана",
    screen_share_upload: "Загрузка экрана",
    video_head_identity: "Видео Идентификация",
    head_tracking_client: "Клиентское отслеживание головы",
    head_tracking_server: "Серверное отслеживание головы",
    second_camera_record: "Запись второй камеры",
    second_camera_upload: "Загрузка второй камеры",
    head_compare_interval: "Интервал распознавания лица",
    main_camera_blackhole: "Черная дыра основной камеры",
    speech_pre_pad_frames: "Кадры перед речью",
    head_depth_sensitivity: "Чувствительность отдаления головы",
    head_position_interval: "Интервал позиции головы",
    head_tolerance_seconds: "Толерантность поворота головы",
    noise_tolerance_frames: "Счетчик кадров шума",
    object_detect_interval: "Интервал детекции объектов",
    screen_share_blackhole: "Черная дыра экрана",
    focus_tolerance_seconds: "Толерантность к потере фокуса",
    head_center_area_size_x: "Размер центральной области X",
    head_center_area_size_y: "Размер центральной области Y",
    noise_tolerance_seconds: "Толерантность к шуму",
    object_detect_threshold: "Порог детекции объектов",
    second_camera_blackhole: "Черная дыра второй камеры",
    second_microphone_label: "Метка второго микрофона",
    speech_min_frames_count: "Минимальное количество кадров речи",
    face_landmarker_interval: "Интервал маркировщика лица",
    head_position_confidence: "Уверенность позиции головы",
    object_detect_categories: "Категории детекции объектов",
    second_microphone_record: "Запись второго микрофона",
    second_microphone_upload: "Загрузка второго микрофона",
    silent_tolerance_seconds: "Толерантность к тишине",
    speech_tolerance_seconds: "Толерантность к речи",
    face_landmarker_threshold: "Порог маркировщика лица",
    head_position_probability: "Вероятность позиции головы",
    head_tracking_server_post: "POST запрос отслеживания головы",
    speech_positive_threshold: "Порог положительной речи",
    face_landmarker_categories: "Категории маркировщика лица",
    second_microphone_blackhole: "Черная дыра второго микрофона",
    head_tracking_server_realtime: "Реалтайм отслеживания головы",
    head_compare_euclidean_distance: "Евклидово расстояние сравнения",
  };

  // Функция для определения, является ли значение boolean (включая 0/1)
  const isBooleanValue = (key: string, value: any): boolean => {
    const booleanKeys = [
      "check_env",
      "focus_detector",
      "noise_detector",
      "content_protect",
      "face_landmarker",
      "fullscreen_mode",
      "id_verification",
      "speech_detector",
      "extension_detector",
      "main_camera_record",
      "main_camera_upload",
      "photo_head_identity",
      "screen_share_record",
      "screen_share_upload",
      "video_head_identity",
      "head_tracking_client",
      "head_tracking_server",
      "second_camera_record",
      "second_camera_upload",
      "main_camera_blackhole",
      "screen_share_blackhole",
      "second_camera_blackhole",
      "second_microphone_record",
      "second_microphone_upload",
      "second_microphone_blackhole",
      "head_tracking_server_post",
      "head_tracking_server_realtime",
    ];

    return booleanKeys.includes(key) || typeof value === "boolean";
  };

  // Функция для определения типа значения
  const getValueType = (
    key: string,
    value: any
  ): "boolean" | "number" | "string" | "object" => {
    if (isBooleanValue(key, value)) return "boolean";
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "number") return "number";
    if (typeof value === "string") return "string";
    return "object";
  };

  // Рендер значения в зависимости от типа
  const renderValue = (key: string, value: any) => {
    const type = getValueType(key, value);

    switch (type) {
      case "boolean":
        // Преобразуем 0/1 в boolean
        const booleanValue = typeof value === "number" ? value === 1 : value;
        return (
          <Switch
            checked={booleanValue}
            // onCheckedChange={(checked) => handleSettingChange(key, checked)}
            disabled
          />
        );

      case "object":
        return (
          <details className="text-xs">
            <summary className="cursor-pointer text-blue-600">
              Показать детали
            </summary>
            <pre className="bg-gray-100 p-2 rounded mt-1 max-w-xs overflow-x-auto">
              {JSON.stringify(value, null, 2)}
            </pre>
          </details>
        );

      default:
        return (
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
            {String(value)}
          </span>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Прокторинг</DialogTitle>
          <DialogDescription>Конфигурация параметров</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {proctoringSettings.length > 0 ? (
            proctoringSettings.map(([key, value]) => (
              <div
                key={key}
                className="flex items-start justify-between p-4 bg-white border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1 pr-4">
                  <div className="font-medium text-gray-900">
                    {settingDescriptions[key] || key}
                  </div>
                  {settingDescriptions[key] && (
                    <div className="text-xs text-gray-500 font-mono mt-1">
                      {key}
                    </div>
                  )}
                  {!settingDescriptions[key] && (
                    <div className="text-xs text-gray-400 italic mt-1">
                      Описание отсутствует
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">{renderValue(key, value)}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Настройки прокторинга отсутствуют
            </div>
          )}
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
  const [isProctoringEnable, setIsProctoringEnable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <CollapsibleCard
        title="Прокторинг"
        description="Процедура наблюдения и контроля за дистанционным испытанием"
        icon={<Robot className="h-5 w-5 text-blue-600" />}
      >
        <Switch
          checked={isProctoringEnable}
          onCheckedChange={() => setIsProctoringEnable(!isProctoringEnable)}
        />

        {isProctoringEnable && (
          <div className="space-y-4 py-2">
            <Button onClick={() => setIsModalOpen(true)}>Настройки</Button>
          </div>
        )}
      </CollapsibleCard>

      <ProctoringSettingsModal
        assignment={assignment}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};

export default AssignmentProctoringComponent;
