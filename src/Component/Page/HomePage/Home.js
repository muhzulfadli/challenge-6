import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Home = () => {

    const user = useSelector( store => store.user.data)

    return (
        <>
            <div>
                { user === null && <h3><Link to="/login">Login</Link></h3>}
            </div>
            <div>
                { user !== null && <h3><Link to="/logout">Logout</Link></h3>}
            </div>

        </>
    )
}

export default Home