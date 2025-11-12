import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const navItems = [
    { name: 'Marketplace', path: '/' },
    { name: 'Create Dataset', path: '/create' },
    { name: 'My Streams', path: '/my-streams' },
    { name: 'Docs', path: '/docs' },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Ownly Enterprise
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {item.path === location.pathname && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 top-full block h-0.5 w-full bg-primary"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
