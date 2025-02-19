export const About = () => {
    return (
        <div className="w-screen min-h-screen flex items-center justify-center bg-stone-900">
            <div className="flex flex-col justify-center text-slate-300 p-4 rounded-md bg-stone-800 shadow-lg text-aliceblue max-w-[500px] min-w-[400px] min-h-[200px] w-[40vw]">
                <h2 className="text-xl font-semibold text-white mb-4">About <span className="text-lime-600">Pixel</span></h2>

                <p className="mb-2">
                    Pixel started as an idea to support my family and make our dreams come true—an idea that began 20 years ago.
                </p>
                <p className="mb-2">
                    I've been trying to bring this project to life for a long time, but I couldn’t because I lacked the necessary resources. I even bought a couple of laptops to work on it, but they were stolen. So now, I’m here, working on this project in my free time after my regular job.
                </p>
                <p className="mb-2">
                    My name is Santiago, I'm in my twenties, and my brother and I are the main providers for our family. I've been working since I was 14 to help my parents.
                </p>
                <p className="mb-2">
                    I’m doing this because I want to study. I dream of applying for a scholarship abroad, but I can’t because my family needs me—so here I am, trying to make it happen.
                </p>
                <p className="mb-2">
                    I want to fulfill my mother’s dream of owning a house and taking her to visit Turkey. And my dream? To study abroad and give my siblings the privilege of focusing on their education without having to work 12-hour shifts, six days a week.
                </p>
                <p className="mb-2 font-semibold text-lime-600">
                    I don’t seek fame, influence, or recognition. I just want my family and me to be happy.
                </p>
                <p className="text-white text-center mt-4 cursor-pointer">
                    So, could you please help me?
                </p>
            </div>
        </div>
    );
};
