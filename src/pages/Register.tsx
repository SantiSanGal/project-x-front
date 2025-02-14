import { useNavigate } from 'react-router-dom'
import { millionApi } from '@/api/million.api'
import { useForm } from 'react-hook-form'

export const Register = () => {
    const navigate = useNavigate()
    const { register, handleSubmit, watch, formState: { errors } } = useForm()

    const submit = (data: any) => {
        millionApi.post('/auth/register', {
            username: data.username,
            password: data.password,
            name: data.name,
            last_name: data.last_name,
            email: data.email
        })
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    return (
        <div className="w-screen min-h-screen h-fit flex items-center justify-center bg-stone-900">
            {/* Contenedor del formulario */}
            <div className="flex flex-col justify-center p-4 rounded-md bg-stone-700 shadow-[0_6px_7px_0_rgba(10,10,9,0.9)]">
                {/* Formulario */}
                <form
                    onSubmit={handleSubmit(submit)}
                    className="text-[#f0f8ff] max-w-[500px] min-w-[400px] min-h-[200px] w-[40vw] h-fit flex flex-col gap-2"
                >
                    <h2 className="text-xl font-semibold">
                        Create a <span className="text-lime-600">Pixel War</span> account
                    </h2>

                    {/* Name */}
                    <label>Name</label>
                    <input
                        {...register('name', {
                            required: 'Name is required',
                            minLength: { value: 5, message: 'Name must be at least 5 characters' },
                            maxLength: { value: 25, message: 'Name can only contain up to 25 characters' }
                        })}
                        type="text"
                        name="name"
                        className="bg-stone-900 border-none text-[#f0f8ff] p-2 rounded focus:outline-none focus:ring-2 focus:ring-lime-600"
                    />
                    {errors.name && (
                        <p className="text-[#C7253E] text-sm">
                            {String(errors.name.message)}
                        </p>
                    )}

                    {/* Last Name */}
                    <label>Last Name</label>
                    <input
                        {...register('last_name', {
                            required: 'Last Name is required',
                            minLength: { value: 5, message: 'Last Name must be at least 5 characters' },
                            maxLength: { value: 25, message: 'Last Name can only contain up to 25 characters' }
                        })}
                        type="text"
                        name="last_name"
                        className="bg-stone-900 border-none text-[#f0f8ff] p-2 rounded focus:outline-none focus:ring-2 focus:ring-lime-600"
                    />
                    {errors.last_name && (
                        <p className="text-[#C7253E] text-sm">
                            {String(errors.last_name.message)}
                        </p>
                    )}

                    {/* Email */}
                    <label>Email</label>
                    <input
                        {...register('email', {
                            required: 'Email is required',
                            minLength: { value: 5, message: 'Email must be at least 5 characters' }
                        })}
                        type="email"
                        name="email"
                        className="bg-stone-900 border-none text-[#f0f8ff] p-2 rounded focus:outline-none focus:ring-2 focus:ring-lime-600"
                    />
                    {errors.email && (
                        <p className="text-[#C7253E] text-sm">
                            {String(errors.email.message)}
                        </p>
                    )}

                    {/* Username */}
                    <label>Username</label>
                    <input
                        {...register('username', {
                            required: 'Username is required',
                            minLength: { value: 5, message: 'Username must be at least 5 characters' },
                            maxLength: { value: 25, message: 'Username can only contain up to 25 characters' }
                        })}
                        type="text"
                        name="username"
                        className="bg-stone-900 border-none text-[#f0f8ff] p-2 rounded focus:outline-none focus:ring-2 focus:ring-lime-600"
                    />
                    {errors.username && (
                        <p className="text-[#C7253E] text-sm">
                            {String(errors.username.message)}
                        </p>
                    )}

                    {/* Password */}
                    <label>Password</label>
                    <input
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 8, message: 'Password must be at least 8 characters' }
                        })}
                        type="password"
                        name="password"
                        className="bg-stone-900 border-none text-[#f0f8ff] p-2 rounded focus:outline-none focus:ring-2 focus:ring-lime-600"
                    />
                    {errors.password && (
                        <p className="text-[#C7253E] text-sm">
                            {String(errors.password.message)}
                        </p>
                    )}

                    {/* Confirm Password */}
                    <label>Confirm Password</label>
                    <input
                        {...register('confirm_password', {
                            validate: (value) => value === watch('password') || 'Passwords do not match'
                        })}
                        type="password"
                        name="confirm_password"
                        className="bg-stone-900 border-none text-[#f0f8ff] p-2 rounded focus:outline-none focus:ring-2 focus:ring-lime-600"
                    />
                    {errors.confirm_password && (
                        <p className="text-[#C7253E] text-sm">
                            {String(errors.confirm_password.message)}
                        </p>
                    )}

                    {/* Botón */}
                    <button
                        type="submit"
                        className="mt-2 bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded transition-all"
                    >
                        Sign up
                    </button>
                </form>

                {/* Texto inferior */}
                <p className="text-[#f0f8ff] mt-2">
                    Already have a Pixel War account? &nbsp;
                    <span
                        onClick={() => navigate('/login')}
                        className="text-lime-600 cursor-pointer"
                    >
                        Sign in
                    </span>
                </p>
            </div>
        </div>
    )
}
