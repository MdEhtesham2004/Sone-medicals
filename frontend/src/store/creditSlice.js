import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    creditCustomerData:{}
}

const creditSlice = createSlice({
    name: 'credit',
    initialState,
    reducers: {
        setCreditCustomerData: (state, action) => {
            state.creditCustomerData = action.payload;
        },
        resetCreditCustomerData: (state) => {
            state.creditCustomerData = {};
        }
    }


})

export const { setCreditCustomerData, resetCreditCustomerData } = creditSlice.actions;
export default creditSlice.reducer;