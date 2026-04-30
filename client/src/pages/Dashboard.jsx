import { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle2, TrendingUp, Folder, ArrowRight } from 'lucide-react';
// import api from '../services/api';

export default function Dashboard() {
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch overdue tasks
        const fetchDashboardData = async () => {
            try {
                // const res = await api.get('/tasks/overdue');
                // setOverdueTasks(res.data.data.tasks);
                
                // MOCK DATA FOR DEMO
                setTimeout(() => {
                    setOverdueTasks([
                        { id: 1, title: 'Finalize Q3 Marketing Assets', project: { name: 'Q3 Campaign' }, dueDate: '2023-09-30T00:00:00Z', priority: 'High' },
                        { id: 2, title: 'Update Authentication Flow', project: { name: 'Platform V2' }, dueDate: '2023-10-05T00:00:00Z', priority: 'Medium' }
                    ]);
                    setLoading(false);
                }, 600);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const stats = [
        { name: 'Active Projects', value: '12', change: '+2', icon: Folder, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Tasks Completed', value: '143', change: '+28%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { name: 'Productivity', value: '94%', change: '+4%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-100' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                <p className="mt-1 text-slate-500">Here is what's happening with your projects today.</p>
            </div>

            {/* Overdue Tasks Banner / Section */}
            {loading ? (
                <div className="h-32 bg-slate-100 animate-pulse rounded-2xl"></div>
            ) : overdueTasks.length > 0 ? (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-all hover:shadow-md">
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-red-800">Action Required: Overdue Tasks</h3>
                        <p className="text-red-600 text-sm mt-1 font-medium">You have {overdueTasks.length} tasks that require your immediate attention.</p>
                    </div>
                    <button className="whitespace-nowrap px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-red-700 transition-colors flex items-center gap-2">
                        Review Tasks <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            ) : null}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                            <stat.icon className="w-32 h-32" />
                        </div>
                        <div className="relative flex items-center gap-4">
                            <div className={`p-4 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500">{stat.name}</p>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
                                    <p className="text-sm font-bold text-emerald-500">{stat.change}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Task Grid & Project Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Projects Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Active Projects</h2>
                        <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">View All</button>
                    </div>
                    <div className="space-y-6 flex-1">
                        {[
                            { name: 'Platform V2 Redesign', progress: 75, color: 'bg-indigo-600' },
                            { name: 'Q3 Marketing Campaign', progress: 40, color: 'bg-emerald-500' },
                            { name: 'Mobile App Launch', progress: 90, color: 'bg-purple-500' }
                        ].map(project => (
                            <div key={project.name}>
                                <div className="flex justify-between text-sm font-semibold mb-2">
                                    <span className="text-slate-800">{project.name}</span>
                                    <span className="text-slate-500">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div className={`h-2.5 rounded-full ${project.color} transition-all duration-1000`} style={{ width: `${project.progress}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Overdue Task Detail List */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-slate-900">Priority Tasks</h2>
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{overdueTasks.length}</span>
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex flex-col gap-4">
                             <div className="h-16 bg-slate-50 rounded-xl animate-pulse"></div>
                             <div className="h-16 bg-slate-50 rounded-xl animate-pulse"></div>
                        </div>
                    ) : (
                        <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {overdueTasks.map(task => (
                                <div key={task.id} className="p-4 rounded-xl border border-slate-100 hover:border-red-200 bg-slate-50/50 hover:bg-red-50/30 transition-colors group cursor-pointer flex gap-4 items-center">
                                    <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate">{task.title}</p>
                                        <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1.5">
                                            <Folder className="w-3 h-3" /> {task.project.name}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
                                            <Clock className="w-3 h-3" /> Overdue
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
