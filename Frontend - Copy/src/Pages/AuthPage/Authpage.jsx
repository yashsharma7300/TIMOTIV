import { useState } from 'react'
import Left from './Left'
import Login from './Login'
import Signup from './Signup'

function Authpage() {

    const [showSignup, setShowSignup] = useState(false);


    return (
        <div className='w-full h-screen  flex'>
            <Left />

            {showSignup ? <Signup gotoLogin={() => setShowSignup(false)} /> : <Login gotoSignup={() => setShowSignup(true)} />}

        </div>
    )
}

export default Authpage