import { useForm } from 'react-hook-form'
import '../styles/sv-auth/pageRegisterLogin.css'
import { millionApi } from '../../api/millionApi'

export const PageRegister = () => {

  const { register, handleSubmit } = useForm()

  const submit = (data: any) => {
    millionApi.post('/auth/register',
      {
        username: data.username,
        password: data.password,
        name: data.name,
        last_name: data.last_name,
        email: data.email
      }
    )
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
          <label>Last Name</label>
          <input
            {...register('last_name')}
            type="text"
            name="last_name"
          />
          <label>Email</label>
          <input
            {...register('email')}
            type="email"
            name="email"
          />
          <label>Username</label>
          <input
            {...register('username')}
            type="text"
            name="username"
          />
          <label>Password</label>
          <input
            {...register('password')}
            type="password"
            name="password"
          />
          <label>Confirm Password</label>
          <input
            {...register('confirm_password')}
            type="password"
            name="confirm_password"
          />
          <button type='submit' className="btnSubmit">Register</button>
        </form>
      </div>
    </div>
  )
}