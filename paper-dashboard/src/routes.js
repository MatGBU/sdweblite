
import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Devices from "views/Devices.js"; 
import UserPage from "views/User.js";


var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/admin",
  },

  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: <Notifications />,
    layout: "/admin",
  },
  {
    path: "/user-page",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: <UserPage />,
    layout: "/admin",
  },
  {
    path: "/devices",
    name: "Devices",
    icon: "nc-icon nc-app",
    component: <Devices />,
    layout: "/admin",
  },


];
export default routes;