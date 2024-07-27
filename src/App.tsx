import { lazy, Suspense, useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import Loader from "./components/Loader.tsx"
import Headers from "./components/Header.tsx"
import { useDispatch, useSelector } from "react-redux"
import { userExists, userNotExists } from "./redux/reducers/userReducer.ts"
import supabase from "./supabase/config.ts"
import ProtectedRoute from "./components/ProtectedRoute.tsx"
import { RootState } from "./redux/store.ts"
const Home = lazy(() => import('./pages/Home.tsx'))
const Auth = lazy(() => import('./pages/Auth.tsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.tsx'))
const Link = lazy(() => import('./pages/Link.tsx'))
const Redirect = lazy(() => import('./pages/Redirect.tsx'))
const NotFound = lazy(() => import('./pages/NotFound.tsx'))

function App() {

  const dispatach = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      dispatach(userExists({ id: user.id, name: user.user_metadata.name, profile_pic: user.user_metadata.profile_pic, email: user.email, role: user.role }));
    } else {
      dispatach(userNotExists());
    }
  }

  useEffect(() => {

    checkUser();

  }, [])

  return (
    <div className="bg-[#f7f7f7]">

      <Headers />
      <Suspense fallback={<Loader />} >
        <Routes>
          <Route path="/" element={<Home />} />


          <Route path="/auth" element={
            <ProtectedRoute isLoggedIn={!user ? true : false} redirectPath="/dashboard">
              <Auth />
            </ProtectedRoute>
          } />


          {/* Login Routes */}
          {/* <Route element={<ProtectedRoute isLoggedIn={user ? true : false} />}> */}

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/link/:id" element={<Link />} />
          <Route path="/:id" element={<Redirect />} />
          {/* </Route> */}

          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Suspense>

    </div>
  )
}

export default App
