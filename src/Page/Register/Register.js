import React, { useState } from 'react'
import style from './register.module.css'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { useDispatch } from "react-redux"
import userSlice from "../../store/user";

const Register = () => {

    const { register, handleSubmit, formState } = useForm()
    const [regStatus, setRegStatus] = useState({
        success: false,
        message: '',
      });

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const formSubmitHandler = (data) => {
        const postData = {
            email:data.user_email,
            password:data.user_password,
            isAdmin:false
        }

        axios.post('http://localhost:4000/login', postData)
        .then( res => {
            if ( typeof res.data.accessToken != 'undefined' ) {
                localStorage.setItem('challengeAccessToken', res.data.accessToken)

                const user = jwtDecode(res.data.accessToken)
                axios.get(`http://localhost:4000/users/${user.sub}`)
                .then( res => {
                    dispatch( userSlice.actions.addUser({ userData: res.data }) )
                    navigate('/login')
                })
            }
        }).catch ( err => {
            setRegStatus({
                success: false,
                message: "Email tidak valid",
              });
        })
    }

  return (
    <div className='content'>
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-9'>
                    <img src='./images/bg_image.png' alt='background' className={style.background} />
                </div>
                <div className={`col-3 ${style.rightSide} text-start`}>
                    <div className={`${style.logo} mb-4`}></div>
                    <h3 className="mb-5">Create New Account</h3>
                        { ( !regStatus.success && regStatus.message ) && <p className="text-danger font-italic ">{regStatus.message}</p>}
                        <form onSubmit={ handleSubmit(formSubmitHandler) }>
                            <div className="form-group first">
                                <label htmlFor="email" className="mb-3">Email</label>
                                <input type="email" className="form-control mb-3" id="email" name="email" {...register('user_email', {required: true})} autoComplete="true"/>
                                <p className="text-danger font-italic">{formState.errors.user_email?.type === 'required' && "Email is required"}</p>
                            </div>
                            <div className="form-group last mb-4">
                                <label htmlFor="user_password" className="mb-3">Password</label>
                                <input type="password" className="form-control mb-3" id="user_password" name="user_password" {...register('user_password',  {required: true})} autoComplete="true" />
                                <p className="text-danger font-italic">{formState.errors.user_password?.type === 'required' && "password is required"}</p>
                            </div>
                            <input type="submit" value="Register" className={`${style.button} btn-block btn-primary`} />
                            <p>Already have an account? <Link to="/login" className="text-primary">Login</Link></p>
                        </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Register