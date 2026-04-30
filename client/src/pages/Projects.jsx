import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Folder, Plus, MoreVertical, Calendar, Users, BarChart } from 'lucide-react';
// import api from '../services/api';

export default function Projects() {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const isAdmin = user?.role === 'Admin';

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Uncomment when backend is running
                // const res = await api.get('/projects');
                // setProjects(res.data.data.projects);
                
                // MOCK DATA FOR DEMO
                setTimeout(() => {
                    const mockProjects = [
                        { id: '1', name: 'Platform V2 Redesign', description: 'Complete overhaul of the core application UI.', progress: 75, totalTasks: 12, completedTasks: 9, creator: { name: 'Admin User' } },
                        { id: '2', name: 'Q3 Marketing Campaign', description: 'Assets and copy for the upcoming product launch.', progress: 40, totalTasks: 5, completedTasks: 2, creator: { name: 'Admin User' } },
                        { id: '3', name: 'Mobile App Launch', description: 'React Native application for iOS and Android.', progress: 90, totalTasks: 20, completedTasks: 18, creator: { name: 'Team Member' } }
                    ];
                    // If member, pretend they only have access to project 1 and 3
                    setProjects(isAdmin ? mockProjects : [mockProjects[0], mockProjects[2]]);
                    setLoading(false);
                }, 600);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProjects();
    }, [isAdmin]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Projects</h1>
                    <p className="mt-1 text-slate-500">Manage and track the progress of your team's initiatives.</p>
                </div>
                
                {/* Admin Action Button */}
                {isAdmin && (
                    <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-sm hover:bg-indigo-700 hover:shadow transition-all group">
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        New Project
                    </button>
                )}
            </div>

            {/* Project Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl h-48 animate-pulse shadow-sm border border-slate-100"></div>
                    ))}
                </div>
            ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group flex flex-col h-full hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Folder className="w-6 h-6" />
                                </div>
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{project.name}</h3>
                            <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-2">{project.description}</p>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm text-slate-600 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <BarChart className="w-4 h-4 text-slate-400" />
                                        <span>Progress</span>
                                    </div>
                                    <span className="text-indigo-600 font-bold">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="flex -space-x-2">
                                        {/* Mock avatars */}
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">JD</div>
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">SM</div>
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                                            <Users className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                    <div className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                                        {project.completedTasks} / {project.totalTasks} Tasks
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4 transform -rotate-6">
                        <Folder className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No projects found</h3>
                    <p className="text-slate-500 max-w-sm mb-6">
                        {isAdmin ? "You haven't created any projects yet. Start by creating your first project." : "You haven't been assigned to any projects yet."}
                    </p>
                    {isAdmin && (
                        <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition-colors">
                            <Plus className="w-5 h-5" />
                            Create First Project
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
