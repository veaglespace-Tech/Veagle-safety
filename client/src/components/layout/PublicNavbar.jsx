import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Sparkles, PhoneCall, Crown, ArrowRight, Image as ImageIcon, Heart, Info } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice.js';

export const PublicNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/landing');
  };

  return (
    <header className="sticky top-0 z-50 bg-plum-dark/80 backdrop-blur-xl border-b border-rose/20 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* BRAND LOGO */}
        <Link to="/landing" className="flex items-center space-x-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose via-plum-light to-gold p-0.5 shadow-coral-glow group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-plum-dark rounded-[14px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-rose group-hover:text-gold transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-xl tracking-tight text-white group-hover:text-rose transition-colors">
                Tichi Suraksha
              </span>
              <span className="bg-rose/20 text-rose border border-rose/40 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                v2.0
              </span>
            </div>
            <p className="text-[10px] text-rose-muted font-bold tracking-wide">
              Personal Safety & Emergency Companion
            </p>
          </div>
        </Link>

        {/* CENTER TABS NAVBAR */}
        <nav className="hidden md:flex items-center space-x-1 bg-plum-dark/90 p-1.5 rounded-2xl border border-rose/20 shadow-inner">
          <Link
            to="/landing"
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
              isActive('/landing') || isActive('/')
                ? 'bg-gradient-to-r from-rose to-plum-light text-white shadow-coral-glow'
                : 'text-rose-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          <Link
            to="/pricing"
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
              isActive('/pricing')
                ? 'bg-gradient-to-r from-rose to-plum-light text-white shadow-coral-glow'
                : 'text-rose-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pricing</span>
          </Link>

          <Link
            to="/about"
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
              isActive('/about')
                ? 'bg-gradient-to-r from-rose to-plum-light text-white shadow-coral-glow'
                : 'text-rose-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About Us</span>
          </Link>

          <Link
            to="/gallery"
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
              isActive('/gallery')
                ? 'bg-gradient-to-r from-rose to-plum-light text-white shadow-coral-glow'
                : 'text-rose-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Gallery</span>
          </Link>

          <Link
            to="/contact"
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
              isActive('/contact')
                ? 'bg-gradient-to-r from-rose to-plum-light text-white shadow-coral-glow'
                : 'text-rose-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Contact Us</span>
          </Link>
        </nav>

        {/* RIGHT ACTION BUTTONS */}
        <div className="flex items-center space-x-3">
          {token ? (
            <div className="flex items-center space-x-3">
              <Link
                to={user?.role === 'SUPER_ADMIN' ? '/admin' : '/'}
                className="bg-gradient-to-r from-rose to-plum-light text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-coral-glow hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
              >
                <span>{user?.role === 'SUPER_ADMIN' ? 'HQ Command Center' : 'Safety Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-rose-muted hover:text-white px-3 py-2 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/auth?mode=login"
                className="text-xs font-extrabold text-white hover:text-rose px-4 py-2.5 rounded-xl transition-colors border border-rose/30 bg-plum-dark/60 hover:bg-plum-dark"
              >
                Sign In
              </Link>
              <Link
                to="/auth?mode=register"
                className="bg-gradient-to-r from-rose via-plum-light to-rose text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-coral-glow hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1.5"
              >
                <span>Sign Up</span>
                <Sparkles className="w-3.5 h-3.5" />
              </Link>
            </>
          )}

          {/* Dedicated Super Admin Quick Badge Link */}
          <Link
            to="/admin/login"
            title="Company Super Admin Portal"
            className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/30 hover:border-gold text-gold flex items-center justify-center transition-all hover:scale-105"
          >
            <Crown className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </header>
  );
};
