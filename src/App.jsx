import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase'; // Adjust import path as needed


import Questionnaire from '../src/components/Questionnaire';
import Persons from '../src/components/Persons';
import GroupInterface from '../src/components/GroupInterface';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Scheduler from "./components/Scheduler.jsx";
import Profile from './components/Profile.jsx';

// Protected Route wrapper component
const ProtectedRoute = ({ children, requiresAuth, requiresQuestionnaire, requiresGroup }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    let unsubscribe;
    
    const initializeAuth = async () => {
      try {
        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          setUser(currentUser);
          
          if (currentUser) {
            // Fetch user profile data
            try {
              const userDocRef = doc(db, 'users', currentUser.uid);
              const userDoc = await getDoc(userDocRef);
              if (userDoc.exists()) {
                setUserProfile(userDoc.data());
              } else {
                // If no profile exists, create an empty one
                setUserProfile({ questionnaireCompleted: false, groupMatched: false });
              }
            } catch (err) {
              console.error("Error fetching user profile:", err);
              setError(err.message);
            }
          } else {
            setUserProfile(null);
          }
          
          setLoading(false);
        });
      } catch (err) {
        console.error("Auth initialization error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    initializeAuth();
    return () => unsubscribe && unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Consider replacing with a proper loading component
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-600">Error: {error}</div>
    </div>;
  }

  if (requiresAuth && !user) {
    return <Navigate to="/signin" replace />;
  }

  if (requiresQuestionnaire && user && userProfile && (!userProfile?.questionnaireCompleted)) {
    return <Navigate to="/questions" replace />;
  }

  if (requiresGroup && user && userProfile && (!userProfile?.groupMatched)) {
    return <Navigate to="/persons" replace />;
  }

  return children;
};

// Auth Route wrapper component (redirects if already logged in)
const AuthRoute = ({ children }) => {
  const [authState, setAuthState] = useState({user: null, loading: true});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({user, loading: false});
    });

    return () => unsubscribe();
  }, []);

  if (authState.loading) {
    return <div>Loading...</div>;
  }

  if (authState.user) {
    return <Navigate to="/questions" replace />;
  }

  return children;
};

const App = () => {

  return (
    <Router>
      <Routes>
        {/* Public auth routes - redirect to questionnaire if already logged in */}
        <Route 
          path="/" 
          element={
            <AuthRoute>
              <SignUp />
            </AuthRoute>
          } 
        />
        <Route 
          path="/signin" 
          element={
            <AuthRoute>
              <SignIn />
            </AuthRoute>
          } 
        />

        {/* Protected routes with different requirements */}
        <Route 
          path="/questions" 
          element={
            <ProtectedRoute requiresAuth>
              <Questionnaire />
            </ProtectedRoute>
          } 
        />

        <Route
          path="/persons"
          element={
            <ProtectedRoute>
              <Persons />
            </ProtectedRoute>
          }
        />

        <Route
            path="/whentomeet"
            element={
              <ProtectedRoute>
                <Scheduler />
              </ProtectedRoute>
            }
        />

        <Route 
          path="/chat" 
          element={
            <ProtectedRoute requiresAuth requiresQuestionnaire requiresGroup>
              <GroupInterface />c
            </ProtectedRoute>
          } 
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute requiresAuth>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
