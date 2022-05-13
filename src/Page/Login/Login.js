import React, { useState }from 'react'
import style from './login.module.css'
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import userSlice from "../../store/user";
import axios from "axios";

const Login = () => {

    const { register, handleSubmit, formState } = useForm()
    const [loginStatus, setLoginStatus] = useState({
        success: false,
        message: '',
      });

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const formSubmitHandler = (data) => {
        const postData = {
            email:data.user_email,
            password:data.user_password
        }

        axios.post('http://localhost:4000/login', postData)
        .then( res => {
            if ( typeof res.data.accessToken != 'undefined' ) {
                localStorage.setItem('challengeAccessToken', res.data.accessToken)

                const user = jwtDecode(res.data.accessToken)
                axios.get(`http://localhost:4000/users/${user.sub}`)
                .then( res => {
                    dispatch( userSlice.actions.addUser({ userData: res.data }) )
                    navigate('/userPage')
                })
            }
        }).catch ( err => {
            setLoginStatus({
                success: false,
                message: "Kombinasi login yang Anda masukkan salah. Lupa data login?",
              });
        })
    }

  return (
    <div className='login-page'>
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-9'>
                    <img src='./images/bg_image.png' alt='background' className={style.background} />
                </div>
                <div className={`col-md-3 ${style.rightSide}`}>
                    <img src='./images/logo.png' className={style.logo} />
                    <h3 className="mb-5">Welcome, Admin BCR</h3>
                        { ( !loginStatus.success && loginStatus.message ) && <p className="text-danger font-italic ">{loginStatus.message}</p>}
                        <form onSubmit={ handleSubmit(formSubmitHandler) }>
                            <div className="form-group first">
                                <label htmlFor="email" className="mb-3">Email</label>
                                <input type="email" className="form-control mb-3" id="username" name="email" {...register('user_email', {required: true})} autoComplete="true"/>
                                <p className="text-sm text-red-500 italic">{formState.errors.user_email?.type === 'required' && "Email is required"}</p>
                            </div>
                            <div className="form-group last mb-4">
                                <label htmlFor="user_password" className="mb-3">Password</label>
                                <input type="password" className="form-control mb-3" id="user_password" name="user_password" {...register('user_password',  {required: true})} autoComplete="true" />
                                <p className="text-sm text-red-500 italic">{formState.errors.user_password?.type === 'required' && "password is required"}</p>
                            </div>
                            <input type="submit" className={`${style.button} btn-block btn-primary`} />
                            <p>Don't have an account? <Link to="/register" className="text-primary">Register</Link></p>
                        </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login