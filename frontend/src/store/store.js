import {configureStore} from '@reduxjs/toolkit';
import billReducer from './billSlice'
import creditReducer from './creditSlice';
const store = configureStore({
    reducer:{
        bill:billReducer,
        credit:creditReducer,
    }
});


export default store;