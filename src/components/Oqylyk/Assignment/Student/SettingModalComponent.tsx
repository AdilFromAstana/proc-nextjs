"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingModalComponentProps {
  assignment: {
    id: string | number;
    settings?: {
      proctoring_settings?: {
        main_camera_record?: boolean;
        second_camera_record?: boolean;
        screen_share_record?: boolean;
        head_tracking_client?: boolean;
        photo_head_identity?: boolean;
        displays_check?: boolean;
        fullscreen_mode?: boolean;
        read_clipboard?: boolean;
        noise_detector?: boolean;
        speech_detector?: boolean;
        extension_detector?: boolean;
        focus_detector?: boolean;
      };
    };
    isCompletedStatus?: () => boolean;
  };
  student: {
    id: string | number;
    // Дополнительные поля, которые могут понадобиться
    credibility?: number;
    points?: number;
    results?: any[];
    attempts?: any[];
  };
  viewer: "owner" | "reviewer" | "proctor" | null;
  disabled?: boolean;
  onAttemptSelected?: (attempt: any) => void;
  onAttemptUpdated?: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SettingsState {
  // Disabled states
  main_camera_manual_disabled?: boolean;
  second_camera_manual_disabled?: boolean;
  screen_share_manual_disabled?: boolean;
  head_tracking_manual_disabled?: boolean;
  head_identity_manual_disabled?: boolean;
  displays_check_manual_disabled?: boolean;
  fullscreen_mode_manual_disabled?: boolean;
  read_clipboard_manual_disabled?: boolean;
  noise_detector_manual_disabled?: boolean;
  speech_detector_manual_disabled?: boolean;
  extension_detector_manual_disabled?: boolean;
  focus_detector_manual_disabled?: boolean;

  // Enabled states
  main_camera_manual_enabled?: boolean;
  second_camera_manual_enabled?: boolean;
  screen_share_manual_enabled?: boolean;
  head_tracking_manual_enabled?: boolean;
  head_identity_manual_enabled?: boolean;
  displays_check_manual_enabled?: boolean;
  fullscreen_mode_manual_enabled?: boolean;
  read_clipboard_manual_enabled?: boolean;
  noise_detector_manual_enabled?: boolean;
  speech_detector_manual_enabled?: boolean;
  extension_detector_manual_enabled?: boolean;
  focus_detector_manual_enabled?: boolean;
}

const SettingModalComponent = ({
  assignment,
  student,
  isOpen,
  onOpenChange,
}: SettingModalComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<SettingsState>({});
  const { toast } = useToast();

  // Extract proctoring settings from assignment
  const proctoringSettings = assignment.settings?.proctoring_settings || {};

  // API URLs
  const settingsApiUrl = `/api/assignments/${assignment.id}`;
  const changeProctoringStatesApiUrl = `/api/assignment/actions/${assignment.id}/proctoring-states.json`;

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    if (!student?.id) return;

    setIsLoading(true);

    try {
      const fields = [
        "main_camera_manual_disabled",
        "second_camera_manual_disabled",
        "screen_share_manual_disabled",
        "head_identity_manual_disabled",
        "head_tracking_manual_disabled",
        "displays_check_manual_disabled",
        "fullscreen_mode_manual_disabled",
        "read_clipboard_manual_disabled",
        "extension_detector_manual_disabled",
        "noise_detector_manual_disabled",
        "focus_detector_manual_disabled",
        "main_camera_manual_enabled",
        "second_camera_manual_enabled",
        "screen_share_manual_enabled",
        "head_identity_manual_enabled",
        "head_tracking_manual_enabled",
        "displays_check_manual_enabled",
        "fullscreen_mode_manual_enabled",
        "read_clipboard_manual_enabled",
        "extension_detector_manual_enabled",
        "noise_detector_manual_enabled",
        "focus_detector_manual_enabled",
      ];

      const response = await fetch(`${settingsApiUrl}?context=${student.id}`, {
        headers: {
          "X-Requested-Fields": fields.join(","),
          // Добавьте заголовки авторизации, если нужно
          // "Authorization": `Bearer ${yourAuthToken}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.entity || {});
      } else {
        console.error("Failed to fetch settings");
        toast({
          title: "Error",
          description: "Failed to load settings",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const changeProctoringState = async (
    state: boolean | null,
    action: string
  ) => {
    if (state === null || !student?.id) return;

    try {
      const response = await fetch(changeProctoringStatesApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify({
          student_id: student.id,
          action: action,
          state: state ? "enabled" : "disabled",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update setting");
      }

      toast({
        title: "Success",
        description: "Setting updated successfully",
      });

      // Обновляем локальное состояние
      setSettings((prev) => ({
        ...prev,
        [action]: state,
      }));
    } catch (error) {
      console.error("Error changing proctoring state:", error);
      toast({
        title: "Error",
        description: "Failed to update setting",
      });
    }
  };

  // Helper function to render setting items
  const renderSettingItem = (
    condition: boolean | undefined,
    enabledLabel: string,
    disabledLabel: string,
    enabledKey: keyof SettingsState,
    disabledKey: keyof SettingsState,
    actionName: string
  ) => {
    if (condition) {
      return (
        <div className="setting-item mt-5 first:mt-0">
          <Label className="setting-label text-gray-800 text-base font-medium mb-3 block">
            {disabledLabel}
          </Label>
          <Switch
            checked={settings[disabledKey] as boolean}
            onCheckedChange={(checked) =>
              changeProctoringState(checked, actionName)
            }
            disabled={isLoading || assignment.isCompletedStatus?.()}
          />
        </div>
      );
    } else {
      return (
        <div className="setting-item mt-5 first:mt-0">
          <Label className="setting-label text-gray-800 text-base font-medium mb-3 block">
            {enabledLabel}
          </Label>
          <Switch
            checked={settings[enabledKey] as boolean}
            onCheckedChange={(checked) =>
              changeProctoringState(checked, enabledKey)
            }
            disabled={isLoading || assignment.isCompletedStatus?.()}
          />
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Proctoring Settings</DialogTitle>
          <DialogDescription>
            Configure proctoring settings for this student
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        <div className="proctoring-settings-list mt-4">
          {/* MAIN CAMERA */}
          {renderSettingItem(
            proctoringSettings.main_camera_record,
            "Main Camera Manual Enabled",
            "Main Camera Manual Disabled",
            "main_camera_manual_enabled",
            "main_camera_manual_disabled",
            "main_camera_manual_disabled"
          )}

          {/* SECOND CAMERA */}
          {renderSettingItem(
            proctoringSettings.second_camera_record,
            "Second Camera Manual Enabled",
            "Second Camera Manual Disabled",
            "second_camera_manual_enabled",
            "second_camera_manual_disabled",
            "second_camera_manual_disabled"
          )}

          {/* SCREEN SHARE */}
          {renderSettingItem(
            proctoringSettings.screen_share_record,
            "Screen Share Manual Enabled",
            "Screen Share Manual Disabled",
            "screen_share_manual_enabled",
            "screen_share_manual_disabled",
            "screen_share_manual_disabled"
          )}

          {/* HEAD TRACKING */}
          {renderSettingItem(
            proctoringSettings.head_tracking_client,
            "Head Tracking Manual Enabled",
            "Head Tracking Manual Disabled",
            "head_tracking_manual_enabled",
            "head_tracking_manual_disabled",
            "head_tracking_manual_disabled"
          )}

          {/* HEAD IDENTITY */}
          {renderSettingItem(
            proctoringSettings.photo_head_identity,
            "Head Identity Manual Enabled",
            "Head Identity Manual Disabled",
            "head_identity_manual_enabled",
            "head_identity_manual_disabled",
            "head_identity_manual_disabled"
          )}

          {/* DISPLAYS CHECK */}
          {renderSettingItem(
            proctoringSettings.displays_check,
            "Displays Check Manual Enabled",
            "Displays Check Manual Disabled",
            "displays_check_manual_enabled",
            "displays_check_manual_disabled",
            "displays_check_manual_disabled"
          )}

          {/* FULLSCREEN MODE */}
          {renderSettingItem(
            proctoringSettings.fullscreen_mode,
            "Fullscreen Mode Manual Enabled",
            "Fullscreen Mode Manual Disabled",
            "fullscreen_mode_manual_enabled",
            "fullscreen_mode_manual_disabled",
            "fullscreen_mode_manual_disabled"
          )}

          {/* READ CLIPBOARD */}
          {renderSettingItem(
            proctoringSettings.read_clipboard,
            "Read Clipboard Manual Enabled",
            "Read Clipboard Manual Disabled",
            "read_clipboard_manual_enabled",
            "read_clipboard_manual_disabled",
            "read_clipboard_manual_disabled"
          )}

          {/* NOISE DETECTOR */}
          {renderSettingItem(
            proctoringSettings.noise_detector,
            "Noise Detector Manual Enabled",
            "Noise Detector Manual Disabled",
            "noise_detector_manual_enabled",
            "noise_detector_manual_disabled",
            "noise_detector_manual_disabled"
          )}

          {/* SPEECH DETECTOR */}
          {renderSettingItem(
            proctoringSettings.speech_detector,
            "Speech Detector Manual Enabled",
            "Speech Detector Manual Disabled",
            "speech_detector_manual_enabled",
            "speech_detector_manual_disabled",
            "speech_detector_manual_disabled"
          )}

          {/* EXTENSION DETECTOR */}
          {renderSettingItem(
            proctoringSettings.extension_detector,
            "Extension Detector Manual Enabled",
            "Extension Detector Manual Disabled",
            "extension_detector_manual_enabled",
            "extension_detector_manual_disabled",
            "extension_detector_manual_disabled"
          )}

          {/* FOCUS DETECTOR */}
          {renderSettingItem(
            proctoringSettings.focus_detector,
            "Focus Detector Manual Enabled",
            "Focus Detector Manual Disabled",
            "focus_detector_manual_enabled",
            "focus_detector_manual_disabled",
            "focus_detector_manual_disabled"
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingModalComponent;
