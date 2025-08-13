import { useEffect, useState } from "react";
import { ScrollArea } from "@/components";
import { Link } from "react-router-dom";

/* ---------- UI helpers ---------- */
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

const ArrowLeft = (props: any) => (
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

/* ---------- Language Switch (ES / EN) ---------- */
type Lang = "es" | "en";

function LanguageSwitch({
  value,
  onChange,
}: {
  value: Lang;
  onChange: (lang: Lang) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Language"
      className="inline-flex items-center rounded-full bg-stone-100 p-1 ring-1 ring-stone-200"
    >
      <button
        role="tab"
        aria-selected={value === "es"}
        onClick={() => onChange("es")}
        className={cx(
          "px-3 py-1 text-sm rounded-full transition",
          value === "es"
            ? "bg-white text-stone-900 shadow"
            : "text-stone-600 hover:text-stone-800"
        )}
      >
        Español
      </button>
      <button
        role="tab"
        aria-selected={value === "en"}
        onClick={() => onChange("en")}
        className={cx(
          "px-3 py-1 text-sm rounded-full transition",
          value === "en"
            ? "bg-white text-stone-900 shadow"
            : "text-stone-600 hover:text-stone-800"
        )}
      >
        English
      </button>
    </div>
  );
}

/* ---------- Copy (ES/EN) ---------- */
const COPY: Record<Lang, any> = {
  es: {
    headerTitle: "Sobre el Proyecto",
    back: "Volver al lienzo",
    beginning: "El Comienzo",
    mainTitle: "Sobre Tatakae Pixel y por qué lo hago",
    p1:
      "Mi mamá siempre fue —y es— el motor de nuestra familia. Dejó de lado sus propios proyectos para que mis hermanos y yo tuviéramos oportunidades: trabajó, sostuvo el hogar y lo hizo todo con una sonrisa. Durante más de 30 años ha vivido pagando alquiler; su casa propia es un sueño que nunca pudo concretar.",
    p2:
      "Me llamo Santiago, tengo 23 años, soy de Paraguay y junto con mi hermano, soy uno de los pilares que hoy mantienen a nuestra familia de cinco. Aun así, sé que no estoy en mi peak: apenas estoy empezando en mis veintes, con ganas, proyectos y mucho por aprender. Pero siento que el tiempo apremia: la luz de mi mamá se está apagando de a poco y cada día que pasa siento que se hace tarde para darle lo que se merece.",
    p3:
      "Este proyecto nace de ese deseo claro y sencillo: comprarle a mi mamá la casa que siempre quiso. No busco fama ni reconocimiento; lo que quiero es devolverle, aunque sea en parte, todo lo que ella nos dio. Si lo logramos, no sólo cambiaremos una vida, cambiaremos el rumbo de una familia.",
    motto: "No busco fama ni reconocimiento; solo quiero que mi familia sea feliz y segura.",
    closing:
      "Si decidís sumarte, estás ayudando a que un sueño real y concreto se haga realidad. Gracias por creer en esto y en quienes luchan día a día para salir adelante.",
    imageAlt: "Ilustración: persona joven trabajando en su laptop",
    howTitle: "Cómo funciona",
    s1t: "1. Doná y participá",
    s1d: "Doná $1 por pixel. Podés elegir un bloque de 5x5 (25 pixeles) y dejar un mensaje o enlace.",
    s2t: "2. El Gran Sorteo",
    s2d: "El Gran Sorteo se activa cuando el canvas esté completo al 100%: los 2.000.000 (2000×1000) píxeles deben estar vendidos y ocupados. Por “ocupado” entendemos pago aprobado y píxel asignado. Si retiramos un contenido por moderación/DMCA, el píxel sigue contando (mostramos un marcador). Si una compra se cancela o hay contracargo, ese píxel vuelve a quedar disponible y el canvas deja de estar completo hasta que otra persona lo ocupe. Al completarse, se sortearán $100,000 y quien tenga más píxeles recibirá $10,000. Si no llega al 100%, el sorteo no se realiza.",
    s3t: "3. Códigos de referido",
    s3d: "Cada compra genera un código único. Si alguien usa tu código, ambos ganan una oportunidad extra en el sorteo.",
    s4t: "4. Bono Especial",
    s4d: "El Bono Especial también se habilita con el canvas al 100% antes del 21 de agosto: es decir, los 2.000.000 de píxeles vendidos y ocupados para esa fecha. Si se cumple, realizamos cuatro sorteos adicionales de $50,000 cada uno. Si no se alcanza a tiempo, este bono no aplica.",
    payWarnTitle: "Aviso importante sobre pagos",
    payWarnBody:
      "Al redirigirte a la pasarela de pago la moneda aparecerá en Guaraní (PYG) en lugar de USD. La conversión será correcta y tu donación procesada normalmente.",
  },
  en: {
    headerTitle: "About the Project",
    back: "Back to the canvas",
    beginning: "The Beginning",
    mainTitle: "About Tatakae Pixel and why I'm doing this",
    p1:
      "My mom has always been the engine of our family. She put her own projects on hold so my siblings and I could have opportunities: she worked, kept the home running, and did it all with a smile. For over 30 years she has lived paying rent; owning a home has remained a dream.",
    p2:
      "My name is Santiago, I'm 23, from Paraguay. Together with my brother, I'm one of the pillars supporting our family of five. I know I'm not at my peak yet—I'm just getting started in my twenties with energy, projects and a lot to learn. But time feels urgent: my mom’s light is fading a little, and with each day I feel it’s getting late to give her what she deserves.",
    p3:
      "This project comes from a simple, clear wish: to buy my mom the house she always wanted. I’m not seeking fame or recognition; I just want to give back, even a little, of what she gave us. If we manage it, we won’t just change one life—we’ll change the course of a family.",
    motto:
      "I’m not seeking fame or recognition; I only want my family to be safe and happy.",
    closing:
      "If you decide to join in, you’ll be helping a real, concrete dream come true. Thank you for believing in this and in those who fight every day to move forward.",
    imageAlt: "Illustration: young person working on a laptop",
    howTitle: "How it works",
    s1t: "1) Donate & participate",
    s1d: "Donate $1 per pixel. You can choose a 5x5 block (25 pixels) and leave a message or link.",
    s2t: "2) The Grand Raffle",
    s2d: "The Grand Raffle activates when the canvas is 100% complete: all 2,000,000 (2000×1000) pixels must be sold and occupied. By “occupied” we mean payment approved and pixel assigned. If content is removed for moderation/DMCA, the pixel still counts (we’ll show a placeholder). If a purchase is canceled or charged back, that pixel becomes available again and the canvas is no longer complete until someone else occupies it. Once completed, $100,000 will be raffled and the person with the most pixels will receive $10,000. If it doesn’t reach 100%, the raffle won’t run.",
    s3t: "3) Referral codes",
    s3d: "Each purchase generates a unique code. If someone uses your code, both of you get an extra entry in the raffle.",
    s4t: "4) Special Bonus",
    s4d: "The Special Bonus is also enabled with the canvas at 100% before August 21st: that is, all 2,000,000 pixels sold and occupied by that date. If this condition is met, we’ll hold four additional raffles of $50,000 each. If it isn’t complete in time, this bonus doesn’t apply.",
    payWarnBody:
      "When redirected to the payment gateway, the currency will appear in Paraguayan guaraní (PYG) instead of USD. The conversion is correct and your donation will be processed normally.",
  },
};

export const About = () => {
  const imageUrl = "./images/ilustration.png";
  const [lang, setLang] = useState<Lang>("es");

  useEffect(() => {
    const saved = (localStorage.getItem("lang") as Lang) || "es";
    setLang(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = COPY[lang];

  return (
    <div className="h-screen w-screen bg-stone-50 font-sans text-stone-800 antialiased flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-stone-200">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-lg font-bold text-stone-800">{t.headerTitle}</h1>

            <div className="flex items-center gap-3">
              <LanguageSwitch value={lang} onChange={setLang} />
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-lime-700 transition-colors hover:bg-lime-50"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.back}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <ScrollArea className="flex-grow">
        <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* ------------------------- Main Section ------------------------ */}
          <main className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-20">
            <div className="order-2 md:order-1">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-lime-600">
                {t.beginning}
              </h2>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
                {t.mainTitle}
              </h1>

              <p className="mt-6 text-lg leading-8 text-stone-600">{t.p1}</p>
              <p className="mt-4 text-lg leading-8 text-stone-600">{t.p2}</p>
              <p className="mt-4 text-lg leading-8 text-stone-600">{t.p3}</p>

              <p className="mt-6 text-xl font-semibold italic text-lime-700">{t.motto}</p>

              <p className="mt-6 text-base text-stone-600">{t.closing}</p>
            </div>

            <div className="order-1 flex justify-center md:order-2">
              <img
                src={imageUrl}
                alt={t.imageAlt}
                className="w-full max-w-sm rounded-lg object-cover md:max-w-md"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/400x400/e5e7eb/a8a29e?text=Image+not+available";
                }}
              />
            </div>
          </main>

          {/* --------------------- Secondary Section -------------------- */}
          <section className="mt-20 rounded-lg bg-white p-8 shadow-sm ring-1 ring-stone-200/50 sm:p-12 lg:mt-28 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              {t.howTitle}
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:gap-x-12">
              <div>
                <h3 className="text-lg font-semibold text-lime-600">{t.s1t}</h3>
                <p className="mt-2 text-base text-stone-600">{t.s1d}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-lime-600">{t.s2t}</h3>
                <p className="mt-2 text-base text-stone-600">{t.s2d}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-lime-600">{t.s3t}</h3>
                <p className="mt-2 text-base text-stone-600">{t.s3d}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-lime-600">{t.s4t}</h3>
                <p className="mt-2 text-base text-stone-600">{t.s4d}</p>
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
                  <h3 className="text-sm font-medium text-yellow-800">{t.payWarnTitle}</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>{t.payWarnBody}</p>
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

export default About;
