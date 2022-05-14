import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import userSlice from '../../../store/user'
import style from './Login.module.css'
import { GoogleLogin } from 'react-google-login';

const Login = () => {

    const { register, handleSubmit, formState } = useForm()
    const [loginStatus, setLoginStatus ] = useState({
        succes: false,
        message:''
    })

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const formSubmitHandler = (data) => {
        const postData = {
            email: data.user_email,
            password: data.user_password
        }

        axios.post('http://localhost:4000/login', postData)
        .then( res => {
            if ( typeof res.data.accessToken !== 'undefined') {
                localStorage.setItem('carAccessToken', res.data.accessToken)
                const user = jwtDecode(res.data.accessToken)
                axios.get(`http://localhost:4000/users/${user.sub}`)
                .then( res => {
                    dispatch( userSlice.actions.addUser({ userData: res.data }) )
                    navigate('/')
                })
            }
        }).catch( err => {
            setLoginStatus({
                success: false,
                message:'Kombinasi login yang Anda masukkan salah. Lupa data login?'
            })
        })
    }
    const googleSuccessLogin = (res) => {
        console.log(res)
    }

    const googleFailedLogin = (err) => {
        console.log(err)
    }
    return (
        <div className={`${style['sign_in']} col`}>
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-lg-8">
                        <div className="signin_img">
                            <img src="/images/bg_image.png" alt="" className={style.signin_img} />
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="signin_form">
                            <div className="mb-4">
                                <img src="/images/logo.png" alt="" className="mb-5 logo-img" />
                                <h3 className="mb-5"><b>Login</b></h3>
                                { ( !loginStatus.succes && loginStatus.message ) && <h6 className={style.text_sm}>{loginStatus.message}</h6>}
                                <form onSubmit={ handleSubmit(formSubmitHandler) } className={style.signin_form}>
                                    <div className="mb-4">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" name="email" id="email" class="form-control" placeholder="Contoh: johndee@gmail.com" {...register('user_email', {required: true})} autoComplete="true" data-testid="input-email"/>
                                        <p className={style.text_sm}>{formState.errors.user_email?.type === 'required' && "Email is required"}</p>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="user_password">Password</label>
                                        <input type="password" name="user_password" id="user_password" class="form-control" placeholder="6+ karakter" {...register('user_password',  {required: true})} autoComplete="true" data-testid="input-password"/>
                                        <p className={style.text_sm}>{formState.errors.user_password?.type === 'required' && "Password is required"}</p>
                                    </div>
                                    <button type="submit" className={`${style['btn_primary']} btn mt-4`}>Sign In</button>
                                </form>
                                <p>Don't have an account? <Link to="/register" className={`${style['login_text']} mt-4`} data-testid="button">Register Now</Link></p>
                                <GoogleLogin
                                    clientId="547625838498-ipttddpf985fa7gksm8qsiie11295r48.apps.googleusercontent.com"
                                    buttonText="Login"
                                    onSuccess={googleSuccessLogin}
                                    onFailure={googleFailedLogin}
                                    cookiePolicy={'single_host_origin'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Login