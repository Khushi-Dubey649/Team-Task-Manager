const jwt = require('jsonwebtoken');

// 1) Protect routes (ensure user is logged in)
const protect = (req, res, next) => {
    let token;
    
    // Check if header is present and starts with Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'You are not logged in! Please log in to get access.' });
    }

    try {
        // Verify token using JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach decoded user info payload { id, role } to the request
        req.user = decoded; 
        
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

// 2) Restrict routes to specific roles (e.g. 'Admin')
const restrictTo = (...roles) => {
    return (req, res, next) => {
        // req.user must be set by the `protect` middleware first
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'You do not have permission to perform this action.' });
        }
        next();
    };
};

module.exports = { protect, restrictTo };
