import { useForm } from 'react-hook-form'
import '../styles/sv-auth/pageRegisterLogin.css'

export const PageLogin = () => {
  const { register, handleSubmit } = useForm();

  const submit = (data: any) => {
    console.log(data);
  }

  return (
    <div className="pageLogin">
      <div className="formContainer">
        <form className="formLogin" onSubmit={handleSubmit(submit)}>
          <h2>Login</h2>
          <label>Usuario</label>
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
          <button className="btnSubmit">Sign in</button>
        </form>
      </div>
    </div>
  )
}