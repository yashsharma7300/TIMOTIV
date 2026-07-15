import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { loginSchema } from "../../Validation/AuthValidation";
import { login } from "../../services/authServices";
import { GoogleLogin } from "@react-oauth/google";

function Login({ gotoSignup }) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)



    const isFormEmpty = !email.trim() || !password.trim()

    const handleLogin = async (e) => {
        e.preventDefault()



        // manual validation 

        // if (!email) {
        //     toast.error("plz enter email")
        //     return
        // }

        // if (!email.includes('@') || email.length < 3) {
        //     toast.error("Please enter a valid email")
        //     return
        // }

        // if (!password) {
        //     toast.error("plz enter password")
        //     return
        // }

        // const formData = {
        //     email,
        //     password
        // }

        // try {
        //     loginSchema.parse(formData) // parse automaticaally stop if any error comes up in validation 
        //     console.log(formData)

        //     toast.success("Login Successfull")


        // } catch (error) {
        //     console.log(error)
        //     toast.error(error.issues[0].message); // may use for each but may beacome spammy type 
        //     return
        // }

        const formData = {
            email, password
        }

        try {
            loginSchema.parse(formData)
            const result = await login(formData)
            toast.success(result.message)

        } catch (error) {
            if (error.issues && error.issues.length > 0) {
                toast.error(error.issues[0].message);
            } else {
                toast.error(error.response?.data?.message || error.message || "Something went wrong");
            }
        }

    }



    return (





        <div className="w-5/12 flex items-center justify-center h-full bg-[#090909]">

            <div className="w-[430px] rounded-[32px] border border-neutral-800 bg-[#0b0b0b] px-10 py-12">

                <header>
                    {/* Logo */}
                    <p className="text-sm tracking-[0.45em] font-semibold text-neutral-200">
                        TIMOTIVE
                    </p>

                    <div className='mt-10'>
                        <h1 className='text-white text-3xl font-bold'>
                            Welcome Back !
                        </h1>

                        <p className="mt-3 text-lg text-neutral-500">
                            Continue your productivity journey.
                        </p>
                    </div>
                </header>

                <form onSubmit={handleLogin}>


                    {/* email */}

                    <div className='mt-10'>

                        <label htmlFor="email" className='text-white text-md font-bold tracking-wider '> Email: </label>

                        <input type="email" id="email" className='w-full p-2 rounded-lg border border-neutral-800 bg-[#121212] text-white'
                            placeholder='example@gmail.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                    </div>

                    {/* password */}

                    <div className='mt-10'>

                        <label htmlFor="pass" className='text-white text-md font-bold tracking-wider'>Password : </label>



                        <div className='relative mt-3 flex justify-end items-center'>

                            <input type={showPassword ? "text" : "password"}
                                name="" id="pass"
                                className='w-full p-2 rounded-lg border border-neutral-800 bg-[#121212] text-white'
                                placeholder='enter your password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <button type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute right-3 text-gray-500"
                            >
                                {showPassword ? <FiEye /> : <FiEyeOff />}
                            </button>

                        </div>
                    </div>

                    {/* forgot password and remember me */}
                    {/* i am leaving it , will work on it later , OTP MODAL  */}

                    {/*  
                    <div className="mt-6 flex items-center justify-between text-sm">

                        <label className="flex items-center gap-2 text-neutral-400 cursor-pointer">
                            <input
                                type="checkbox"
                                className="h-4 w-4 accent-violet-600"
                            />
                            Remember me
                        </label>

                        <button className="font-semibold text-neutral-200 hover:text-white transition">
                            Forgot password?
                        </button>

                    </div> */}


                    {/* Login */}
                    {/* className='w-full bg-violet-600 text-white py-2 rounded-lg font-bold text-lg hover:bg-violet-700 transition' */}

                    <div className='mt-10'>
                        <button

                            disabled={isFormEmpty}
                            type="submit"
                            className={`w-full text-white py-2 rounded-lg font-bold text-lg ${isFormEmpty ? `bg-gray-700 cursor-not-allowed` : `bg-violet-600 hover:bg-violet-700 transition `}`}
                        >
                            Login
                        </button>
                    </div>


                </form>

                {/* OR */}

                <div className='flex justify-between items-center mt-6'>

                    <div className='h-[1px] w-full bg-neutral-800'></div>

                    <span className='text-gray-500 mx-2 text-sm font-bold tracking-widest uppercase'>OR</span>

                    <div className='h-[1px] w-full bg-neutral-800'></div>

                </div>

                {/* google  */}

                <button className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-[#0b0b0b] px-6 py-3 text-sm font-semibold text-neutral-200 hover:bg-[#141414] transition">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M23.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h6.16c-.26 1.36-1.04 2.53-2.2 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23.5c3.05 0 5.61-.99 7.59-2.68l-3.57-2.77c-.98.66-2.23 1.06-3.57 1.06-2.76 0-5.09-1.82-5.93-4.26H2.38v2.85C4.36 21.03 8.07 23.5 12 23.5z"
                            fill="#34A853"
                        />
                        <path
                            d="M6.07 15.9c-.27-.77-.42-1.59-.42-2.42s.15-1.65.42-2.42V5.85C4.16 7.4 3 9.63 3 12s1.16 4.6 3 6.15l.05-.07z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.16c1.68 0 3.15.59 4.31 1.74l3.37-3.37C17.61.88 15.05 0 12 0 8.07 0 4.36 2.47 2.38 5.85l3.69 2.85c.84-2.44 3.17-4.26 5.93-4.26z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continue with Google
                </button>

                <GoogleLogin
                    onSuccess={(credentialResponse) => {
                        console.log("Google Success:", credentialResponse);
                    }}
                    onError={() => {
                        console.log("Google Login Failed");
                    }}
                />

                {/* sign up option  */}

                <footer className='mt-10'>
                    {/* 
                        <p className='text-neutral-500 text-center'>Don't have an account? <Link to="/signup" className='text-white font-semibold hover:text-violet-600'>Sign Up</Link></p> */}

                    <p className='text-neutral-500 text-center'>
                        Don't have an account?{" "}
                        <button
                            onClick={gotoSignup}
                            className='text-white font-semibold hover:text-violet-600'
                        >
                            Sign Up
                        </button>
                    </p>

                </footer>




            </div>

        </div>


    )

}

export default Login