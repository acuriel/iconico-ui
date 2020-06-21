/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Search from "@material-ui/icons/Search";
import HistoryIcon from '@material-ui/icons/History';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
// core components/views for Admin layout
import DashboardPage from "views/admin/Dashboard";
import ConsultationList from "views/admin/ConsultationList";
import ConsultationCreate from 'views/admin/ConsultationCreate'
import ConsultationDetails from 'views/admin/ConsultationDetails'
import AdvancedSearch from 'views/admin/AdvancedSearch'
import History from 'views/admin/History'
import Feeds from 'views/admin/Feeds'
//auth layout
import LoginPage from "views/auth/LoginPage";
//error views
import ErrorPage from "views/ErrorPage";

export const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Inicio",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/consultas/nueva",
    name: "Consultas",
    component: ConsultationCreate,
    section:'consultations',
    layout: "/admin"
  },
  {
    path: "/consultas",
    name: "Consultas",
    icon: LibraryBooks,
    component: ConsultationList,
    section:'consultations',
    layout: "/admin"
  },
  {
    path: "/consulta/:id",
    name: "Consultas",
    component: ConsultationDetails,
    section:'consultations',
    layout: "/admin"
  },
  {
    path: "/anuncios",
    name: "Anuncios",
    icon: RecordVoiceOverIcon,
    component: Feeds,
    layout: "/admin"
  },
  {
    path: "/buscar",
    name: "Buscar",
    icon: Search,
    component: AdvancedSearch,
    layout: "/admin"
  },
  {
    path: "/historial",
    name: "Historial",
    icon: HistoryIcon,
    component: History,
    layout: "/admin"
  },
];

export const authRoutes = [
  {
    path: "/login",
    name: "Login Page",
    component: LoginPage,
    layout: "/auth"
  }
];

export const errorRoutes = [
  {
    path: "/error",
    name: "Error Page",
    component: ErrorPage,
    layout: "/auth"
  }
]

