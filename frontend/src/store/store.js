import {configureStore} from '@reduxjs/toolkit';
import billReducer from './billSlice'
const store = configureStore({
    reducer:{
        bill:billReducer,
    }
});


export default store;