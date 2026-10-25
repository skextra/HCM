import React, { useState } from 'react';
import { Employee } from '../types';

interface DirectoryViewProps {
  employees: Employee[];
  manager: Employee | null;
  onSelectEmployee: (emp: Employee) => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  employees,
  manager,
  onSelectEmployee,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDept, setActiveDept] = useState<'all' | 'Design' | 'Engineering' | 'Product' | 'People Ops'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filterPills: { id: 'all' | 'Design' | 'Engineering' | 'Product' | 'People Ops'; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: 142 },
    { id: 'Design', label: 'Design', count: 14 },
    { id: 'Engineering', label: 'Engineering', count: 58 },
    { id: 'Product', label: 'Product', count: 18 },
    { id: 'People Ops', label: 'HR & Ops', count: 12 },
  ];

  // Filter employees
  const filtered = employees.filter((emp) => {
    const matchesDept = activeDept === 'all' || emp.department === activeDept;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      emp.name.toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q) ||
      emp.locationDetail.toLowerCase().includes(q);
    return matchesDept && matchesQuery;
  });

  const sorted = [...filtered].sort((a, b) => {
    return sortOrder === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const getStatusBadge = (status: Employee['status'], locationDetail: string) => {
    if (status === 'In Office') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#27c38a]/15 text-[#004a31] dark:text-[#6ffbbe] text-[11px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#27c38a]"></span>
          <span>{locationDetail}</span>
        </span>
      );
    }
    if (status === 'Remote') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#dce9ff] dark:bg-[#1e3a8a]/40 text-[#0058be] dark:text-[#90a8ff] text-[11px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0058be] dark:bg-[#6ffbbe]"></span>
          <span>{locationDetail}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#757682] dark:text-[#94a3b8] text-[11px] font-bold border border-[#dce9ff] dark:border-[#223854]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#757682] dark:bg-[#94a3b8]"></span>
        <span>{locationDetail}</span>
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* 1. Search Bar & Filter Carousel */}
      <div className="flex flex-col gap-3 pt-1">
        {/* Search Bar */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#757682] dark:text-[#94a3b8] text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, skill or department..."
            className="w-full h-12 pl-10 pr-10 bg-white dark:bg-[#132238] text-[#0b1c30] dark:text-white placeholder:text-[#757682] dark:placeholder:text-[#64748b] text-sm rounded-xl border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 dark:focus:ring-[#6ffbbe]/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757682] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {filterPills.map((pill) => {
            const isSelected = activeDept === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setActiveDept(pill.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  isSelected
                    ? 'bg-[#00236f] dark:bg-[#1e3a8a] text-white shadow-sm'
                    : 'bg-white dark:bg-[#132238] hover:bg-[#eff4ff] dark:hover:bg-[#18283f] text-[#444651] dark:text-[#cbd5e1] border border-[#e5eeff] dark:border-[#1e2e48]'
                }`}
                type="button"
              >
                {pill.label} ({pill.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Organization Quick Stats Bento (4 Stats) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#132238] p-4 rounded-xl border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm flex items-center gap-3 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-[#dce1ff] dark:bg-[#1e3a8a]/60 text-[#00236f] dark:text-[#90a8ff] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">group</span>
          </div>
          <div>
            <span className="text-xl font-bold text-[#0b1c30] dark:text-white font-mono leading-tight block">142</span>
            <span className="text-[11px] text-[#757682] dark:text-[#94a3b8] block">Active Members</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#132238] p-4 rounded-xl border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm flex items-center gap-3 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-[#27c38a]/15 text-[#004a31] dark:text-[#6ffbbe] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">domain</span>
          </div>
          <div>
            <span className="text-xl font-bold text-[#0b1c30] dark:text-white font-mono leading-tight block">98</span>
            <span className="text-[11px] text-[#757682] dark:text-[#94a3b8] block">In Office Today</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#132238] p-4 rounded-xl border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm flex items-center gap-3 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-[#dce9ff] dark:bg-[#18283f] text-[#0058be] dark:text-[#90a8ff] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">home_work</span>
          </div>
          <div>
            <span className="text-xl font-bold text-[#0b1c30] dark:text-white font-mono leading-tight block">32</span>
            <span className="text-[11px] text-[#757682] dark:text-[#94a3b8] block">Remote Work</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#132238] p-4 rounded-xl border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm flex items-center gap-3 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-[#ffdad6] dark:bg-[#93000a]/20 text-[#ba1a1a] dark:text-[#ffb4ab] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">beach_access</span>
          </div>
          <div>
            <span className="text-xl font-bold text-[#0b1c30] dark:text-white font-mono leading-tight block">12</span>
            <span className="text-[11px] text-[#757682] dark:text-[#94a3b8] block">On Leave</span>
          </div>
        </div>
      </div>

      {/* 3. Direct Reporting Line Card (My Manager) */}
      {manager && (
        <div className="bg-white dark:bg-[#132238] rounded-2xl p-5 border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#0058be] dark:text-[#6ffbbe]">account_tree</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0058be] dark:text-[#6ffbbe]">
                Direct Reporting Line
              </span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#00236f] dark:text-[#90a8ff] font-semibold border border-[#dce9ff] dark:border-[#223854]">
              Supervisor
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div
              onClick={() => onSelectEmployee(manager)}
              className="flex items-center gap-3.5 cursor-pointer group"
            >
              <div className="relative shrink-0">
                <img
                  src={manager.avatar}
                  alt={manager.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#eff4ff] dark:ring-[#223854]"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#27c38a] ring-2 ring-white dark:ring-[#132238]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-[#0b1c30] dark:text-white group-hover:text-[#0058be] dark:group-hover:text-[#6ffbbe] transition-colors">
                    {manager.name}
                  </h3>
                  <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[18px]">verified</span>
                </div>
                <p className="text-xs text-[#444651] dark:text-[#cbd5e1]">{manager.role}</p>
                <p className="text-xs text-[#0058be] dark:text-[#90a8ff] font-semibold mt-0.5">{manager.locationDetail}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => onSelectEmployee(manager)}
                className="px-3.5 py-2 rounded-xl bg-[#00236f] dark:bg-[#1e3a8a] text-white hover:bg-[#1e3a8a] dark:hover:bg-[#2563eb] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Direct Message</span>
              </button>
              <a
                href={`tel:${manager.phone}`}
                className="w-9 h-9 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] text-[#0058be] dark:text-[#6ffbbe] flex items-center justify-center transition-all border border-[#dce9ff] dark:border-[#223854]"
                title="Call Manager"
              >
                <span className="material-symbols-outlined text-[18px]">phone</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 4. Colleagues Header & Sort */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-baseline gap-2">
          <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Colleagues</h3>
          <span className="text-xs text-[#757682] dark:text-[#94a3b8]">{sorted.length} displayed</span>
        </div>

        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#132238] border border-[#e5eeff] dark:border-[#1e2e48] text-[#444651] dark:text-[#cbd5e1] text-xs font-semibold flex items-center gap-1 shadow-xs hover:bg-[#eff4ff] dark:hover:bg-[#18283f] transition-colors"
        >
          <span>Sort: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
          <span className="material-symbols-outlined text-[16px]">
            {sortOrder === 'asc' ? 'arrow_downward' : 'arrow_upward'}
          </span>
        </button>
      </div>

      {/* 5. Colleagues Roster List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((emp) => (
          <div
            key={emp.id}
            className="bg-white dark:bg-[#132238] rounded-2xl p-4 sm:p-5 border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm hover:border-[#0058be]/30 dark:hover:border-[#6ffbbe]/40 transition-all flex flex-col justify-between gap-3 group"
          >
            <div
              onClick={() => onSelectEmployee(emp)}
              className="flex items-start justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#eff4ff] dark:ring-[#223854]"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#27c38a] ring-2 ring-white dark:ring-[#132238]"></span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#0b1c30] dark:text-white group-hover:text-[#0058be] dark:group-hover:text-[#6ffbbe] transition-colors truncate">
                    {emp.name}
                  </h4>
                  <p className="text-xs text-[#444651] dark:text-[#cbd5e1] truncate">{emp.role}</p>
                  <p className="text-[11px] text-[#757682] dark:text-[#94a3b8] truncate">{emp.department} • {emp.empId}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#757682] dark:text-[#94a3b8] group-hover:text-[#00236f] dark:group-hover:text-[#6ffbbe] text-[20px] transition-colors">
                chevron_right
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#eff4ff] dark:border-[#1e2e48]">
              {getStatusBadge(emp.status, emp.locationDetail)}

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSelectEmployee(emp)}
                  className="w-8 h-8 rounded-lg bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#00236f] dark:hover:bg-[#1e3a8a] hover:text-white text-[#00236f] dark:text-[#90a8ff] flex items-center justify-center transition-all"
                  title="Direct Message"
                >
                  <span className="material-symbols-outlined text-[16px]">forum</span>
                </button>
                <a
                  href={`tel:${emp.phone}`}
                  className="w-8 h-8 rounded-lg bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#0058be] dark:hover:bg-[#2563eb] hover:text-white text-[#0058be] dark:text-[#6ffbbe] flex items-center justify-center transition-all"
                  title="Call"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                </a>
                <a
                  href={`mailto:${emp.email}`}
                  className="w-8 h-8 rounded-lg bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#444651] dark:hover:bg-[#334155] hover:text-white text-[#444651] dark:text-[#cbd5e1] flex items-center justify-center transition-all"
                  title="Email"
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="bg-white dark:bg-[#132238] rounded-2xl p-12 border border-[#e5eeff] dark:border-[#1e2e48] text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#00236f] dark:text-[#6ffbbe] flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-[24px]">person_search</span>
          </div>
          <h4 className="text-base font-bold text-[#0b1c30] dark:text-white">No teammates found</h4>
          <p className="text-xs text-[#757682] dark:text-[#94a3b8] mt-1 max-w-sm mx-auto">
            We couldn't find anyone matching your search query. Try clearing your filters or changing department.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveDept('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#00236f] dark:bg-[#1e3a8a] text-white text-xs font-semibold shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
