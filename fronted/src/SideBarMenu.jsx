import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./aside.module.css";
function SideBarMenu() {
  const route = useLocation();
  const [open, setOpen] = useState(false)


  return (
    <aside className={styles.aside_Container}>
      <div className={styles.aside}>

        <div className={styles.aside_Container_header}>
          <i className="fa-solid fa-car"></i>
          Carshop
        </div>
        <nav>
          <ul>
            <li onClick={() => setOpen(!open)}>
              <Link
                className={route.pathname === "/" ? styles.active_route : ""}
                to="/"
              >
                <i className="fa-solid fa-hands-praying"></i>Dashboard
              </Link>
            </li>
            <li>
              <Link
                className={route.pathname === "/inventory" ? styles.active_route : styles.active_subroute}
                to="/inventory"
              >
                <i className="fa-solid fa-warehouse"></i>Inventory
              </Link>
            </li>
            <li>
              <Link
                className={route.pathname === "/crm" ? styles.active_route : ""}
                to="/crm"
              >
                <i className="fa-brands fa-sellsy"></i>CRM
              </Link>
            </li>
            <li>
              <Link
                className={route.pathname === "/sales&finances" ? styles.active_route : ""}
                to="/sales&finances"
              >
                <i className="fa-solid fa-tags"></i>Sales & Finances
              </Link>
            </li>
            <li  >
              <Link
                className={route.pathname === "/employees" ? styles.active_route : ""}
                to="/employees"
              >
                <i className="fa-solid fa-user-tie"></i>Employees
              </Link>
            </li>
            <li>

             

              {open && (
                <ul>
                  <li>
                    <Link
                      className={route.pathname === "/employees" ? styles.active_route : ""}
                      to="/employees"
                    >
                      <i className="fa-solid fa-user-tie"></i>Employees
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={route.pathname === "/employees" ? styles.active_route : ""}
                      to="/employees"
                    >
                      <i className="fa-solid fa-user-tie"></i>Employees
                    </Link>
                  </li>
                </ul>
              )}
              <Link
                className={route.pathname === "/service" ? styles.active_route : ""}
                to="/service"
              >
                <i className="fa-brands fa-ioxhost"></i>Service
              </Link>
            </li>
            <li>
              <Link
                className={route.pathname === "/settings" ? styles.active_route : ""}
                to="/settings"
              >
                <i className="fa-solid fa-screwdriver-wrench"></i>Settings
              </Link>
            </li>
          </ul>

          <ul>
            <li><Link to="#"><i className="fa-solid fa-circle-question"></i>Help Center</Link></li>
            <li><Link to="/logout"><i className="fa-solid fa-right-from-bracket"></i>Logout</Link></li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default SideBarMenu;