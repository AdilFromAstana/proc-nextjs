"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";

// shadcn-ui компоненты
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Кастомные компоненты
import AssignmentListModalComponent, {
  AssignmentListModalRef,
} from "@/components/Assignment/ListModalComponent";
import EntityListComponent from "@/components/ui/EntityList";
import AssignmentStatusComponent from "@/components/Assignment/UI/StatusComponent";

// Типы
import { Assignment } from "@/types/assignment";

// Хуки
import { useAssignmentTypes } from "@/hooks/useAssignmentTypes";

interface ExportSettings {
  show_answers: boolean;
  variant_group: boolean;
  difficult_group: boolean;
  only_started: boolean;
  only_finished: boolean;
  rows: Record<string, string>;
}

interface LetterValue {
  id: string;
  label: string;
}

interface AssignmentExportModalComponentProps {
  assignment?: Assignment | null; // Если передается конкретное задание
}

// Интерфейс для ref методов
export interface AssignmentExportModalRef {
  open: () => void;
  close: () => void;
}

const AssignmentExportModalComponent = React.forwardRef<
  AssignmentExportModalRef,
  AssignmentExportModalComponentProps
>(({ assignment = null }, ref) => {
  const { t } = useTranslation();
  const { getTypeName } = useAssignmentTypes();

  // Refs
  const assignmentListModalRef = useRef<AssignmentListModalRef>(null);
  const exportBtnRef = useRef<HTMLButtonElement>(null);

  // Состояния
  const [isOpen, setIsOpen] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignments, setSelectedAssignments] = useState<Assignment[]>(
    []
  );
  const [shortenLetterState, setShortenLetterState] = useState(true);
  const [additionalSettingsState, setAdditionalSettingsState] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Настройки экспорта
  const [settings, setSettings] = useState<ExportSettings>({
    show_answers: true,
    variant_group: false,
    difficult_group: false,
    only_started: false,
    only_finished: false,
    rows: {
      a: "assignment",
      b: "userid",
      c: "username",
      d: "answered",
      e: "starting-at",
      f: "ending-at",
      g: "violations",
      h: "results",
      i: "points",
    },
  });

  // Методы для ref
  const open = () => {
    if (assignment && !assignment.id) {
      alert(
        t("notify-export-assignment-empty") || "Cannot export empty assignment"
      );
      return;
    }

    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  // Делаем методы доступными через ref
  React.useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  // Вычисляемые свойства
  const letters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  const shortenLetterList = letters.slice(0, 9);
  const longestLetterList = letters;
  const letterList = shortenLetterState ? shortenLetterList : longestLetterList;

  const letterValues: LetterValue[] = [
    { id: "assignment", label: t("label-export-assignment-name") || "" },
    { id: "userid", label: t("label-export-assignment-userid") || "" },
    { id: "fullname", label: t("label-export-assignment-fullname") || "" },
    { id: "email", label: t("label-export-assignment-email") || "" },
    { id: "username", label: t("label-export-assignment-username") || "" },
    { id: "phone", label: t("label-export-assignment-phone") || "" },
    {
      id: "description",
      label: t("label-export-assignment-description") || "",
    },
    {
      id: "invite-code",
      label: t("label-export-assignment-invite-code") || "",
    },
    { id: "results", label: t("label-export-assignment-results") || "" },
    { id: "points", label: t("label-export-assignment-points") || "" },
    { id: "score", label: t("label-export-assignment-score") || "" },
    { id: "answered", label: t("label-export-assignment-answered") || "" },
    {
      id: "starting-at",
      label: t("label-export-assignment-starting-at") || "",
    },
    { id: "ending-at", label: t("label-export-assignment-ending-at") || "" },
    {
      id: "credibility",
      label: t("label-export-assignment-credibility") || "",
    },
    { id: "violations", label: t("label-export-assignment-violations") || "" },
    { id: "head_empty", label: t("label-export-assignment-head-empty") || "" },
    { id: "head_many", label: t("label-export-assignment-head-many") || "" },
    { id: "head_depth", label: t("label-export-assignment-head-depth") || "" },
    {
      id: "head_rotate",
      label: t("label-export-assignment-head-rotate") || "",
    },
    { id: "focus_down", label: t("label-export-assignment-focus-down") || "" },
    { id: "copy_paste", label: t("label-export-assignment-copy-paste") || "" },
    { id: "screen", label: t("label-export-assignment-screen-share") || "" },
    {
      id: "main-camera",
      label: t("label-export-assignment-main-camera") || "",
    },
    {
      id: "second-camera",
      label: t("label-export-assignment-second-camera") || "",
    },
    { id: "report-url", label: t("label-export-assignment-report-url") || "" },

    // TODO: Удалить после релиза FormBuilder
    {
      id: "almaty-daryn-school-name",
      label: t("label-export-almaty-daryn-school-name") || "",
    },
    {
      id: "almaty-daryn-district-name",
      label: t("label-export-almaty-daryn-district-name") || "",
    },
    {
      id: "almaty-daryn-teacher-name",
      label: t("label-export-almaty-daryn-teacher-name") || "",
    },

    // TODO: Удалить после релиза FormBuilder
    {
      id: "aqmo-modo-school-name",
      label: t("label-export-aqmo-modo-school-name") || "",
    },
    {
      id: "aqmo-modo-district-name",
      label: t("label-export-aqmo-modo-district-name") || "",
    },

    // TODO: Удалить после релиза FormBuilder
    {
      id: "cpfed-region-name",
      label: t("label-export-cpfed-region-name") || "",
    },
    { id: "cpfed-city-name", label: t("label-export-cpfed-city-name") || "" },
    {
      id: "cpfed-school-name",
      label: t("label-export-cpfed-school-name") || "",
    },
    { id: "cpfed-class-name", label: t("label-export-cpfed-class-name") || "" },
    {
      id: "cpfed-parent-name",
      label: t("label-export-cpfed-parent-name") || "",
    },
    {
      id: "cpfed-parent-phone",
      label: t("label-export-cpfed-parent-phone") || "",
    },
  ];

  const assignmentIds = assignment
    ? [assignment.id]
    : assignments.map((a) => a.id);

  const allowExport = true;

  // Методы
  const showAdditionalSettings = () => {
    setAdditionalSettingsState(!additionalSettingsState);
  };

  const showAssignmentListModal = () => {
    assignmentListModalRef.current?.open();
  };

  const onAssignmentsSelected = (newAssignments: Assignment[]) => {
    setAssignments((prev) => [...prev, ...newAssignments]);
  };

  const onAssignmentsSelectedForDelete = (selected: Assignment[]) => {
    setSelectedAssignments(selected);
  };

  const removeSelectedAssignments = () => {
    setAssignments((prev) =>
      prev.filter((a) => !selectedAssignments.some((sa) => sa.id === a.id))
    );
    setSelectedAssignments([]);
  };

  const handleRowChange = (letter: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      rows: {
        ...prev.rows,
        [letter]: value,
      },
    }));
  };

  const exportAssignment = async () => {
    try {
      // Показываем loader
      if (exportBtnRef.current) {
        exportBtnRef.current.disabled = true;
        exportBtnRef.current.textContent =
          (t("btn-export-assignment-start-export") || "Export") + "...";
      }

      // Формируем данные для отправки
      const postData = {
        assignments: assignmentIds,
        ...settings,
      };

      // Здесь должен быть реальный API вызов
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Export data:", postData);

      // Скрываем loader
      if (exportBtnRef.current) {
        exportBtnRef.current.disabled = false;
        exportBtnRef.current.textContent =
          t("btn-export-assignment-start-export") || "Export";
      }
    } catch (error) {
      console.error("Export error:", error);

      // Обработка ошибок
      if (exportBtnRef.current) {
        exportBtnRef.current.disabled = false;
        exportBtnRef.current.textContent =
          t("btn-export-assignment-start-export") || "Export";
      }
    }
  };

  // Рендер данных задания в списке
  const renderAssignmentData = (entity: Assignment) => {
    return (
      <div className="relative">
        <div className="flex items-center">
          <div>
            <span className="text-black text-base font-semibold">
              {entity.getName()}
            </span>
            <span
              className={`ml-2.5 px-1.5 py-1 text-xs font-medium rounded text-gray-700 bg-gray-100`}
            >
              {getTypeName(entity.type)}
            </span>
          </div>
        </div>

        {entity.class && (
          <div className="mt-1 text-gray-500 text-sm font-normal">
            {entity.getClassName()}
          </div>
        )}

        <div className="absolute top-1/2 right-5 transform -translate-y-1/2">
          <AssignmentStatusComponent status={entity.status} size="small" />
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl assignment-export-modal">
          <DialogHeader>
            <DialogTitle>{t("label-export-assignment-title")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
            {/* ВЫБОР ЗАДАНИЙ */}
            {!assignment && (
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">
                    {t("label-export-assignment-list")}
                  </Label>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button onClick={showAssignmentListModal} variant="default">
                      + {t("btn-select-assignments")}
                    </Button>

                    {assignments.length > 0 && (
                      <Button
                        onClick={removeSelectedAssignments}
                        variant="destructive"
                      >
                        × {t("btn-deselect-assignments")}
                      </Button>
                    )}
                  </div>
                </div>

                {/* СПИСОК ВЫБРАННЫХ ЗАДАНИЙ */}
                {assignments.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <EntityListComponent
                      entities={assignments}
                      bordered={true}
                      selectable={true}
                      multiple={true}
                      selectOnClick={true}
                      pagination={false}
                      values={{ letter: (item: Assignment) => item.getName() }}
                      entityProps={{ hideLabels: true }}
                      onSelected={onAssignmentsSelectedForDelete}
                      renderData={renderAssignmentData}
                    />
                  </div>
                )}

                {/* МОДАЛЬНОЕ ОКНО СПИСКА ЗАДАНИЙ */}
                <AssignmentListModalComponent
                  ref={assignmentListModalRef}
                  multiple={true}
                  onSelected={onAssignmentsSelected}
                />
              </div>
            )}

            {/* ДОПОЛНИТЕЛЬНЫЕ НАСТРОЙКИ */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">
                  {t("label-export-assignment-settings")}
                </Label>
                <Button
                  onClick={showAdditionalSettings}
                  variant="outline"
                  className="mt-2"
                >
                  ⚙️ {t("btn-export-assignment-show-additional-settings")}
                </Button>
              </div>

              {/* ФОРМА ДОПОЛНИТЕЛЬНЫХ НАСТРОЕК */}
              {additionalSettingsState && (
                <div className="border rounded-lg p-4 space-y-4">
                  {/* ПОКАЗ ОТВЕТОВ */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("label-export-assignment-show-answers")}</Label>
                      <p className="text-sm text-gray-500">
                        {t("hint-export-assignment-show-answers")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.show_answers}
                      onCheckedChange={(checked: boolean) =>
                        setSettings((prev) => ({
                          ...prev,
                          show_answers: checked,
                        }))
                      }
                    />
                  </div>

                  {/* ГРУППИРОВКА ПО ВАРИАНТАМ */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>
                        {t("label-export-assignment-group-variant")}
                      </Label>
                      <p className="text-sm text-gray-500">
                        {t("hint-export-assignment-group-variant")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.variant_group}
                      onCheckedChange={(checked: boolean) =>
                        setSettings((prev) => ({
                          ...prev,
                          variant_group: checked,
                        }))
                      }
                    />
                  </div>

                  {/* ГРУППИРОВКА ПО СЛОЖНОСТИ */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>
                        {t("label-export-assignment-group-difficult")}
                      </Label>
                      <p className="text-sm text-gray-500">
                        {t("hint-export-assignment-group-difficult")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.difficult_group}
                      onCheckedChange={(checked: boolean) =>
                        setSettings((prev) => ({
                          ...prev,
                          difficult_group: checked,
                        }))
                      }
                    />
                  </div>

                  {/* ФИЛЬТРЫ */}
                  <div>
                    <Label>{t("label-export-assignment-filtering")}</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={settings.only_started}
                          onCheckedChange={(checked: boolean) =>
                            setSettings((prev) => ({
                              ...prev,
                              only_started: checked,
                            }))
                          }
                        />
                        <Label>
                          {t("label-export-assignment-only-is-started")}
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={settings.only_finished}
                          onCheckedChange={(checked: boolean) =>
                            setSettings((prev) => ({
                              ...prev,
                              only_finished: checked,
                            }))
                          }
                        />
                        <Label>
                          {t("label-export-assignment-only-is-finished")}
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* СТОЛБЦЫ */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">
                  {t("label-export-assignment-rows")}
                </Label>
                <p className="text-sm text-gray-500">
                  {t("hint-export-assignment-rows")}
                </p>
              </div>

              {/* СПИСОК СТОЛБЦОВ */}
              <div className="bg-gray-100 rounded-md shadow">
                {letterList.map((letter) => (
                  <div
                    key={`letter-${letter}`}
                    className="flex items-center p-4 border-b last:border-b-0"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded font-bold text-gray-700 mr-4">
                      {letter.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <Select
                        value={settings.rows[letter] || ""}
                        onValueChange={(value) =>
                          handleRowChange(letter, value)
                        }
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue
                            placeholder={t(
                              "placeholder-export-assignment-letter-value"
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {letterValues.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>

              {/* ОШИБКИ */}
              {errors.rows && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.rows[0]}</AlertDescription>
                </Alert>
              )}

              {/* КНОПКИ ПОКАЗА БОЛЬШЕ/МЕНЬШЕ */}
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShortenLetterState(!shortenLetterState)}
                >
                  {shortenLetterState
                    ? t("btn-export-assignment-show-more")
                    : t("btn-export-assignment-show-less")}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              ref={exportBtnRef}
              onClick={exportAssignment}
              disabled={!allowExport}
              variant="default"
            >
              {t("btn-export-assignment-start-export")}
            </Button>
            <Button onClick={close} variant="destructive">
              {t("btn-export-assignment-cancel-export")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

AssignmentExportModalComponent.displayName = "AssignmentExportModalComponent";

export default AssignmentExportModalComponent;
