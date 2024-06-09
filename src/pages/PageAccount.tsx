import { useEffect } from 'react'
import './styles/pageAccount.css'
import { useForm } from 'react-hook-form'
import { millionApi } from '../api/millionApi'
import { useSelector } from 'react-redux'
import { RootState } from '../interfaces'

export const PageAccount = () => {
  const accessToken = useSelector((state: RootState) => state.user.accessToken)
  useEffect(() => {
    //TODO: Traer la información del usuario
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
          <h2>Información Personal</h2>
          <label>Nombres</label>
          <input
            type="text"
            {...registerInfo('name')}
          />
          <label>Apellidos</label>
          <input
            type="text"
            {...registerInfo('last_name')}
          />
          <label>Pais</label>
          <input
            type="text"
            {...registerInfo('country')}
          />
          <label>Ciudad</label>
          <input
            type="text"
            {...registerInfo('city')}
          />
          <button className='btn btn-success'>Guardar</button>
        </form>
        <hr />
        <form onSubmit={handleSubmitPassword(submitChangePassword)} className="info">
          <h2>Cambiar Contraseña</h2>
          <label>Contraseña Actual</label>
          <input
            type="password"
            {...registerPassword('oldPassword')}
          />
          <label>Contraseña Nueva</label>
          <input
            type="password"
            {...registerPassword('newPassword')}
          />
          <label>Repetir Nueva Contraseña</label>
          <input
            type="password"
            {...registerPassword('confirm_new_password')}
          />
          <button className="btn btn-success">Aceptar</button>
        </form>
      </div>
    </div>
  )
}