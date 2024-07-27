import { ReactElement } from "react"
import { Navigate, Outlet } from "react-router-dom"

type PropsType = {
  children?: ReactElement,
  isLoggedIn: boolean,
  redirectPath?: string
}

function ProtectedRoute({ children, isLoggedIn, redirectPath = '/' }: PropsType) {

  if (!isLoggedIn) return <Navigate to={redirectPath} />

  return (
    children ? children : <Outlet />
  )
}

export default ProtectedRoute
