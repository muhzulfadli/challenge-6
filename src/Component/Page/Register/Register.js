import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import userSlice from '../../../store/user'
import style from './Register.module.css'

const Register = () => {

    const { register, handleSubmit, formState } = useForm()
    const [regStatus, setRegStatus ] = useState({
        succes: false,
        message:''
    })

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const formSubmitHandler = (data) => {
        const postData = {
            email: data.user_email,
            password: data.user_password,
            first_name: data.user_firstname,
            last_name: data.user_lastname,
            isAdmin: false,
        }

        axios.post('http://localhost:4000/register', postData)
        .then( res => {
            if ( typeof res.data.accessToken !== 'undefined') {
                localStorage.setItem('carAccessToken', res.data.accessToken)
                const user = jwtDecode(res.data.accessToken)
                axios.get(`http://localhost:4000/users/${user.sub}`)
                .then( res => {
                    dispatch( userSlice.actions.addUser({ userData: res.data }) )
                    if (res.data.isAdmin) {
                        navigate("/admin-page");
                    } else {
                        navigate("/user-page");
                    }
                })
            }
        }).catch( err => {
            setRegStatus({
                success: false,
                message:'Email tidak valid'
            })
        })
    }


    return (
        <div className={`${style['sign_in']} col`} data-testid="register-container">
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
                                <h3 className="mb-5"><b>Create new Account</b></h3>
                                { ( !regStatus.succes && regStatus.message ) && <h6 className={style.text_sm}>{regStatus.message}</h6>}
                                <form onSubmit={ handleSubmit(formSubmitHandler) } className={style.signin_form}>
                                    <div className="mb-4">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" name="email" id="email" class="form-control" placeholder="Contoh: johndee@gmail.com" {...register('user_email', {required: true})} autoComplete="true" />
                                        <p className={style.text_sm}>{formState.errors.user_email?.type === 'required' && "Email is required"}</p>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="user_password">Password</label>
                                        <input type="password" name="user_password" id="user_password" class="form-control" placeholder="6+ karakter" {...register('user_password',  {required: true})} autoComplete="true" />
                                        <p className={style.text_sm}>{formState.errors.user_password?.type === 'required' && "Password is required"}</p>
                                    </div>
                                    <button type="submit" className={`${style['btn_primary']} btn mt-4`}>Sign Up</button>
                                    
                                </form>
                                <p>Already have an account? <Link to="/login" className={`${style['login_text']} mt-4`}>Login</Link></p>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Register