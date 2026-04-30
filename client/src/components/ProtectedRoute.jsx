import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        // User not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        // User logged in but does not have the required role
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
