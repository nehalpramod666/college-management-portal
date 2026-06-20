import { NavLink } from "react-router-dom";

const Sidebar = ({ title, links }) => {
  return (
    <aside className="w-56 bg-gray-900 text-gray-200 min-h-screen flex-shrink-0">
      <div className="px-6 py-4 border-b border-gray-700">
        <h1 className="text-lg font-bold text-white">{title}</h1>
      </div>
      <nav className="px-3 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.end}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;