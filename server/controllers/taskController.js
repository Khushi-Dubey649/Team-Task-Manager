const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getOverdueTasks = async (req, res) => {
    try {
        const userId = req.user.id; 
        const now = new Date();

        const overdueTasks = await prisma.task.findMany({
            where: {
                assignedTo: userId,
                status: {
                    not: 'Completed'
                },
                dueDate: {
                    lt: now
                }
            },
            include: {
                project: { select: { name: true } }
            },
            orderBy: { dueDate: 'asc' }
        });

        res.status(200).json({ status: 'success', results: overdueTasks.length, data: { tasks: overdueTasks } });
    } catch (error) {
        console.error('Error fetching overdue tasks:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, projectId, assignedTo } = req.body;

        if (!title || !projectId) {
            return res.status(400).json({ status: 'fail', message: 'Title and Project ID are required' });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority: priority || 'Medium',
                dueDate: dueDate ? new Date(dueDate) : null,
                projectId,
                assignedTo,
                createdBy: req.user.id
            }
        });

        res.status(201).json({ status: 'success', data: { task } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

const getProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params;

        const tasks = await prisma.task.findMany({
            where: { projectId },
            include: {
                assignee: { select: { name: true, email: true } },
                creator: { select: { name: true } },
                project: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ status: 'success', results: tasks.length, data: { tasks } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const task = await prisma.task.findUnique({ where: { id } });

        if (!task) {
            return res.status(404).json({ status: 'fail', message: 'Task not found' });
        }

        // Security check: Only Admin or Assignee can update
        if (req.user.role !== 'Admin' && task.assignedTo !== req.user.id) {
            return res.status(403).json({ status: 'fail', message: 'Forbidden: You can only update tasks assigned to you.' });
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { status }
        });

        res.status(200).json({ status: 'success', data: { task: updatedTask } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = {
    getOverdueTasks,
    createTask,
    getProjectTasks,
    updateTaskStatus
};
