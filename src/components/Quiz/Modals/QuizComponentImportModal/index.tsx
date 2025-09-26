// QuizComponentImportModal.tsx
import React, { useState, useEffect } from "react";
import ModalWrapper from "./ModalWrapper";
import QuestionTypeSection from "./QuestionTypeSection";
import FileUploadSection from "./FileUploadSection";
import AdditionalSettingsSection from "./AdditionalSettingsSection";
import RowsMappingSection from "./RowsMappingSection";
import ModalFooter from "./ModalFooter";
import WordToCreateTest from "./WordToCreateTest/WordToCreateTest";

const QuizComponentImportModal: React.FC<{
  assessmentType?: string;
  assessment?: any;
  isVisible: boolean;
  onClose: () => void;
  onCreated?: () => void;
  onFinished?: () => void;
  t: (key: string) => string;
}> = ({
  assessmentType,
  assessment,
  isVisible,
  onClose,
  onCreated,
  onFinished,
  t,
}) => {
  const [isVisibleState, setIsVisibleState] = useState(false);
  const [shortenLetterState, setShortenLetterState] = useState(true);
  const [additionalSettingsState, setAdditionalSettingsState] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [postData, setPostData] = useState<any>({
    assessment: null,
    assessment_id: null,
    type: null,
    file: null,
    offset: 0,
    rows: {},
    settings: {
      groups: {},
      variants: {},
    },
  });
  const [questionTypes, setQuestionTypes] = useState<any[]>([]);
  const [difficultTypes, setDifficultTypes] = useState<any[]>([]);
  const [variantTypes, setVariantTypes] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

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

  const letterValues = (() => {
    let values: any[] = [];

    if (postData.type === "free_question") {
      values = [
        { id: "question", label: t("label-import-quiz-question") },
        { id: "answer-item", label: t("label-import-quiz-answer-item") },
        { id: "answer-true", label: t("label-import-quiz-answer-true") },
      ];
    } else if (postData.type === "open_question") {
      values = [
        { id: "question", label: t("label-import-quiz-question") },
        { id: "answer", label: t("label-import-quiz-answer") },
      ];
    } else if (postData.type === "fill_space_question") {
      values = [
        { id: "question", label: t("label-import-quiz-question") },
        { id: "answer", label: t("label-import-quiz-answer") },
      ];
    }

    return values.concat([
      { id: "id", label: t("label-import-quiz-id") },
      { id: "position", label: t("label-import-quiz-position") },
      {
        id: "score-encouragement",
        label: t("label-import-quiz-points-encouragement"),
      },
      { id: "score-penalty", label: t("label-import-quiz-points-penalty") },
      { id: "group", label: t("label-import-quiz-difficult") },
      { id: "variant", label: t("label-import-quiz-variant") },
    ]);
  })();

  const allowImport = postData.type && postData.file;

  useEffect(() => {
    if (isVisible) {
      setIsVisibleState(true);
      setQuestionTypes([
        { raw: "free_question", label: "Free Question" },
        { raw: "open_question", label: "Open Question" },
        { raw: "fill_space_question", label: "Fill Space Question" },
      ]);

      setDifficultTypes([
        { raw: "easy", name: "Easy" },
        { raw: "medium", name: "Medium" },
        { raw: "hard", name: "Hard" },
      ]);

      setVariantTypes([
        { raw: "variant_a", name: "Variant A" },
        { raw: "variant_b", name: "Variant B" },
      ]);
    } else {
      setIsVisibleState(false);
    }
  }, [isVisible]);

  useEffect(() => {
    setPostData((prev) => ({
      ...prev,
      rows: {},
    }));
  }, [postData.type]);

  useEffect(() => {
    if (uploadedFile) {
      setPostData((prev) => ({
        ...prev,
        file: uploadedFile.file_url,
      }));
    }
  }, [uploadedFile]);

  const handleFileUpload = (fileData: any) => {
    setUploadedFile(fileData.file);
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const showAdditionalSettings = () => {
    setAdditionalSettingsState(!additionalSettingsState);
  };

  const createTask = () => {
    const isConfirmed = window.confirm("Confirm import?");
    if (!isConfirmed) return;

    console.log("Creating task with ", postData);
    setTimeout(() => {
      if (onCreated) onCreated();
      if (onFinished) onFinished();
    }, 1000);
  };

  const handleTypeChange = (type: string) => {
    setPostData((prev) => ({
      ...prev,
      type,
    }));
  };

  const handleRowChange = (letter: string, value: string) => {
    setPostData((prev) => ({
      ...prev,
      rows: {
        ...prev.rows,
        [letter]: value,
      },
    }));
  };

  const handleOffsetChange = (offset: string) => {
    setPostData((prev) => ({
      ...prev,
      offset: parseInt(offset) || 0,
    }));
  };

  const handleSettingChange = (key: string, value: any) => {
    setPostData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value,
      },
    }));
  };

  const handleGroupChange = (group: string, value: string) => {
    setPostData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        groups: {
          ...prev.settings.groups,
          [group]: value,
        },
      },
    }));
  };

  const handleVariantChange = (variant: string, value: string) => {
    setPostData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        variants: {
          ...prev.settings.variants,
          [variant]: value,
        },
      },
    }));
  };

  const toggleLetterList = () => {
    setShortenLetterState(!shortenLetterState);
  };

  if (!isVisibleState) return null;

  return <WordToCreateTest isOpen={isVisibleState} onClose={onClose} />;

  return (
    <div className="fixed inset-0 z-50">
      <ModalWrapper isVisible={isVisibleState} onClose={onClose}>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            <QuestionTypeSection
              questionTypes={questionTypes}
              postData={postData}
              errors={errors}
              t={t}
              onTypeChange={handleTypeChange}
            />

            <FileUploadSection
              uploadedFile={uploadedFile}
              errors={errors}
              t={t}
              onFileUpload={handleFileUpload}
              onRemoveFile={removeFile}
            />

            <AdditionalSettingsSection
              additionalSettingsState={additionalSettingsState}
              postData={postData}
              difficultTypes={difficultTypes}
              variantTypes={variantTypes}
              errors={errors}
              t={t}
              onToggle={showAdditionalSettings}
              onOffsetChange={handleOffsetChange}
              onSettingChange={handleSettingChange}
              onGroupChange={handleGroupChange}
              onVariantChange={handleVariantChange}
            />

            <RowsMappingSection
              letterList={letterList}
              postData={postData}
              letterValues={letterValues}
              shortenLetterState={shortenLetterState}
              errors={errors}
              t={t}
              onRowChange={handleRowChange}
              onToggleLetterList={toggleLetterList}
            />
          </div>
          <div className="p-6">
            <ModalFooter
              allowImport={allowImport}
              t={t}
              onStartImport={createTask}
              onCancel={onClose}
            />
          </div>
        </div>
      </ModalWrapper>
    </div>
  );
};

export default QuizComponentImportModal;
