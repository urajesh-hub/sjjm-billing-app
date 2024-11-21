import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';  // Adjust the path based on your file structure
import MealForm from './components/MealForm';
import EmpList from './components/EmpList';
import CalculatedMeals from './components/CalculatedMeals';
import Home from './components/Home';
import MealFormManager from './components/MealFormManager';
import Category from './components/Category';






const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meal-form" element={<MealForm />} />
          <Route path="/emp-list" element={<EmpList />} />
          <Route path="/calculated-meals" element={<CalculatedMeals />} />
          <Route path="/Entry-meals" element={<MealFormManager />} />
          <Route path="//category-meals" element={<Category />} />
        
        </Routes>
      </div>
    </Router>
  );
};

export default App;
