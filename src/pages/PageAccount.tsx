import './styles/pageAccount.css'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { millionApi } from '../api/millionApi'
import { useSelector } from 'react-redux'
import { RootState, UserData } from '../interfaces'

export const PageAccount = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const accessToken = useSelector((state: RootState) => state.user.accessToken)
  const {
    register: registerInfo,
    handleSubmit: handleSubmitInfo,
    setValue: setValueInfo
  } = useForm()
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    formState: { errors: errorsPassowrd }
  } = useForm()

  const getUserData = () => {
    millionApi.get('/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(res => {
        let { data } = res
        setUserData(data[0])
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getUserData()
  }, [])

  useEffect(() => {
    if (userData) {
      setValueInfo('username', userData.username)
      setValueInfo('name', userData.name)
      setValueInfo('email', userData.email)
      setValueInfo('last_name', userData.last_name)
      setValueInfo('country', userData.country)
      setValueInfo('city', userData.city)
    }
  }, [userData, setValueInfo])


  const submitInfo = (data: any) => {
    console.log('data', data);
  }

  const submitChangePassword = (data: any) => {
    millionApi.put('/user/password', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  return (
    <div className="page">
      <div className="pageMainContent pageAccount">
        <form onSubmit={handleSubmitInfo(submitInfo)} className="info">
          <h2>Personal Information</h2>
          <label>Username</label>
          <input
            type="text"
            {...registerInfo('name')}
          />
          <label>Email</label>
          <input
            type="text"
            {...registerInfo('name')}
          />
          <label>Name</label>
          <input
            type="text"
            {...registerInfo('name')}
          />
          <label>Last Name</label>
          <input
            type="text"
            {...registerInfo('last_name')}
          />
          <label>Country</label>
          <input
            type="text"
            {...registerInfo('country')}
          />
          <label>City</label>
          <input
            type="text"
            {...registerInfo('city')}
          />
          <button className='btn btn-success'>Save</button>
        </form>
        <hr />
        <form onSubmit={handleSubmitPassword(submitChangePassword)} className="info">
          <h2>Change Password</h2>
          <label>Password</label>
          <input
            {...registerPassword('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
            type="password"
            name="password"
          />
          {errorsPassowrd.password && <p className="error">{String(errorsPassowrd.password.message)}</p>}
          <label>New Password</label>
          <input
            type="password"
            {...registerPassword('newPassword', { required: 'New Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
          />
          {errorsPassowrd.newPassword && <p className="error">{String(errorsPassowrd.newPassword.message)}</p>}
          <label>Confirm New Password</label>
          <input
            type="password"
            {...registerPassword('confirm_new_password', { validate: (value) => value === watchPassword('newPassword') || 'Passwords do not match' })}
          />
          {errorsPassowrd.confirm_new_password && <p className="error">{String(errorsPassowrd.confirm_new_password.message)}</p>}
          <button className="btn btn-success">Save</button>
        </form>
      </div>
    </div>
  )
}