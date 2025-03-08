import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import authReducer from "./features/authSlice";
import cartReducer from "./features/cartSlice";
import storage from "./storage";

// Persist Configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "auth"], //  both cart & auth are stored
};

// Root Reducer
const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
});

// Persisted both Reducers
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddlewares) =>
      getDefaultMiddlewares({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
