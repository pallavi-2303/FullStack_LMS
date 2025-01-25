
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Navbar from './components/ui/Navbar'
import Login from './pages/Login'
import HeroSection from './pages/student/HeroSection'
import MainLayout from './layout/MainLayout'
import Courses from './pages/student/Courses'
import MyLearning from './pages/student/MyLearning'
import Profile from './pages/student/Profile'
import SideBar from './pages/admin/SideBar'
import Dashboard from './pages/admin/Dashboard'
import CourseTable from './pages/admin/course/CourseTable'
import AddCourse from './pages/admin/course/AddCourse'
import EditCourse from './pages/admin/course/EditCourse'
import CreateLecture from './pages/admin/lecture/CreateLecture'
import EditLecture from './pages/admin/lecture/EditLecture'
import CourseDetail from './pages/student/CourseDetail'
import CourseProgress from './pages/student/CourseProgress'
import SearchPage from './pages/student/SearchPage'
import { AdminRoute, AuthenticatedUser, ProtectedRoutes } from './components/ui/ProtectedRoutes'
import PurchaseCourseProtetedRoute from './components/ui/PurchaseCourseProtetedRoute'
import { ThemeProvider } from './components/ui/ThemeProvider'
const appRouter=createBrowserRouter([
  {
    path:"/",
    element:<MainLayout/>,
    children:[
    {
      path:"/",
      element:(
        <>
    <HeroSection/>  
    <Courses/>  
        </>
      )
    }  ,
    {
      path:"login",
      element:<AuthenticatedUser><Login/></AuthenticatedUser>
    },
    {
      path:"my-learning",
      element:<ProtectedRoutes><MyLearning/></ProtectedRoutes>
    },
    {
      path:"profile",
      element:<ProtectedRoutes><Profile/></ProtectedRoutes>
    },
    {
path:"course/search",
element:<ProtectedRoutes><SearchPage/></ProtectedRoutes>
    },
    {
      path:"course-detail/:courseId",
      element:<ProtectedRoutes><CourseDetail/></ProtectedRoutes>
    },
    {
      path:"course-progress/:courseId",
      element:<ProtectedRoutes>
      <PurchaseCourseProtetedRoute><CourseProgress/></PurchaseCourseProtetedRoute>  
        </ProtectedRoutes>
    },
    //admin route start from here
    {
      path:"admin",
      element:<AdminRoute><SideBar/></AdminRoute>,
      children:[
        {
          path:"dashboard",
          element:<Dashboard/>
        },
        {
          path:"course",
          element:<CourseTable/>
        },
        {
          path:"course/create",
          element:<AddCourse/>
        },
        {
          path:"course/:courseId",
          element:<EditCourse/>
        },
        {
          path:"course/:courseId/lecture",
          element:<CreateLecture/>
        },
        {
          path:"course/:courseId/lecture/:lectureId",
          element:<EditLecture/>
        },
        
      ]
    }

    ]
  }
])
function App() {


  return (
    <main> 
      <ThemeProvider><RouterProvider router={appRouter}/></ThemeProvider>
      
    </main>
  )
}

export default App
