import { Navigate, createBrowserRouter } from "react-router-dom";

import { RequireAdmin } from "./auth/RequireAdmin";
import { RequireAuth } from "./auth/RequireAuth";
import { Layout } from "./components/Layout";
import { AskPage } from "./pages/Ask";
import { DepartmentPage } from "./pages/Department";
import { HomePage } from "./pages/Home";
import { LoginPage } from "./pages/Login";
import { AdminAuditLogPage } from "./pages/admin/AdminAuditLogPage";
import { AdminFoldersPage } from "./pages/admin/AdminFoldersPage";
import { AdminGuidePage } from "./pages/admin/AdminGuidePage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminTagsPage } from "./pages/admin/AdminTagsPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AskTab } from "./pages/department/AskTab";
import { DocumentsTab } from "./pages/department/DocumentsTab";
import { ProjectsTab } from "./pages/department/ProjectsTab";
import { UploadTab } from "./pages/department/UploadTab";

export const router = createBrowserRouter([
  { path: "/giris", element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/sor", element: <AskPage /> },
          {
            path: "/departman/:slug",
            element: <DepartmentPage />,
            children: [
              { index: true, element: <AskTab /> },
              { path: "belgeler", element: <DocumentsTab /> },
              { path: "yukle", element: <UploadTab /> },
              { path: "projeler", element: <ProjectsTab /> },
            ],
          },
          {
            path: "/yonetim",
            element: <RequireAdmin />,
            children: [
              {
                element: <AdminLayout />,
                children: [
                  { index: true, element: <Navigate to="kullanicilar" replace /> },
                  { path: "kullanicilar", element: <AdminUsersPage /> },
                  { path: "denetim-kaydi", element: <AdminAuditLogPage /> },
                  { path: "klasorler", element: <AdminFoldersPage /> },
                  { path: "etiketler", element: <AdminTagsPage /> },
                  { path: "tur-rehberi", element: <AdminGuidePage /> },
                ],
              },
            ],
          },
          { path: "*", element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
]);
