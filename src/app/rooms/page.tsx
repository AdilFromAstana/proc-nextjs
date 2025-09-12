"use client";

import SchedulesComponent from "@/components/Rooms/SchedulesComponent";
import React, { useState } from "react";

type Props = {};

export default function RoomsPage({}: Props) {
  const [schedules, setSchedules] = useState<any[]>([]);
  return (
    <div className="w-full m-8">
      <SchedulesComponent schedules={schedules} onChange={setSchedules} />
    </div>
  );
}
