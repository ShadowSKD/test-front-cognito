import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CreditCard,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const path_prefix = user?.role === "ADMIN" ? "/admin/dashboard/" : "/dashboard/";
  const navItems = [
    { name: 'Dashboard', path: path_prefix, icon: LayoutDashboard, roles: ['USER', 'ADMIN'] },
    { name: 'Products', path: path_prefix + 'products', icon: Package, roles: ['ADMIN'] },
    { name: 'Orders', path: path_prefix + 'orders', icon: ShoppingCart, roles: ['USER', 'ADMIN'] },
    { name: 'Payments', path: path_prefix + 'payments', icon: CreditCard, roles: ['USER', 'ADMIN'] },
    { name: 'Admin Console', path: path_prefix, icon: Users, roles: ['ADMIN'] },
    { name: 'Profile', path: path_prefix + 'profile', icon: Settings, roles: ['USER', 'ADMIN'] },
  ].filter(item => item.roles.includes(user?.role || 'USER'));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 256 : 80,
          x: isOpen ? 0 : (window.innerWidth < 768 ? -80 : 0) // slide out completely on mobile if closed
        }}
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-surface border-r border-white/5 flex flex-col transition-all overflow-hidden ${!isOpen && 'max-md:-translate-x-full'}`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5 h-20">
          <Link to="/" className={`flex items-center gap-2 text-xl font-bold text-white tracking-tight ${!isOpen && 'hidden'}`}>
            <Package className="text-primary min-w-[24px]" size={24} />
            <span>Equi<span className="text-primary">Cart</span></span>
          </Link>
          {!isOpen && <Package className="text-primary min-w-[24px] mx-auto" size={24} />}
          {isOpen && (
            <button onClick={() => setIsOpen(false)} className="md:hidden text-textSecondary hover:text-white">
              <ChevronLeft size={20} />
            </button>
          )}
        </div>

        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-textSecondary hover:bg-white/5 hover:text-white'
                  }`}
                title={!isOpen ? item.name : undefined}
              >
                <Icon size={20} className="min-w-[20px]" />
                {isOpen && <span className="font-medium truncate">{item.name}</span>}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={logout}
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl text-textSecondary hover:bg-danger/10 hover:text-danger transition-all`}
            title={!isOpen ? "Logout" : undefined}
          >
            <LogOut size={20} className="min-w-[20px]" />
            {isOpen && <span className="font-medium truncate">Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
