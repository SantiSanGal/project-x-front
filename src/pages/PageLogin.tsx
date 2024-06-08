import './styles/pageLogin.css'
import { useForm } from 'react-hook-form'
import { millionApi } from '../api/millionApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/user';

export const PageLogin = () => {
  const { register, handleSubmit } = useForm();
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
          <label>Usuario</label>
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
          <button className="btn btn-success">Sign in</button>
        </form>
        <a>¿Olvidó su Contraseña?</a>
      </div>
    </div>
  )
}