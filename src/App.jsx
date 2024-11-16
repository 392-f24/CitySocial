import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Questionnaire from '../src/components/Questionnare';
import Persons from '../src/components/Persons';
import GroupInterface from '../src/components/GroupInterface';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/questions" element={<Questionnaire />} />
        <Route path="/persons" element={<Persons />} />
        <Route path="/chat" element={<GroupInterface />} />
      </Routes>
    </Router>
  );
};

export default App;
