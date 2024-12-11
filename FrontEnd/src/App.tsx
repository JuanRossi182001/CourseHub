import React from 'react';
import './App.css';
import Register from './register';
import AdminPanel from './admin';
import Login from './Login';
import UserList from './userList';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ProtectedRoute from './Auth/ProtectedRoute';
import CoursesList from './coursesList';
import CoursesGrid from './coursegrid';
import Home from './home';
import CourseDetail from './course';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentProcessor from './payment';
import PaymentSuccess from './payment-success';
import MyCoursesWithStyles from './MyCourses';

const stripePromise = loadStripe('pk_test_51Q7NSeP461sCLMYcWPLkuhWbcnmd1bZ2i5rsWxOXzdAu1lDeDD2qHxOgPEdNVLgLdrl8mZZDdhHALfiu67qct2Jo00Sd1QWBId');

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin/users" 
        element={
          <ProtectedRoute>
            <UserList />
            </ProtectedRoute>
          } />
        <Route path="/admin/courses" 
        element={
          <ProtectedRoute>
            <CoursesList />
            </ProtectedRoute>
          } />

        <Route
         path="/courses"
         element={ <ProtectedRoute>
            <CoursesGrid />
          </ProtectedRoute>
        } 
          />

        <Route path="/admin" 
        element={
          <ProtectedRoute>
            <AdminPanel/>
            </ProtectedRoute>
           } />

        <Route path='/home'
        element={ 
            <ProtectedRoute>
            <Home />
            </ProtectedRoute>
          } />

        <Route path= '/course/:id' 
        element={
          <ProtectedRoute>
            <CourseDetail/>
            </ProtectedRoute>
        } />

      <Route path="/payment/:courseId"
        element={
          <ProtectedRoute>
            <Elements stripe={stripePromise}>
              <PaymentProcessor/>
            </Elements>
          </ProtectedRoute>
        } />

      <Route path= '/payment-success' 
        element={
          <ProtectedRoute>
            <PaymentSuccess />
            </ProtectedRoute>
        } />

      <Route path= '/my-courses' 
        element={
          <ProtectedRoute>
            <MyCoursesWithStyles />
            </ProtectedRoute>
        } />


      </Routes>
    </Router>
  );
};

export default App;
