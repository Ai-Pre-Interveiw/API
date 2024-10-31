import { Navigate } from 'react-router-dom'

const PrivateRoute = (props: {
  authenticated: boolean
  Component: React.ReactNode
}) => {
  const { authenticated, Component } = props
  return authenticated ? Component : <Navigate to="/login" />
}

export default PrivateRoute