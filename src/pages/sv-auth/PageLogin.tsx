import { useForm } from 'react-hook-form'
import '../styles/sv-auth/pageRegisterLogin.css'
import { millionApi } from '../../api/millionApi';
import { useNavigate } from 'react-router-dom';

export const PageLogin = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const submit = (data: any) => {
    millionApi.post(`/auth/login`, {
      username: data.username,
      password: data.password
    })
      .then(({ data }) => {
        if (data && data.token) {
          localStorage.setItem('accessToken', data.token.token);
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
          <h2>Login</h2>
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
          <button className="btnSubmit">Sign in</button>
        </form>
      </div>
    </div>
  )
}