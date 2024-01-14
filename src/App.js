import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


/** import all components */
import UsernamePage from './Pages/Username';
import PasswordPage from './Pages/Password';
import RegisterPage from './Pages/Register';
import ProfilePage from './Pages/Profile';
import RecoveryPage from './Pages/Recovery';
import ResetPage from './Pages/Reset';
import PageNotFound from './Pages/PageNotFound';


/** auth middleware */
import {AuthorizeUser,ProtectRoute} from './middleware/Auth';

/** root routes */
const router = createBrowserRouter([
    {
        path : '/',
        element : <UsernamePage>Username</UsernamePage>
    },
    {
        path : '/register',
        element : <RegisterPage>Register Page</RegisterPage>
    },
    {
        path : '/password',
        element : <ProtectRoute><PasswordPage/></ProtectRoute>
    },
    {
        path : '/profile',
        element :<AuthorizeUser><ProfilePage/></AuthorizeUser> 
    },
    {
        path : '/recovery',
        element : <RecoveryPage></RecoveryPage>
    },
    {
        path : '/reset',
        element : <ResetPage></ResetPage>
    },
    {
        path : '*',
        element : <PageNotFound></PageNotFound>
    },
])

export default function App() {
  return (
    <main>
        <RouterProvider router={router}></RouterProvider>
    </main>
  )
}