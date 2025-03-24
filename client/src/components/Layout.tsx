import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Calorie Macro Calculator</h1>
      </header>
      
      <div className="app-body">
        <nav className="app-nav">
          <ul>
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to={`/daily/${today}`} 
                className={({ isActive }) => 
                  isActive || location.pathname.startsWith('/daily') ? 'active' : ''
                }
              >
                Daily Log
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/foods" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Food Database
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/settings" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Settings
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <main className="app-content">{children}</main>
      </div>
      
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Calorie Macro Calculator</p>
      </footer>
    </div>
  );
};

export default Layout;
