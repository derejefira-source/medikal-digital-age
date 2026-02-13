import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Beaker, 
  Pill, 
  Settings, 
  Bell, 
  Search,
  Plus,
  LogOut,
  ChevronRight,
  ClipboardList,
  Activity,
  UserPlus,
  X,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Interfaces ---
type Module = 'dashboard' | 'patients' | 'opd' | 'laboratory' | 'pharmacy';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  phone: string;
  status: 'Waiting' | 'In Triage' | 'With Doctor' | 'Lab' | 'Pharmacy' | 'Discharged';
  lastVisit: string;
  vitals?: {
    bp: string;
    temp: string;
    weight: string;
    hr: string;
  };
}

// --- Mock Data ---
const INITIAL_PATIENTS: Patient[] = [
  { id: '1', name: 'Abebe Bikila', age: 45, gender: 'M', phone: '0911223344', status: 'In Triage', lastVisit: '2023-10-24' },
  { id: '2', name: 'Marta Desalegn', age: 28, gender: 'F', phone: '0922334455', status: 'With Doctor', lastVisit: '2023-10-25' },
  { id: '3', name: 'Kebede Kassahun', age: 62, gender: 'M', phone: '0933445566', status: 'Waiting', lastVisit: '2023-10-26' },
  { id: '4', name: 'Sara Yonas', age: 34, gender: 'F', phone: '0944556677', status: 'Lab', lastVisit: '2023-10-27' },
  { id: '5', name: 'Dawit Birhanu', age: 19, gender: 'M', phone: '0955667788', status: 'Pharmacy', lastVisit: '2023-10-27' },
];

// --- Sub-Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
        : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
    {active && <motion.div layoutId="activeNav" className="ml-auto"><ChevronRight size={16} /></motion.div>}
  </button>
);

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
};

// --- Module Components ---

const Dashboard = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-3xl font-black text-slate-800">እንኳን ደህና መጡ!</h1>
        <p className="text-slate-500 mt-1 font-medium italic">"Laki Health" - Modern Clinical Management System</p>
      </div>
      <div className="flex gap-3">
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Today's Date</p>
          <p className="text-sm font-bold text-slate-800">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Patients" value="1,284" icon={Users} color="bg-blue-500" trend={12} />
      <StatCard title="OPD Visits" value="48" icon={Stethoscope} color="bg-indigo-500" trend={5} />
      <StatCard title="Lab Requests" value="12" icon={Beaker} color="bg-amber-500" trend={-2} />
      <StatCard title="Pharmacy Orders" value="34" icon={Pill} color="bg-emerald-500" trend={8} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Current Clinic Flow</h3>
          <button className="text-blue-600 text-sm font-bold hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {INITIAL_PATIENTS.slice(0, 5).map((p, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-inner ${
                  p.status === 'Waiting' ? 'bg-amber-400' : 
                  p.status === 'In Triage' ? 'bg-indigo-400' :
                  p.status === 'Lab' ? 'bg-purple-400' : 'bg-blue-500'
                }`}>
                  {p.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{p.name}</p>
                  <p className="text-xs text-slate-500 font-medium">ID: #P-00{p.id} • {p.age}y • {p.gender}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  p.status === 'Waiting' ? 'bg-amber-100 text-amber-700' : 
                  p.status === 'In Triage' ? 'bg-indigo-100 text-indigo-700' :
                  p.status === 'Lab' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {p.status}
                </span>
                <p className="text-[10px] text-slate-400 mt-1 font-bold">12:4{i} PM</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-xl shadow-blue-200">
          <Activity className="mb-4 opacity-80" size={32} />
          <h3 className="text-xl font-bold mb-2">System Health</h3>
          <p className="text-blue-100 text-sm mb-6">All modules (OPD, Lab, Pharmacy) are running optimally.</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="opacity-80">Database Sync</span>
              <span className="font-bold">Active</span>
            </div>
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: '100%' }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="h-full bg-white" 
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Stock Alerts</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                <AlertCircle size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Paracetamol</p>
                <p className="text-[10px] text-rose-600 font-bold">Low Stock: 5 Units</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Insulin</p>
                <p className="text-[10px] text-amber-600 font-bold">Expiring in 5 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PatientManagement = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Patient Directory</h1>
          <p className="text-slate-500 text-sm">Manage and search patient records</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <UserPlus size={18} /> Register New Patient
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/50 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, phone, or ID..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Demographics</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Visit</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {INITIAL_PATIENTS.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">{p.name}</p>
                        <p className="text-[10px] font-mono text-slate-400">#P-00{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-600">{p.age} years / {p.gender}</p>
                    <p className="text-xs text-slate-400">{p.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-md text-[10px] font-black bg-blue-50 text-blue-600 uppercase tracking-tighter border border-blue-100">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{p.lastVisit}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 font-bold text-xs hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Register New Patient">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); toast.success('Patient registered successfully!'); setShowAdd(false); }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase">Full Name</label>
              <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Abebe Bikila" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase">Phone Number</label>
              <input required type="tel" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0911223344" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase">Age</label>
              <input required type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="25" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase">Gender</label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={() => setShowAdd(false)} className="px-6 py-2.5 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="px-8 py-2.5 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">Complete Registration</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const OPDModule = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">OPD & Triage</h1>
        <p className="text-slate-500 text-sm">Managing patient intake and vital signs</p>
      </div>
      <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
        <button className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">Active Queue</button>
        <button className="px-4 py-1.5 text-slate-500 rounded-lg text-xs font-bold">History</button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Clock size={18} className="text-blue-600" /> Waiting List
        </h3>
        <div className="space-y-4">
          {INITIAL_PATIENTS.filter(p => p.status === 'Waiting').map((p, i) => (
            <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-300 transition-all cursor-pointer">
              <p className="font-bold text-slate-800 text-sm">{p.name}</p>
              <p className="text-[10px] text-slate-500 font-bold mt-1">ID: #P-00{p.id} • Arrived: 11:20 AM</p>
              <button className="mt-3 w-full py-2 bg-white text-blue-600 text-[10px] font-black border border-blue-100 rounded-lg hover:bg-blue-600 hover:text-white transition-colors uppercase tracking-widest">
                Start Triage
              </button>
            </div>
          ))}
          {INITIAL_PATIENTS.filter(p => p.status === 'Waiting').length === 0 && (
            <div className="text-center py-10">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={24} className="text-slate-300" />
              </div>
              <p className="text-xs text-slate-400 font-bold">No patients waiting</p>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500 text-white flex items-center justify-center text-2xl font-black">AB</div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Abebe Bikila</h2>
            <p className="text-slate-500 font-medium">45 Years Old • Male • #P-001</p>
          </div>
          <div className="ml-auto flex gap-3">
            <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-100">In Triage</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Blood Pressure</p>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-black text-slate-800">120/80</span>
              <span className="text-xs text-slate-400 font-bold pb-1">mmHg</span>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Temperature</p>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-black text-slate-800">37.2</span>
              <span className="text-xs text-slate-400 font-bold pb-1">°C</span>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Heart Rate</p>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-black text-slate-800">72</span>
              <span className="text-xs text-slate-400 font-bold pb-1">bpm</span>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Weight</p>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-black text-slate-800">74</span>
              <span className="text-xs text-slate-400 font-bold pb-1">kg</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Chief Complaint</label>
            <textarea className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none h-24" placeholder="Patient reports severe headache for 3 days..."></textarea>
          </div>
          <div className="flex justify-end gap-3">
            <button className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">Emergency Protocol</button>
            <button 
              onClick={() => toast.success('Triage completed and assigned to Doctor')}
              className="px-10 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
            >
              Assign to Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LaboratoryModule = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Laboratory Information System</h1>
        <p className="text-slate-500 text-sm">Digital specimen tracking and results</p>
      </div>
      <button className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 flex items-center gap-2">
        <Plus size={18} /> New Request
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Active Lab Orders</h3>
            <span className="text-[10px] font-black bg-rose-100 text-rose-600 px-2 py-0.5 rounded">2 URGENT</span>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { id: 'LB-441', name: 'Sara Yonas', test: 'Complete Blood Count', priority: 'High', status: 'In Process' },
              { id: 'LB-442', name: 'Kebede K.', test: 'Lipid Profile', priority: 'Normal', status: 'Pending Collection' },
              { id: 'LB-443', name: 'Abebe B.', test: 'Glucose Fasting', priority: 'Normal', status: 'Pending Collection' },
            ].map((order, i) => (
              <div key={i} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${order.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-purple-50 text-purple-600'}`}>
                    <Beaker size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{order.test}</p>
                    <p className="text-[10px] text-slate-500 font-bold">{order.name} • {order.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${order.status === 'In Process' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                    {order.status}
                  </span>
                  <button className="text-purple-600 font-bold text-xs underline">Upload Result</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-6">Equipment Status</h3>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-800">Hematology Analyzer</p>
              <p className="text-[10px] text-slate-400">Calibrated today at 08:00 AM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-800">Biochemistry System</p>
              <p className="text-[10px] text-slate-400">Active • 12 tests queued</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-800">Centrifuge A1</p>
              <p className="text-[10px] text-amber-600 font-bold">Maintenance due in 2 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PharmacyModule = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pharmacy & Drug Store</h1>
        <p className="text-slate-500 text-sm">Inventory and prescription fulfillment</p>
      </div>
      <button className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 flex items-center gap-2">
        <ClipboardList size={18} /> Inventory Check
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Pending Prescriptions</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {[
            { patient: 'Dawit Birhanu', drug: 'Amoxicillin 500mg', dosage: '1x3 for 7 days', dr: 'Girma' },
            { patient: 'Hana Kebede', drug: 'Paracetamol 500mg', dosage: '1x2 PRN', dr: 'Hagos' },
            { patient: 'Solomon T.', drug: 'Omeprazole 20mg', dosage: '1x1 for 14 days', dr: 'Girma' },
          ].map((rx, i) => (
            <div key={i} className="p-6 flex justify-between items-start hover:bg-slate-50 transition-colors">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Pill size={24} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{rx.drug}</p>
                  <p className="text-xs text-slate-500 font-medium mb-1">{rx.dosage}</p>
                  <p className="text-[10px] text-slate-400 font-bold">Patient: {rx.patient} • Ref: Dr. {rx.dr}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><X size={20} /></button>
                <button 
                  onClick={() => toast.success('Prescription dispensed!')}
                  className="px-6 py-2 bg-emerald-600 text-white text-xs font-black rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-50 transition-all uppercase tracking-widest"
                >
                  Dispense
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Fastest Moving Items</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                <span>Paracetamol</span>
                <span>84%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full">
                <div className="h-full bg-blue-500 w-[84%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                <span>Amoxicillin</span>
                <span>62%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full">
                <div className="h-full bg-emerald-500 w-[62%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                <span>ORS Packets</span>
                <span>45%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full">
                <div className="h-full bg-amber-500 w-[45%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} shadow-lg shadow-${color.split('-')[1]}-100 group-hover:scale-110 transition-transform`}>
        <Icon className="text-white" size={24} />
      </div>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        <span className="text-[10px] font-black">{trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%</span>
      </div>
    </div>
    <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">{title}</h3>
    <p className="text-3xl font-black text-slate-800 mt-1">{value}</p>
  </div>
);

// --- Main Layout ---

export default function App() {
  const [activeTab, setActiveTab] = useState<Module>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'patients': return <PatientManagement />;
      case 'opd': return <OPDModule />;
      case 'laboratory': return <LaboratoryModule />;
      case 'pharmacy': return <PharmacyModule />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Toaster position="top-right" richColors closeButton />
      
      {/* Sidebar Navigation */}
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col p-8 fixed h-full z-20">
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-200">
            <Stethoscope size={28} />
          </div>
          <div>
            <h2 className="font-black text-2xl text-slate-800 tracking-tighter leading-none">Laki Health</h2>
            <p className="text-[9px] text-blue-500 font-black uppercase tracking-[0.2em] mt-1.5">Digital Healthcare</p>
          </div>
        </div>

        <nav className="space-y-2.5 flex-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={Users} 
            label="Patient Registry" 
            active={activeTab === 'patients'} 
            onClick={() => setActiveTab('patients')} 
          />
          <SidebarItem 
            icon={Activity} 
            label="OPD & Triage" 
            active={activeTab === 'opd'} 
            onClick={() => setActiveTab('opd')} 
          />
          <SidebarItem 
            icon={Beaker} 
            label="Laboratory" 
            active={activeTab === 'laboratory'} 
            onClick={() => setActiveTab('laboratory')} 
          />
          <SidebarItem 
            icon={Pill} 
            label="Pharmacy" 
            active={activeTab === 'pharmacy'} 
            onClick={() => setActiveTab('pharmacy')} 
          />
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-50">
          <div className="p-5 bg-slate-50 rounded-3xl flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm overflow-hidden flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=100&auto=format&fit=crop" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-black text-slate-800 truncate">Dr. Tesfaye G.</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Chief Admin</p>
            </div>
            <LogOut size={18} className="text-slate-300 hover:text-rose-500 cursor-pointer transition-colors" />
          </div>
          <p className="text-center text-[10px] text-slate-300 font-bold">Laki Health v1.0.4 • 2024</p>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 ml-80 p-10 pb-16">
        <header className="flex justify-between items-center mb-12">
          <div className="relative w-full max-w-xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search health records, lab results, or inventory..." 
              className="w-full pl-12 pr-6 py-4 rounded-2xl border border-transparent bg-white shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-600"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#F8FAFC] bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[#F8FAFC] bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600">+8</div>
            </div>
            <button className="relative w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-3 h-3 bg-rose-500 border-4 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}