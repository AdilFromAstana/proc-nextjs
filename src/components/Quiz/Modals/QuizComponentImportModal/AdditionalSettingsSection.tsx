// components/modals/AdditionalSettingsSection.tsx
import BgdButton from "@/components/Chunks/BgdButton";
import BgdFormItem from "@/components/Chunks/BgdFormItem";
import React from "react";

interface AdditionalSettingsSectionProps {
  additionalSettingsState: boolean;
  postData: any;
  difficultTypes: any[];
  variantTypes: any[];
  errors: Record<string, string[]>;
  t: (key: string) => string;
  onToggle: () => void;
  onOffsetChange: (offset: string) => void;
  onSettingChange: (key: string, value: any) => void;
  onGroupChange: (group: string, value: string) => void;
  onVariantChange: (variant: string, value: string) => void;
}

const AdditionalSettingsSection: React.FC<AdditionalSettingsSectionProps> = ({
  additionalSettingsState,
  postData,
  difficultTypes,
  variantTypes,
  errors,
  t,
  onToggle,
  onOffsetChange,
  onSettingChange,
  onGroupChange,
  onVariantChange,
}) => {
  return (
    <>
      <BgdFormItem label={t("label-import-quiz-settings")}>
        <BgdButton color="blue" size="medium" onClick={onToggle}>
          ⚙️ {t("btn-show-additional-settings")}
        </BgdButton>
      </BgdFormItem>

      {additionalSettingsState && (
        <div className="mt-5 p-4 bg-gray-50 rounded">
          {/* OFFSET */}
          <BgdFormItem
            label={t("label-import-quiz-offset")}
            hint={t("hint-import-quiz-offset")}
            error={errors.offset ? errors.offset[0] : undefined}
          >
            <input
              type="number"
              value={postData.offset}
              onChange={(e) => onOffsetChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("placeholder-import-quiz-offset")}
            />
          </BgdFormItem>

          {/* SETTINGS FOR OPEN QUESTION */}
          {postData.type === "open_question" && (
            <div className="space-y-4 mt-4">
              <BgdFormItem
                label={t("label-allow-attachments")}
                hint={t("hint-allow-attachments")}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={postData.settings.attachments || false}
                    onChange={(e) =>
                      onSettingChange("attachments", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="ml-2 text-gray-700">
                    {t("label-allow-attachments")}
                  </span>
                </div>
              </BgdFormItem>

              <BgdFormItem
                label={t("label-enable-antiplagiarism")}
                hint={t("hint-enable-antiplagiarism")}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={postData.settings.antiplagiarism || false}
                    onChange={(e) =>
                      onSettingChange("antiplagiarism", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="ml-2 text-gray-700">
                    {t("label-enable-antiplagiarism")}
                  </span>
                </div>
              </BgdFormItem>
            </div>
          )}

          {/* SETTINGS FOR FILL SPACE QUESTION */}
          {postData.type === "fill_space_question" && (
            <div className="mt-4">
              <BgdFormItem
                label={t("label-fill-space-question-placeholder")}
                hint={t("hint-fill-space-question-placeholder")}
              >
                <input
                  type="text"
                  value={postData.settings.fill_space_placeholder || ""}
                  onChange={(e) =>
                    onSettingChange("fill_space_placeholder", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t("placeholder-fill-space-question-placeholder")}
                />
              </BgdFormItem>
            </div>
          )}

          {/* DIFFICULT GROUP SETTINGS */}
          {difficultTypes.length > 0 && (
            <BgdFormItem
              label={t("label-import-quiz-difficult-group")}
              hint={t("hint-import-quiz-difficult-group")}
            >
              <div className="w-full">
                {difficultTypes.map((group: any) => (
                  <div
                    key={`difficult-group-${group.raw}`}
                    className="mt-4 first:mt-0"
                  >
                    <div className="flex items-center">
                      <div className="w-40 text-sm font-semibold text-gray-700 bg-gray-100 rounded px-3 py-2 text-center">
                        {group.name}
                      </div>
                      <div className="flex-1 ml-5">
                        <input
                          type="text"
                          value={postData.settings.groups[group.raw] || ""}
                          onChange={(e) =>
                            onGroupChange(group.raw, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={t("placeholder-difficult-group")}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </BgdFormItem>
          )}

          {/* VARIANT GROUP SETTINGS */}
          {variantTypes.length > 0 && (
            <BgdFormItem
              label={t("label-import-quiz-variant-group")}
              hint={t("hint-import-quiz-variant-group")}
            >
              <div className="w-full">
                {variantTypes.map((variant: any) => (
                  <div
                    key={`variant-group-${variant.raw}`}
                    className="mt-4 first:mt-0"
                  >
                    <div className="flex items-center">
                      <div className="w-40 text-sm font-semibold text-gray-700 bg-gray-100 rounded px-3 py-2 text-center">
                        {variant.name}
                      </div>
                      <div className="flex-1 ml-5">
                        <input
                          type="text"
                          value={postData.settings.variants[variant.raw] || ""}
                          onChange={(e) =>
                            onVariantChange(variant.raw, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={t("placeholder-variant-group")}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </BgdFormItem>
          )}
        </div>
      )}
    </>
  );
};

export default AdditionalSettingsSection;
