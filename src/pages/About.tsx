import { ScrollArea } from "@/components";
import { Link } from "react-router-dom";

const ArrowLeft = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

export const About = () => {
  const imageUrl = "./images/ilustration.png";

  return (
    <div className="h-screen w-screen bg-stone-50 font-sans text-stone-800 antialiased flex flex-col">
      {/* Header - Stays fixed at the top */}
      <header className="flex-shrink-0 border-b border-stone-200">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-lg font-bold text-stone-800">
              About The Project
            </h1>
            <Link
              to={"/"}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-lime-700 transition-colors hover:bg-lime-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to the canvas
            </Link>
          </div>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <ScrollArea className="flex-grow">
        <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* ------------------------- Main Section: The Story ------------------------ */}
          <main className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-20">
            <div className="order-2 md:order-1">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-lime-600">
                The Beginning
              </h2>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
                About Tatakae Pixel & Me
              </h1>
              <p className="mt-6 text-lg leading-8 text-stone-600">
                Tatakae Pixel captures the essence of the{" "}
                <strong className="font-semibold text-stone-800">
                  Million Dollar Homepage
                </strong>{" "}
                from 2005, reinventing it with online payments, instant
                interaction, and fresh dynamics.
              </p>
              <p className="mt-4 text-lg leading-8 text-stone-600">
                I’m Santiago, I’m 23 years old, and together with my brother I’m
                the provider for our family of five. My driving force is my
                parents, to whom I owe everything: I long to see my mother
                happy, owning her own home and fulfilling her dream of
                traveling; my father, now 61—I want to take him to his first
                World Cup; and finally, to see my siblings able to study without
                having to work.
              </p>
              <p className="mt-4 text-lg leading-8 text-stone-600">
                As for me, I dream of earning a scholarship abroad, but every
                day I am the pillar that keeps my parents and siblings afloat.
                Our unity is what drives me.
              </p>
              <p className="mt-6 text-xl font-semibold italic text-lime-700">
                "I don’t seek fame or recognition; I only want my family to be
                happy and secure."
              </p>
            </div>
            <div className="order-1 flex justify-center md:order-2">
              <img
                src={imageUrl}
                alt="Illustration of a young man working on his laptop"
                className="w-full max-w-sm rounded-lg object-cover md:max-w-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/400x400/e5e7eb/a8a29e?text=Image+not+available";
                }}
              />
            </div>
          </main>

          {/* --------------------- Secondary Section: How It Works -------------------- */}
          <section className="mt-20 rounded-lg bg-white p-8 shadow-sm ring-1 ring-stone-200/50 sm:p-12 lg:mt-28 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              How does it work?
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:gap-x-12">
              {/* ... content items ... */}
              <div>
                <h3 className="text-lg font-semibold text-lime-600">
                  1. Donate & Participate
                </h3>
                <p className="mt-2 text-base text-stone-600">
                  Make a donation of{" "}
                  <span className="font-bold">$1.00 per pixel</span>. You can
                  select any available spot on the canvas and add a message or a
                  link. Pixels are grouped in{" "}
                  <span className="font-bold">5x5 blocks</span> (25 pixels per
                  donation).
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-lime-600">
                  2. The Grand Raffle
                </h3>
                <p className="mt-2 text-base text-stone-600">
                  Once the canvas is completed, a completely random raffle will
                  take place, distributing{" "}
                  <span className="font-bold">$100,000.00</span>. Additionally,
                  the account that has accumulated the most pixels will
                  automatically receive{" "}
                  <span className="font-bold">$10,000.00</span>.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-lime-600">
                  3. Referral Codes
                </h3>
                <p className="mt-2 text-base text-stone-600">
                  With each purchase, a{" "}
                  <span className="font-bold">unique referral code</span> will
                  be issued. For each person who uses your code, you both will
                  get one additional chance in the raffle.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-lime-600">
                  4. Special Bonus
                </h3>
                <p className="mt-2 text-base text-stone-600">
                  If all the pixels are occupied before August 21st (my mom's
                  birthday), I will conduct{" "}
                  <span className="font-bold">
                    four additional raffles of $50,000.00
                  </span>{" "}
                  each.
                </p>
              </div>
            </div>
            <div className="mt-8 rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 15a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important Payment Notice
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      When redirected to the payment page, the currency will be
                      in Paraguayan Guaraní (PYG) instead of USD. The conversion
                      will be accurate, and your donation will be processed
                      correctly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};
