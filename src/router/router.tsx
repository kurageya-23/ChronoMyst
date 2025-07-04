import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout/layout";
import TimelinePage from "../components/pages/timeline";

// 各ページコンポーネントをimport

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [{ path: "/", element: <TimelinePage /> }],
  },
]);

export default router;
