import React, { useState, useEffect } from "react";

// Типы
interface Weekday {
  id: string;
  name: string;
}

interface ScheduleItem {
  id: string;
  weekday: string;
  work_at_start: string;
  work_at_end: string;
  is_workday: boolean;
}

// Данные дней недели
const weekdaysData: Weekday[] = [
  { id: "monday", name: "Понедельник" },
  { id: "tuesday", name: "Вторник" },
  { id: "wednesday", name: "Среда" },
  { id: "thursday", name: "Четверг" },
  { id: "friday", name: "Пятница" },
  { id: "saturday", name: "Суббота" },
  { id: "sunday", name: "Воскресенье" },
];

// Генерация времени
const generateTimes = () => {
  const times = [];

  for (let i = 0; i <= 23; i++) {
    const hour = i.toString().padStart(2, "0");
    const first = `${hour}:00`;
    const second = `${hour}:30`;

    times.push({ id: first, label: first });
    times.push({ id: second, label: second });
  }

  return times;
};

// Основной компонент
export default function SchedulesComponent({
  schedules,
  onChange,
}: {
  schedules: ScheduleItem[];
  onChange: (schedules: ScheduleItem[]) => void;
}) {
  const times = generateTimes();
  const [weekdays] = useState<Weekday[]>(weekdaysData);

  // Генерация расписания по умолчанию
  useEffect(() => {
    if (schedules.length === 0) {
      const defaultSchedules: ScheduleItem[] = weekdaysData.map((weekday) => {
        let isWorkDay = true;
        let atEnd = "18:00";

        if (weekday.id === "saturday") {
          atEnd = "14:00";
        }

        if (weekday.id === "sunday") {
          isWorkDay = false;
        }

        return {
          id: `schedule-${weekday.id}`,
          weekday: weekday.id,
          work_at_start: "09:00",
          work_at_end: atEnd,
          is_workday: isWorkDay,
        };
      });

      onChange(defaultSchedules);
    }
  }, [schedules.length, onChange]);

  // Обновление расписания
  const updateSchedule = (
    index: number,
    field: keyof ScheduleItem,
    value: any
  ) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index] = {
      ...updatedSchedules[index],
      [field]: value,
    };
    onChange(updatedSchedules);
  };

  // Получение названия дня недели
  const getWeekdayName = (id: string) => {
    return weekdays.find((day) => day.id === id)?.name || id;
  };

  return (
    <div className="w-full">
      {schedules.map((schedule, index) => (
        <div
          key={`schedule-item-${index}`}
          className="w-full flex flex-row flex-nowrap justify-between items-center py-2 px-3 first:mt-0 bg-gray-50 border border-gray-200 rounded"
        >
          {/* Переключатель рабочего дня */}
          <div className="flex-0 basis-20 mr-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={schedule.is_workday}
                onChange={(e) =>
                  updateSchedule(index, "is_workday", e.target.checked)
                }
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Название дня недели */}
          <div className="flex-0 basis-auto min-w-[120px] text-gray-600 font-medium text-sm">
            {getWeekdayName(schedule.weekday)}
          </div>

          {/* Время начала работы */}
          <div className="flex-1 basis-1/4 mx-1">
            <div className="text-xs text-gray-500 mb-0.5">Время работы с</div>
            <select
              value={schedule.work_at_start}
              onChange={(e) =>
                updateSchedule(index, "work_at_start", e.target.value)
              }
              disabled={!schedule.is_workday}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {times.map((time) => (
                <option key={time.id} value={time.id}>
                  {time.label}
                </option>
              ))}
            </select>
          </div>

          {/* Время окончания работы */}
          <div className="flex-1 basis-1/4 mx-1">
            <div className="text-xs text-gray-500 mb-0.5">Время работы до</div>
            <select
              value={schedule.work_at_end}
              onChange={(e) =>
                updateSchedule(index, "work_at_end", e.target.value)
              }
              disabled={!schedule.is_workday}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {times.map((time) => (
                <option key={time.id} value={time.id}>
                  {time.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
