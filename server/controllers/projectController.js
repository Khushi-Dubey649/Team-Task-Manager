const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({ status: 'fail', message: 'Project name is required' });
        }

        const project = await prisma.project.create({
            data: {
                name,
                description,
                createdBy: req.user.id
            }
        });

        // Automatically add the creator as a project member
        await prisma.projectMember.create({
            data: {
                projectId: project.id,
                userId: req.user.id
            }
        });

        res.status(201).json({ status: 'success', data: { project } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

const getProjects = async (req, res) => {
    try {
        let projects;

        if (req.user.role === 'Admin') {
            // Admin sees all projects
            projects = await prisma.project.findMany({
                include: {
                    tasks: true,
                    members: true,
                    creator: { select: { name: true } }
                },
                orderBy: { createdAt: 'desc' }
            });
        } else {
            // Members see only projects they are members of
            projects = await prisma.project.findMany({
                where: {
                    members: {
                        some: { userId: req.user.id }
                    }
                },
                include: {
                    tasks: true,
                    members: true,
                    creator: { select: { name: true } }
                },
                orderBy: { createdAt: 'desc' }
            });
        }

        // Calculate progress for each project
        const projectsWithProgress = projects.map(p => {
            const totalTasks = p.tasks.length;
            const completedTasks = p.tasks.filter(t => t.status === 'Completed').length;
            const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
            return { ...p, progress, totalTasks, completedTasks };
        });

        res.status(200).json({ 
            status: 'success', 
            results: projectsWithProgress.length, 
            data: { projects: projectsWithProgress } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = { createProject, getProjects };
