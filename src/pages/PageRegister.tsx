import './styles/pageRegister.css'
import { useForm } from 'react-hook-form'
import { millionApi } from '../api/millionApi'
import { useNavigate } from 'react-router-dom'

export const PageRegister = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

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
          <h2>Create a <span style={{ color: '#50623A' }}>Pixel War</span> account</h2>
          <label>Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            type="text"
            name="name"
          />
          {errors.name && <p className="error">{String(errors.name.message)}</p>}
          <label>Last Name</label>
          <input
            {...register('last_name', { required: 'Last Name is required' })}
            type="text"
            name="last_name"
          />
          {errors.last_name && <p className="error">{String(errors.last_name.message)}</p>}
          <label>Email</label>
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            name="email"
          />
          {errors.email && <p className="error">{String(errors.email.message)}</p>}
          <label>Username</label>
          <input
            {...register('username', { required: 'Username is required' })}
            type="text"
            name="username"
          />
          {errors.username && <p className="error">{String(errors.username.message)}</p>}
          <label>Password</label>
          <input
            {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
            type="password"
            name="password"
          />
          {errors.password && <p className="error">{String(errors.password.message)}</p>}
          <label>Confirm Password</label>
          <input
            {...register('confirm_password', {
              validate: (value) => value === watch('password') || 'Passwords do not match'
            })}
            type="password"
            name="confirm_password"
          />
          {errors.confirm_password && <p className="error">{String(errors.confirm_password.message)}</p>}

          <button type='submit' className="btn btn-success">Sign up</button>
        </form>
        <p>Already have a Pixel War account? <span onClick={() => navigate('/login')} style={{ color: '#50623A' }}>Sign in</span></p>
      </div>
    </div>
  )
}