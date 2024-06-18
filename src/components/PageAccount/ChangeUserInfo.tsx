import { useForm } from "react-hook-form"
import { millionApi } from "../../api/millionApi"
import { useEffect, useState } from "react"
import { RootState, UserData } from "../../interfaces"
import { useSelector } from "react-redux"

export const ChangeUserInfo = () => {
    const [userData, setUserData] = useState<UserData | null>(null)
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const { register, handleSubmit, setValue } = useForm()

    const getUserData = () => {
        millionApi.get('/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => {
                let { data } = res
                setUserData(data[0])
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
        console.log('data', data);
    }
    
    return (
        <>
            <form onSubmit={handleSubmit(submitInfo)} className="info">
                <h2>Personal Information</h2>
                <label>Username</label>
                <input
                    type="text"
                    {...register('name')}
                />
                <label>Email</label>
                <input
                    type="text"
                    {...register('name')}
                />
                <label>Name</label>
                <input
                    type="text"
                    {...register('name')}
                />
                <label>Last Name</label>
                <input
                    type="text"
                    {...register('last_name')}
                />
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
        </>
    )
}