import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface Assignment {
  id: number;
}

interface Student {
  id: number;
}

interface CreateViolationModalProps {
  assignment: Assignment;
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
}

const CreateViolationModal: React.FC<CreateViolationModalProps> = ({
  assignment,
  student,
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [postData, setPostData] = useState({
    description: "",
    screenshot: null,
    created_at: new Date(),
    autoscreenshot: true,
    currenttime: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(postData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Создать нарушение</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description">Описание нарушения</Label>
              <Textarea
                id="description"
                value={postData.description}
                onChange={(e) =>
                  setPostData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Введите описание нарушения"
                className="min-h-[100px]"
              />
            </div>

            {/* Screenshot Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoscreenshot" className="font-normal">
                  Автоматический скриншот
                </Label>
                <Switch
                  id="autoscreenshot"
                  checked={postData.autoscreenshot}
                  onCheckedChange={(checked) =>
                    setPostData((prev) => ({
                      ...prev,
                      autoscreenshot: checked,
                    }))
                  }
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={postData.autoscreenshot}
                className="w-full"
              >
                Сделать скриншот
              </Button>
            </div>

            {/* Created At Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="currenttime" className="font-normal">
                  Текущее время
                </Label>
                <Switch
                  id="currenttime"
                  checked={postData.currenttime}
                  onCheckedChange={(checked) =>
                    setPostData((prev) => ({
                      ...prev,
                      currenttime: checked,
                    }))
                  }
                />
              </div>

              {!postData.currenttime && (
                <div className="flex flex-col sm:flex-row gap-3 mt-3">
                  {/* Date Picker */}
                  <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="date"
                      value={format(postData.created_at, "yyyy-MM-dd")}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        newDate.setHours(postData.created_at.getHours());
                        newDate.setMinutes(postData.created_at.getMinutes());
                        setPostData((prev) => ({
                          ...prev,
                          created_at: newDate,
                        }));
                      }}
                      className="pl-10"
                    />
                  </div>

                  {/* Time Picker */}
                  <div className="relative flex-1">
                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="time"
                      value={format(postData.created_at, "HH:mm")}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value
                          .split(":")
                          .map(Number);
                        const newDate = new Date(postData.created_at);
                        newDate.setHours(hours);
                        newDate.setMinutes(minutes);
                        setPostData((prev) => ({
                          ...prev,
                          created_at: newDate,
                        }));
                      }}
                      step="1800" // 30 минут
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit">Создать нарушение</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateViolationModal;
