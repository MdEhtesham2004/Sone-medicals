import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    patient: null,
    medicines: [],
}


const billSlice = createSlice({
    name: 'bill',
    initialState,
    reducers: {
        setPatient: (state, action) => {
            state.patient = action.payload;
        },
        addMedicine: (state, action) => {
            state.medicines.push(action.payload)
        },
        removeMedicne: (state, action) => {
            state.medicines = state.medicines.filter((_, index) => index !== action.payload)
        },
        clearMedicine: (state) => {
            state.medicines = [];
        },
        resetBill: (state,) => {
            state.patient = null,
                state.medicines = [];
        },
        setMedicines: (state, action) => {
            state.medicines = action.payload;
        },


    },

});

export const {
    setPatient,
    addMedicine,
    removeMedicne,
    clearMedicine,
    resetBill,
    setMedicines,

} = billSlice.actions;

export default billSlice.reducer;