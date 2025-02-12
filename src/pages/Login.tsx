import { millionApi } from '@/api/million.api';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const submit = (data: any) => {
        millionApi.post(`/auth/login`, {
            username: data.username,
            password: data.password
        })
            .then(({ data: { data } }) => {
                console.log('login', data.token);

                if (data && data.token) {
                    localStorage.setItem('accessToken', data.token.token);
                    navigate('/')
                }
            }).catch((err) => {
                console.log('err', err);
            });
    }

    return (
        <div className="w-screen min-h-screen flex items-center justify-center bg-[#181818]">
            <div className="flex flex-col justify-center p-4 rounded-md bg-[#1f1f1f] shadow-lg">
                <form className="text-aliceblue max-w-[500px] min-w-[400px] min-h-[200px] w-[40vw] flex flex-col gap-2" onSubmit={handleSubmit(submit)}>
                    <h2 className="text-xl font-semibold text-white">Sign in to <span className="text-lime-700">Pixel War</span></h2>

                    <label className='text-white'>User</label>
                    <input
                        {...register('username', { required: 'Username is required' })}
                        type="text"
                        name="username"
                        className="text-white bg-[#181818] border-none text-aliceblue p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e4c2d]"
                    />
                    {errors.username && <p className="text-[#C7253E] text-sm">{String(errors.username.message)}</p>}

                    <label className='text-white'>Password</label>
                    <input
                        {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
                        type="password"
                        name="password"
                        className="text-white bg-[#181818] border-none text-aliceblue p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e4c2d]"
                    />
                    {errors.password && <p className="text-[#C7253E] text-sm">{String(errors.password.message)}</p>}

                    <button className="mt-2 bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded-md transition-all">Login</button>
                </form>

                <p className="text-white text-aliceblue mt-2 cursor-pointer">
                    New to Pixel War? &nbsp;
                    <span
                        onClick={() => navigate('/register')}
                        className="text-lime-700 hover:text-[#6d8155] transition-all">
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    );
}
