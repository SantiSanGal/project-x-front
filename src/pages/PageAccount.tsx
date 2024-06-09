import { useEffect, useState } from 'react'
import './styles/pageAccount.css'
import { useForm } from 'react-hook-form'
import { millionApi } from '../api/millionApi'
import { useSelector } from 'react-redux'
import { RootState } from '../interfaces'

export const PageAccount = () => {
  const [userData, setUserData] = useState()
  const accessToken = useSelector((state: RootState) => state.user.accessToken)

  const getUserData = () => {
    millionApi.get('/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(res => {
        let { data } = res
        setUserData(state => data)
      })
      .catch(err => console.log(err))
  }


  useEffect(() => {
    getUserData()
  }, [])

  const { register: registerInfo, handleSubmit: handleSubmitInfo } = useForm()
  const { register: registerPassword, handleSubmit: handleSubmitPassword } = useForm()

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
            type="password"
            {...registerPassword('oldPassword')}
          />
          <label>New Password</label>
          <input
            type="password"
            {...registerPassword('newPassword')}
          />
          <label>Confirm New Password</label>
          <input
            type="password"
            {...registerPassword('confirm_new_password')}
          />
          <button className="btn btn-success">Save</button>
        </form>
      </div>
    </div>
  )
}