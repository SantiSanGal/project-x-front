import './styles/pageLogin.css'
import { useForm } from 'react-hook-form'
import { millionApi } from '../api/millionApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/user';

export const PageLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const submit = (data: any) => {
    millionApi.post(`/auth/login`, {
      username: data.username,
      password: data.password
    })
      .then(({ data }) => {
        if (data && data.token) {
          localStorage.setItem('accessToken', data.token.token);
          dispatch(login(data.token.token))
          navigate('/')
        }
      }).catch((err) => {
        console.log('err', err);
      });
  }

  return (
    <div className="pageLogin">
      <div className="formContainer">
        <form className="formLogin" onSubmit={handleSubmit(submit)}>
          <h2>Sign in to <span style={{ color: '#50623A' }}>Pixel War</span></h2>
          <label>User</label>
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
          <button className="btn btn-success">Login</button>
        </form>
        {/* <a>Forgot your password?</a> */}
        <p>New to Pixel War? <span onClick={() => navigate('/register')} style={{ color: '#50623A' }}>Sign up</span></p>
      </div>
    </div>
  )
}