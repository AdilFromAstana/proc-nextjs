import { createSlice } from "@reduxjs/toolkit";

// Типы
interface School {
  id: number;
  name: string;
  // другие поля школы
}

interface SchoolState {
  school: School | null;
}

// Начальное состояние
const initialState: SchoolState = {
  school: {
    id: 1,
    name: "Default School",
  },
};

// Слайс
const schoolSlice = createSlice({
  name: "school",
  initialState,
  reducers: {
    setSchool: (state, action) => {
      state.school = action.payload;
    },
    clearSchool: (state) => {
      state.school = null;
    },
  },
});

export const { setSchool, clearSchool } = schoolSlice.actions;
export default schoolSlice.reducer;
