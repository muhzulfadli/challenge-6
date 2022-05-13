import { configureStore } from '@reduxjs/toolkit'

import userSlice from './user.js'

const store = configureStore({
    reducer: {
        user: userSlice.reducer
    }
})

export default store