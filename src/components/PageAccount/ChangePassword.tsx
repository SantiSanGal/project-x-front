import { useForm } from "react-hook-form"
import { millionApi } from "../../api/millionApi"
import { useSelector } from "react-redux"
import { AboutComponentsProps, UserState } from "../../interfaces"
import { useState } from "react"
import { ModalSuccess } from "../shared/ModalSuccess"

export const ChangePassword: React.FC<AboutComponentsProps> = () => {
    const accessToken = useSelector((state: UserState) => state.user.accessToken)
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const [showModalCenter, setShowModalCenter] = useState<boolean>(false)
    const [modalMessage, setModalMessage] = useState<String>('')

    const submitChangePassword = (data: any) => {
        console.log('data', data);

        millionApi.put('/user/password', data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => {
                console.log(res)
                setModalMessage('Success')
                setShowModalCenter(true)
            })
            .catch(err => console.log(err))
    }

    return (
        <>
            <form onSubmit={handleSubmit(submitChangePassword)} className="info">
                <h2>Change Password</h2>
                <label>Password</label>
                <input
                    {...register('oldPassword', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
                    type="password"
                // name="password"
                />
                {errors.password && <p className="error">{String(errors.password.message)}</p>}
                <label>New Password</label>
                <input
                    type="password"
                    {...register('newPassword', { required: 'New Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
                />
                {errors.newPassword && <p className="error">{String(errors.newPassword.message)}</p>}
                <label>Confirm New Password</label>
                <input
                    type="password"
                    {...register('confirm_new_password', { validate: (value) => value === watch('newPassword') || 'Passwords do not match' })}
                />
                {errors.confirm_new_password && <p className="error">{String(errors.confirm_new_password.message)}</p>}
                <button className="btn btn-success">Save</button>
            </form>
            
            <ModalSuccess
                show={showModalCenter}
                onHide={() => setShowModalCenter(false)}
                setShowModalCenter={setShowModalCenter}
                modalMessage={modalMessage}
            />
        </>
    )
}