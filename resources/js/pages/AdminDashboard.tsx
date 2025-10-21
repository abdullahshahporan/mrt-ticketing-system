import React, { useState, useRef, useEffect } from 'react';
import Overview from '../components/admin_components/overview';
import InstantBookingList from '../components/admin_components/onetimeticketlist';
import ScheduleBookingList from '../components/admin_components/schedulebookinglist';
import VirtualCardInfo from '../components/admin_components/virtualcardinfo';
import { AdminProfileForm } from '../components/admin_components/adminprofileform';
import {
  HiOutlineViewGrid,
  HiOutlineTicket,
  HiOutlineCreditCard,
  HiOutlineMap,
  HiOutlineUserCircle,
  HiOutlineChevronRight,
} from 'react-icons/hi';

const sidebarItems = [
  { label: 'OverView', icon: <HiOutlineViewGrid size={22} /> },
  { label: 'One-Time Ticket', icon: <HiOutlineTicket size={22} />, subItems: [
    { label: 'Instant Booking' },
    { label: 'Schedule Booking' }
  ] },
  { label: 'Virtual Card', icon: <HiOutlineCreditCard size={22} /> },
  { label: 'Route Info', icon: <HiOutlineMap size={22} /> },
  { label: 'Personal Info', icon: <HiOutlineUserCircle size={22} /> },
];

const AdminDashboard: React.FC = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  // Track active sidebar item (for highlight)
  const [activeIdx, setActiveIdx] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('sidebar-')) {
      const idx = parseInt(hash.split('-')[1], 10);
      return isNaN(idx) ? 0 : idx;
    }
    return 0;
  });
  // Track which sub-item is selected for One-Time Ticket
  const [oneTimeSubIdx, setOneTimeSubIdx] = useState<number | null>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('sidebar-1-sub-')) {
      const subIdx = parseInt(hash.split('-')[3], 10);
      return isNaN(subIdx) ? null : subIdx;
    }
    return null;
  });
  // Track hover for floating menu
  const [showOneTimeMenu, setShowOneTimeMenu] = useState(false);
  // Timer for delayed menu close
  const menuCloseTimer = useRef<NodeJS.Timeout | null>(null);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col py-8 px-4 gap-2 shadow-lg">
        <div className="mb-8 text-center">
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff&rounded=true&size=60"
            alt="Admin"
            className="w-16 h-16 rounded-full mx-auto border-4 border-blue-100 shadow"
          />
          <div className="mt-2 font-bold text-blue-700 text-lg">Admin</div>
          <div className="text-xs text-gray-400">admin@mrt.com</div>
        </div>
        <nav className="flex flex-col gap-1 relative">
          {sidebarItems.map((item, idx) => (
            <div key={item.label} className="relative">
              <button
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition text-base group ${activeIdx === idx ? 'bg-blue-600 text-white shadow' : 'text-blue-700 hover:bg-blue-50'}`}
                onClick={() => {
                  setActiveIdx(idx);
                  if (idx !== 1) setOneTimeSubIdx(null);
                  window.location.hash = `sidebar-${idx}`;
                }}
                onMouseEnter={() => {
                  if (idx === 1) {
                    if (menuCloseTimer.current) clearTimeout(menuCloseTimer.current);
                    setShowOneTimeMenu(true);
                  }
                }}
                onMouseLeave={() => {
                  if (idx === 1) {
                    menuCloseTimer.current = setTimeout(() => setShowOneTimeMenu(false), 400);
                  }
                }}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
                <HiOutlineChevronRight className={`ml-auto transition-transform ${activeIdx === idx ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
              </button>
              {/* Floating menu for One-Time Ticket */}
              {idx === 1 && showOneTimeMenu && (
                <div
                  className="absolute left-full top-0 ml-2 bg-white rounded-lg shadow-lg z-50 py-2 px-3 min-w-[180px] animate-fade-in"
                  onMouseEnter={() => {
                    if (menuCloseTimer.current) clearTimeout(menuCloseTimer.current);
                    setShowOneTimeMenu(true);
                  }}
                  onMouseLeave={() => {
                    menuCloseTimer.current = setTimeout(() => setShowOneTimeMenu(false), 400);
                  }}
                >
                  {item.subItems?.map((sub, subIdx) => (
                    <button
                      key={sub.label}
                      className={`block w-full text-left px-3 py-2 rounded-lg font-medium text-blue-700 hover:bg-blue-50 ${oneTimeSubIdx === subIdx && activeIdx === 1 ? 'bg-blue-100' : ''}`}
                      onClick={() => {
                        setActiveIdx(1);
                        setOneTimeSubIdx(subIdx);
                        setShowOneTimeMenu(false);
                        window.location.hash = `sidebar-1-sub-${subIdx}`;
                      }}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="mt-auto pt-8 text-center text-xs text-gray-400">&copy; {new Date().getFullYear()} MRT Ticketing System</div>
      </aside>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-blue-700 text-white py-4 px-8 shadow flex items-center justify-between relative">
          <h1 className="text-2xl font-bold tracking-wide">Admin Dashboard</h1>
          <div className="relative" ref={profileRef}>
            <button
              className="ml-4 w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-blue-300 hover:shadow-lg focus:outline-none"
              onClick={() => setProfileOpen((v) => !v)}
              aria-label="Profile"
            >
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff&rounded=true&size=40"
                alt="Admin"
                className="w-9 h-9 rounded-full object-cover"
              />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 py-4 px-5 text-gray-800 animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff&rounded=true&size=40"
                    alt="Admin"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">Admin</div>
                    <div className="text-xs text-gray-500">admin@mrt.com</div>
                  </div>
                </div>
                <button
                  className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  onClick={() => { window.location.href = '/admin-login'; }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-10">
          <div className="w-full max-w-4xl mt-8">
            {activeIdx === 0 ? (
              <Overview />
            ) : activeIdx === 1 ? (
              oneTimeSubIdx === 0 ? <InstantBookingList /> : oneTimeSubIdx === 1 ? <ScheduleBookingList /> : (
                <div className="bg-white rounded-xl shadow-lg p-10 text-center">
                  <h2 className="text-2xl font-bold mb-2 text-blue-700">One-Time Ticket</h2>
                  <p className="text-gray-600 text-lg">Select a booking type.</p>
                </div>
              )
            ) : activeIdx === 2 ? (
              <VirtualCardInfo />
            ) : activeIdx === 4 ? (
              <PersonalInfo />
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-10 text-center">
                <h2 className="text-2xl font-bold mb-2 text-blue-700">{sidebarItems[activeIdx].label}</h2>
                <p className="text-gray-600 text-lg">This section is under construction.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

const PersonalInfo: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch profile with id=1 (or current admin id if available)
    fetch('/api/admin/profile/1')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [editing]);

  if (loading) {
    return <div className="bg-white rounded-xl shadow-lg p-10 text-center">Loading...</div>;
  }

  if (!profile || editing) {
  // Show form for new or edit
  return <AdminProfileForm />;
  }

  // Show profile info
  return (
    <div className="bg-white rounded-xl shadow-lg p-10 text-left max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Personal Info</h2>
      <div className="mb-2"><b>Name:</b> {profile.name}</div>
      <div className="mb-2"><b>Email:</b> {profile.email}</div>
      <div className="mb-2"><b>Contact No.:</b> {profile.contact_no}</div>
      <div className="mb-2"><b>NID:</b> {profile.nid_no}</div>
      <div className="mb-2"><b>Date of Birth:</b> {profile.date_of_birth}</div>
      <div className="mb-2"><b>Address:</b> {profile.address}</div>
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setEditing(true)}>Edit</button>
    </div>
  );
};

export default AdminDashboard;
