const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret_for_development', {
        expiresIn: '30d'
    });
};

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide name, email and password' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ status: 'fail', message: 'Email already in use' });
        }

        // Quick-Win: First user is automatically an Admin
        const userCount = await prisma.user.count();
        const role = userCount === 0 ? 'Admin' : 'Member';

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create User
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role
            }
        });

        const token = signToken(newUser.id, newUser.role);

        // Remove passwordHash from response for security
        newUser.passwordHash = undefined;

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // Verify user and password
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
        }

        const token = signToken(user.id, user.role);
        
        user.passwordHash = undefined;

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = { signup, login };
