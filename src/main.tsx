import "./index.css";
import ReactDOM from "react-dom/client";
import React from "react";

// ルーティング関連
import router from "./router/router";
import { RouterProvider } from "react-router-dom";

// UIフレームワーク
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import { MantineProvider } from "@mantine/core";

// Redux
import { Provider } from "react-redux";
import { store } from "./app/store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider defaultColorScheme="dark">
        <RouterProvider router={router} />
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);
