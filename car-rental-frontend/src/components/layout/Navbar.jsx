import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Don't show customer navigation for admins
  const showCustomerNav = !isAdmin();

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="EmberDrive" 
              className="h-12 w-auto group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="hidden h-12 w-12">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <path d="M100 180 Q150 120, 250 140 Q350 160, 380 190 L380 210 Q350 180, 250 160 Q150 140, 120 200 Z" fill="#7f1d1d"/>
                <path d="M100 180 Q150 120, 250 140 Q350 160, 380 190 L360 200 Q330 170, 250 150 Q150 130, 100 180 Z" fill="#ea580c"/>
                <ellipse cx="130" cy="210" rx="20" ry="25" fill="none" stroke="#1f2937" strokeWidth="8"/>
                <ellipse cx="330" cy="210" rx="20" ry="25" fill="none" stroke="#1f2937" strokeWidth="8"/>
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <span className="text-gray-900">Ember</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Drive</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Only show customer navigation if user is NOT an admin */}
            {showCustomerNav && (
              <>
                <Link 
                  to="/cars" 
                  className="text-gray-700 hover:text-red-600 transition-all font-semibold text-sm uppercase tracking-wider relative group"
                >
                  Browse Cars
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-orange-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                
                {isAuthenticated() && (
                  <Link 
                    to="/my-bookings" 
                    className="text-gray-700 hover:text-red-600 transition-all font-semibold text-sm uppercase tracking-wider relative group"
                  >
                    My Bookings
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-orange-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
              </>
            )}

            {/* Show Admin Panel link only for admins */}
            {isAdmin() && (
              <Link 
                to="/admin" 
                className="text-gray-700 hover:text-red-600 transition-all font-semibold text-sm uppercase tracking-wider relative group"
              >
                Admin Panel
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-orange-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated() ? (
              <>
                <div className="flex items-center space-x-3 px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-orange-50 border border-red-100">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {user?.fullName}
                    </p>
                    <p className="text-xs font-medium text-red-600 uppercase tracking-wider">
                      {user?.role}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 rounded-full bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-6 py-2.5 rounded-full border-2 border-gray-900 text-gray-900 font-semibold text-sm hover:bg-gray-900 hover:text-white transition-all duration-300"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold text-sm hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-100 bg-white">
            <div className="flex flex-col space-y-4">
              {/* Only show customer links if NOT admin */}
              {showCustomerNav && (
                <>
                  <Link
                    to="/cars"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-red-600 transition-colors font-semibold px-4 py-2 uppercase tracking-wider text-sm"
                  >
                    Browse Cars
                  </Link>
                  
                  {isAuthenticated() && (
                    <Link
                      to="/my-bookings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-700 hover:text-red-600 transition-colors font-semibold px-4 py-2 uppercase tracking-wider text-sm"
                    >
                      My Bookings
                    </Link>
                  )}
                </>
              )}

              {/* Show Admin Panel link only for admins */}
              {isAdmin() && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-red-600 transition-colors font-semibold px-4 py-2 uppercase tracking-wider text-sm"
                >
                  Admin Panel
                </Link>
              )}

              <div className="border-t border-gray-200 pt-4 px-4">
                {isAuthenticated() ? (
                  <>
                    <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-100">
                      <p className="text-sm font-bold text-gray-900 mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {user?.fullName}
                      </p>
                      <p className="text-xs font-medium text-red-600 uppercase tracking-wider">
                        {user?.role}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-6 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-6 py-3 rounded-full border-2 border-gray-900 text-gray-900 font-semibold text-center hover:bg-gray-900 hover:text-white transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold text-center hover:shadow-xl transition-all"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add custom font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap');
      `}</style>
    </nav>
  );
};

export default Navbar;