import { useForm } from 'react-hook-form'
import '../styles/sv-auth/pageRegisterLogin.css'
import { millionApi } from '../../api/millionApi'

export const PageRegister = () => {

  const { register, handleSubmit } = useForm()

  const submit = (data: any) => {
    console.log('data', data);
    millionApi.post('/auth/api/v1/register')
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  return (
    <div className="pageRegister">
      <div className="formContainer">
        <form className="formRegister" onSubmit={handleSubmit(submit)}>
          <h2>Sing Up</h2>
          <label>Name</label>
          <input
            {...register('name')}
            type="text"
            name="name"
          />
          <label>Surname</label>
          <input
            {...register('surname')}
            type="text"
            name="surname"
          />
          <label>Email</label>
          <input
            {...register('email')}
            type="email"
            name="email"
          />
          <label>Username</label>
          <input
            {...register('nickname')}
            type="text"
            name="nickname"
          />
          <label>Password</label>
          <input
            {...register('password')}
            type="password"
            name="password"
          />
          <label>Confirm Password</label>
          <input
            {...register('password')}
            type="password"
            name="password"
          />
          <label>Country</label>
          <input
            {...register('confirmation')}
            type="confirmation"
            name="confirmation"
          />
          <label>City</label>
          <input
            {...register('city')}
            type="text"
            name="city"
          />
          <label>Phone</label>
          <input
            {...register('phone')}
            type="text"
            name="phone"
          />
          <button type='submit' className="btnSubmit">Register</button>
        </form>
      </div>
    </div>
  )
}