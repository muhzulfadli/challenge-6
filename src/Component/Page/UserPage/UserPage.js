import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UserPage = () => {
  const user = useSelector( store => store.user.data)

  return (
    <>
      <div>
        <h2>User Page</h2>
      </div>
      <div>
        { user !== null && <h3><Link to="/logout">Logout</Link></h3>}
      </div>
    </>
  )
}

export default UserPage