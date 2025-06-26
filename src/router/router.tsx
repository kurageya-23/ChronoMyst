import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout";

// 各ページコンポーネントをimport
import TimelinePage from "../components/pages/TimelinePage";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [{ path: "/", element: <TimelinePage /> }],
  },
]);

export default router;
