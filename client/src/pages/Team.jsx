import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, Shield, User as UserIcon, Mail, Calendar, CheckSquare } from 'lucide-react';
// import api from '../services/api';

export default function Team() {
    const { user } = useContext(AuthContext);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                // Uncomment when backend is running
                // const res = await api.get('/users');
                // setMembers(res.data.data.users);
                
                // MOCK DATA FOR DEMO
                setTimeout(() => {
                    setMembers([
                        { id: '1', name: 'Khushi', email: 'khushi@example.com', role: 'Admin', createdAt: '2023-01-15T00:00:00Z' },
                        { id: '2', name: 'John Smith', email: 'john@example.com', role: 'Member', createdAt: '2023-05-20T00:00:00Z' },
                        { id: '3', name: 'Sarah Connor', email: 'sarah@example.com', role: 'Member', createdAt: '2023-08-10T00:00:00Z' }
                    ]);
                    setLoading(false);
                }, 600);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    // Extra security check (should also be protected via routing)
    if (user?.role !== 'Admin') {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
                    <h2 className="text-2xl font-bold text-slate-800">Access Denied</h2>
                    <p className="text-slate-500 mt-2">You do not have permission to view team management.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Team Management</h1>
                <p className="mt-1 text-slate-500">View and manage all members registered on the platform.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 text-right">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><div className="h-10 bg-slate-50 animate-pulse rounded-lg w-48"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-slate-50 animate-pulse rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-slate-50 animate-pulse rounded-full w-16"></div></td>
                                        <td className="px-6 py-4 flex justify-end"><div className="h-6 bg-slate-50 animate-pulse rounded w-24"></div></td>
                                    </tr>
                                ))
                            ) : members.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-shrink-0 items-center justify-center text-white shadow-sm font-bold text-sm">
                                                {member.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{member.name}</p>
                                                {member.id === user?.id && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mt-0.5 inline-block">You</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            {member.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                                            member.role === 'Admin' 
                                            ? 'text-amber-700 bg-amber-50 border-amber-200' 
                                            : 'text-slate-600 bg-slate-50 border-slate-200'
                                        }`}>
                                            {member.role === 'Admin' ? <Shield className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium text-slate-500 flex items-center justify-end gap-2">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        {new Date(member.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Quick Demo Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <CheckSquare className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
                    <h3 className="text-indigo-100 font-medium text-sm mb-1">Total Team Members</h3>
                    <p className="text-4xl font-extrabold">{members.length}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 text-slate-800 shadow-sm border border-slate-200 flex flex-col justify-center">
                    <h3 className="text-slate-500 font-medium text-sm mb-2 flex items-center gap-2"><Shield className="w-4 h-4" /> Admin Count</h3>
                    <p className="text-3xl font-extrabold">{members.filter(m => m.role === 'Admin').length}</p>
                </div>
            </div>
        </div>
    );
}
