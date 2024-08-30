import { useForm } from "react-hook-form"
import { millionApi } from "../../api/millionApi"
import React, { useEffect, useState } from "react"
import { AboutComponentsProps, UserData } from "../../interfaces"
import { ModalSuccess } from "../shared/ModalSuccess/ModalSuccess"

export const ChangeUserInfo: React.FC<AboutComponentsProps> = ({ accessToken }) => {
    const [userData, setUserData] = useState<UserData | null>(null)
    const { register, handleSubmit, setValue, formState: { errors } } = useForm()
    const [showModalCenter, setShowModalCenter] = useState<boolean>(false)
    const [modalMessage, setModalMessage] = useState<String>('')

    const getUserData = () => {
        millionApi.get('/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(({ data }) => {
                setUserData(data.data)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getUserData()
    }, [])

    useEffect(() => {
        if (userData) {
            setValue('username', userData.username)
            setValue('name', userData.name)
            setValue('email', userData.email)
            setValue('last_name', userData.last_name)
            setValue('country', userData.country)
            setValue('city', userData.city)
        }
    }, [userData, setValue])


    const submitInfo = (data: any) => {
        millionApi.put('/user/edit', data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then((res: any) => {
                console.log('res', res);
                setModalMessage('Success')
                setShowModalCenter(true)
            })
            .catch((err: any) => {
                console.log('F', err);
            })
    }

    return (
        <>
            <form onSubmit={handleSubmit(submitInfo)} className="info">
                <h2>Personal Information</h2>
                <label>Username</label>
                <input
                    type="text"
                    {...register('username', { required: 'Username is required', minLength: { value: 5, message: 'Username must be at least 5 characters' }, maxLength: { value: 25, message: 'Username can only contain up to 25 characters' } })}
                />
                {errors.username && <p className="error">{String(errors.username.message)}</p>}
                <label>Email</label>
                <input
                    type="text"
                    {...register('email', { required: 'Email is required', minLength: { value: 5, message: 'Email must be at least 5 characters' } })}
                />
                {errors.email && <p className="error">{String(errors.email.message)}</p>}
                <label>Name</label>
                <input
                    type="text"
                    {...register('name', { required: 'Name is required', minLength: { value: 5, message: 'Name must be at least 5 characters' }, maxLength: { value: 25, message: 'Name can only contain up to 25 characters' } })}
                />
                {errors.name && <p className="error">{String(errors.name.message)}</p>}
                <label>Last Name</label>
                <input
                    type="text"
                    {...register('last_name', { required: 'Last Name is required', minLength: { value: 5, message: 'Last Name must be at least 5 characters' }, maxLength: { value: 25, message: 'Last Name can only contain up to 25 characters' } })}
                />
                {errors.last_name && <p className="error">{String(errors.last_name.message)}</p>}
                <label>Country</label>
                <input
                    type="text"
                    {...register('country')}
                />
                <label>City</label>
                <input
                    type="text"
                    {...register('city')}
                />
                <button className='btn btn-success'>Save</button>
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