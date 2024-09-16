import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom/dist";

export default function PostLoginLayout() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin");
  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };
  return (
    <div id="app">
      <div>
        <header
          id="header"
          className="header fixed-top d-flex align-items-center"
        >
          <div className="d-flex align-items-center justify-content-between">
            <Link
              to="/user/posts"
              className="logo d-flex align-items-center"
            >
              <img src="/assets/img/logo.png" alt="Logo" />
              <span className="d-none d-lg-block">Admin Panel</span>
            </Link>
            <i className="bi bi-list toggle-sidebar-btn" />
          </div>
          <nav className="header-nav ms-auto">
            <ul className="d-flex align-items-center">
              <li className="nav-item dropdown pe-3">
                <a
                  className="nav-link nav-profile d-flex align-items-center pe-0"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  <span className="d-none d-md-block dropdown-toggle ps-2" />
                </a>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                  <li className="dropdown-header">
                    <h6 />
                    <span>Web Designer</span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right" />
                      <span>Sign Out</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </header>
        <aside id="sidebar" className="sidebar">
          <ul className="sidebar-nav" id="sidebar-nav">
            <li className="nav-item">
              <Link to="/user/posts" className="nav-link collapsed">
                <i className="bi bi-grid" />
                <span>Posts</span>
              </Link>
            </li>
            <li className="nav-item">
              <a
                className="nav-link collapsed"
                style={{ cursor: "pointer" }}
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right" />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </aside>
        <Outlet />
        <footer id="footer" className="footer">
          <div className="copyright">
            {" "}
            © Copyright{" "}
            <strong>
              <span />
            </strong>
            . All Rights Reserved{" "}
          </div>
        </footer>
      </div>
    </div>
  );
}
