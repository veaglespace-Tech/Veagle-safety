import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Sparkles, PhoneCall, ArrowRight, Image as ImageIcon, Info } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-[#FFCCE1] shadow-[0_4px_25px_-5px_rgba(255,92,138,0.08)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* BRAND LOGO EMBLEM */}
        <Link to="/landing" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose via-rose-light to-gold p-0.5 shadow-coral-glow group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-rose group-hover:text-gold transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-xl tracking-tight text-tichi-text group-hover:text-rose transition-colors">
                Sakhi Suraksha SOS
              </span>
              <span className="bg-rose/15 text-rose border border-rose/30 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                v2.0
              </span>
            </div>
            <p className="text-[10px] text-tichi-muted font-black tracking-wide">
              Personal Safety & Emergency Companion
            </p>
          </div>
        </Link>

        {/* CENTER FLOATING CAPSULE NAVIGATION NAVBAR */}
        <nav className="hidden md:flex items-center space-x-1.5 bg-blush-subtle p-1.5 rounded-2xl border border-[#FFCCE1] shadow-inner">
          <Link
            to="/landing"
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
              isActive('/landing') || isActive('/')
                ? 'btn-baby-pink shadow-coral-glow'
                : 'text-tichi-muted hover:text-tichi-text hover:bg-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <Link
            to="/pricing"
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
              isActive('/pricing')
                ? 'btn-baby-pink shadow-coral-glow'
                : 'text-tichi-muted hover:text-tichi-text hover:bg-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Pricing</span>
          </Link>

          <Link
            to="/about"
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
              isActive('/about')
                ? 'btn-baby-pink shadow-coral-glow'
                : 'text-tichi-muted hover:text-tichi-text hover:bg-white'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>About Us</span>
          </Link>

          <Link
            to="/gallery"
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
              isActive('/gallery')
                ? 'btn-baby-pink shadow-coral-glow'
                : 'text-tichi-muted hover:text-tichi-text hover:bg-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gallery</span>
          </Link>

          <Link
            to="/contact"
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
              isActive('/contact')
                ? 'btn-baby-pink shadow-coral-glow'
                : 'text-tichi-muted hover:text-tichi-text hover:bg-white'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Contact Us</span>
          </Link>
        </nav>

        {/* RIGHT SIDE ACTION BUTTONS */}
        <div className="flex items-center space-x-3">
          {token ? (
            <div className="flex items-center space-x-3">
              <Link
                to={user?.role === 'SUPER_ADMIN' ? '/admin' : '/'}
                className="btn-baby-pink text-xs px-4 py-2.5 shadow-coral-glow flex items-center space-x-2"
              >
                <span>{user?.role === 'SUPER_ADMIN' ? 'HQ Command Center' : 'Safety Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-black text-tichi-muted hover:text-rose px-3 py-2 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/auth?mode=login"
                className="btn-baby-pink-outline text-xs px-4 py-2.5"
              >
                Sign In
              </Link>
              <Link
                to="/auth?mode=register"
                className="btn-baby-pink text-xs px-5 py-2.5 shadow-coral-glow flex items-center space-x-1.5"
              >
                <span>Sign Up</span>
                <Sparkles className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
};
