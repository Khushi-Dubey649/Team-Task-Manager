import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, Circle, AlertCircle, Clock, Flag, Plus, Search, Filter } from 'lucide-react';
// import api from '../services/api';

export default function Tasks() {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const isAdmin = user?.role === 'Admin';

    useEffect(() => {
        // Fetch tasks
        const fetchTasks = async () => {
            try {
                // Uncomment when backend is running
                // const res = await api.get(`/tasks/project/mockProjectId`);
                
                // MOCK DATA FOR DEMO
                setTimeout(() => {
                    setTasks([
                        { id: '1', title: 'Design Database Schema', status: 'Completed', priority: 'High', assignee: { id: user?.id, name: user?.name }, project: { name: 'Platform V2' }, dueDate: '2023-10-01' },
                        { id: '2', title: 'Implement AuthContext', status: 'In Progress', priority: 'High', assignee: { id: user?.id, name: user?.name }, project: { name: 'Platform V2' }, dueDate: '2023-10-15' },
                        { id: '3', title: 'Write API Documentation', status: 'Pending', priority: 'Low', assignee: { id: 'other-user', name: 'Sarah Connor' }, project: { name: 'Platform V2' }, dueDate: null },
                        { id: '4', title: 'Create Marketing Assets', status: 'Pending', priority: 'Medium', assignee: { id: 'other-user', name: 'John Smith' }, project: { name: 'Q3 Campaign' }, dueDate: '2023-09-30' },
                    ]);
                    setLoading(false);
                }, 600);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchTasks();
    }, [user]);

    const handleStatusToggle = async (taskId, currentStatus, taskAssigneeId) => {
        // Optimistic update
        const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
        
        // Security Rule Simulation for UI Demo
        if (!isAdmin && taskAssigneeId !== user?.id) {
            setErrorMsg("Forbidden: You can only update tasks assigned to you.");
            setTimeout(() => setErrorMsg(null), 3000);
            return;
        }

        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

        try {
            // Uncomment when backend is running
            // await api.put(`/tasks/${taskId}/status`, { status: newStatus });
        } catch (err) {
            // Revert on error
            setTasks(tasks.map(t => t.id === taskId ? { ...t, status: currentStatus } : t));
            setErrorMsg(err.response?.data?.message || 'Failed to update task.');
            setTimeout(() => setErrorMsg(null), 3000);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'text-red-600 bg-red-50 border-red-200';
            case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'Low': return 'text-blue-600 bg-blue-50 border-blue-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tasks</h1>
                    <p className="mt-1 text-slate-500">Manage your assignments and track progress.</p>
                </div>
                
                <div className="flex gap-3">
                    <button className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors shadow-sm bg-white">
                        <Filter className="w-5 h-5" />
                    </button>
                    {isAdmin && (
                        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-sm hover:bg-indigo-700 hover:shadow transition-all group">
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            Add Task
                        </button>
                    )}
                </div>
            </div>

            {/* Error Toast */}
            {errorMsg && (
                <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium text-sm">{errorMsg}</span>
                </div>
            )}

            {/* Search/Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search tasks by name or project..." 
                    className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400 font-medium"
                />
            </div>

            {/* Task List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <div className="col-span-6 sm:col-span-5 pl-2">Task Details</div>
                    <div className="col-span-2 hidden sm:block">Project</div>
                    <div className="col-span-3">Assignee</div>
                    <div className="col-span-3 sm:col-span-2 text-right pr-4">Priority</div>
                </div>

                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                    {loading ? (
                        [1,2,3,4].map(i => <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse mx-2"></div>)
                    ) : tasks.length === 0 ? (
                        <div className="h-full flex flex-col justify-center items-center text-slate-400 pb-12">
                            <CheckCircle2 className="w-12 h-12 mb-3 text-slate-300" />
                            <p className="font-medium text-slate-500">No tasks found.</p>
                        </div>
                    ) : tasks.map(task => {
                        const isCompleted = task.status === 'Completed';
                        const canEdit = isAdmin || task.assignee?.id === user?.id;

                        return (
                            <div 
                                key={task.id} 
                                className={`grid grid-cols-12 gap-4 p-3 rounded-xl border transition-all duration-200 items-center group
                                    ${isCompleted ? 'bg-slate-50 border-slate-100 opacity-60 hover:opacity-100' : 'bg-white border-transparent hover:border-slate-200 hover:shadow-sm'}
                                `}
                            >
                                {/* Checkbox & Title */}
                                <div className="col-span-6 sm:col-span-5 flex items-center gap-3 pl-1">
                                    <button 
                                        onClick={() => handleStatusToggle(task.id, task.status, task.assignee?.id)}
                                        className={`flex-shrink-0 transition-transform active:scale-90 ${!canEdit && !isAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'}`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                        ) : (
                                            <Circle className="w-6 h-6 text-slate-300 hover:text-indigo-400" />
                                        )}
                                    </button>
                                    <div className="min-w-0">
                                        <p className={`font-bold truncate ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                            {task.title}
                                        </p>
                                        {task.dueDate && (
                                            <p className="text-[11px] font-semibold text-slate-400 mt-0.5 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Due {new Date(task.dueDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Project Tag */}
                                <div className="col-span-2 hidden sm:flex items-center">
                                    <span className="truncate px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">
                                        {task.project.name}
                                    </span>
                                </div>

                                {/* Assignee */}
                                <div className="col-span-3 flex items-center gap-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 ${task.assignee?.id === user?.id ? 'bg-indigo-600' : 'bg-slate-400'}`}>
                                        {task.assignee?.name.substring(0, 2).toUpperCase() || '?'}
                                    </div>
                                    <span className={`text-xs font-semibold truncate ${task.assignee?.id === user?.id ? 'text-indigo-700' : 'text-slate-600'}`}>
                                        {task.assignee?.id === user?.id ? 'You' : task.assignee?.name}
                                    </span>
                                </div>

                                {/* Priority Badge */}
                                <div className="col-span-3 sm:col-span-2 flex justify-end pr-2">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
                                        <Flag className="w-3 h-3" />
                                        {task.priority}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
