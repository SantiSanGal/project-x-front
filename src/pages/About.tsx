import { useEffect, useState } from "react";
import { ScrollArea } from "@/components";
import { Link } from "react-router-dom";

/* ---------- UI helpers ---------- */
const cx = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(" ");

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

const COPY: Record<Lang, any> = {
  es: {
    headerTitle: "Sobre el Proyecto",
    back: "Volver al lienzo",
    beginning: "El Comienzo",
    mainTitle: "Sobre Tatakae Pixel y por qué lo hago",
    p1: "Mi mamá siempre fue —y es— el motor de nuestra familia. Dejó de lado sus propios proyectos para que mis hermanos y yo tuviéramos oportunidades: trabajó, sostuvo el hogar y lo hizo todo con una sonrisa. Durante más de 30 años ha vivido pagando alquiler; su casa propia es un sueño que nunca pudo concretar.",
    p2: "Me llamo Santiago, tengo 23 años y soy de Paraguay. Junto a mi hermano, soy uno de los pilares que hoy sostienen a nuestra familia de cinco. Sé que estoy al inicio de mi camino, con mucha energía y ganas de crecer, pero siento la urgencia de actuar ahora. Quiero que mi mamá disfrute de la tranquilidad que tanto merece, y no quiero esperar a que el tiempo decida por mí.",
    p3: "Este proyecto nace de metas familiares concretas: quiero darle a mi mamá la seguridad de la casa que siempre anheló, regalarle a mi papá la experiencia de su primer Mundial y darles a mis hermanos el impulso que necesitan para terminar sus estudios. No busco hacerme famoso, solo quiero devolverles, con hechos, un poco de todo lo que ellos nos dieron.",
    motto:
      "Mi única meta es ver a mi familia segura y feliz. Cada píxel ayuda a construir ese futuro.",
    closing:
      "Si decidís sumarte, estás ayudando a que un sueño real y concreto se haga realidad. Gracias por creer en esto y en quienes luchan día a día para salir adelante.",
    imageAlt: "Ilustración: persona joven trabajando en su laptop",
    howTitle: "Cómo puedes ser parte",
    s1t: "1. Elige tu espacio",
    s1d: "Por cada $1 USD, obtienes un píxel en nuestro lienzo digital. Puedes comprar un bloque (ej. 10x10) para dejar tu marca.",
    s2t: "2. Deja tu mensaje",
    s2d: "Junto con tu imagen o color, puedes añadir un mensaje o un enlace. Tu espacio quedará visible de forma permanente en el lienzo.",
    s3t: "3. Sé parte de la historia",
    s3d: "Cada píxel comprado nos acerca a las metas de nuestra familia. Estás contribuyendo directamente a un sueño real y tangible.",
    s4t: "4. Sigue nuestro progreso",
    s4d: "Mantendremos a todos actualizados sobre el avance de nuestras metas. Tu contribución tiene un impacto directo y queremos que lo veas.",
    payWarnTitle: "Aviso importante sobre pagos",
    payWarnBody:
      "Al redirigirte a la pasarela de pago la moneda aparecerá en Guaraní (PYG) en lugar de USD. La conversión será correcta y tu donación procesada normalmente.",
  },
  en: {
    headerTitle: "About the Project",
    back: "Back to the canvas",
    beginning: "The Beginning",
    mainTitle: "About Tatakae Pixel and why I'm doing this",
    p1: "My mom has always been the engine of our family. She put her own projects on hold so my siblings and I could have opportunities: she worked, kept the home running, and did it all with a smile. For over 30 years she has lived paying rent; owning a home has remained a dream.",
    p2: "My name is Santiago, I'm 23, from Paraguay. Together with my brother, I'm one of the pillars supporting our family of five. I know I'm at the beginning of my journey, with plenty of energy and a drive to grow, but I feel an urgency to act now. I want my mom to enjoy the peace she so deserves, and I don't want to wait for time to make that decision for me.",
    p3: "This project was born from concrete family goals: to give my mom the security of the home she always dreamed of, to gift my dad the experience of his first World Cup, and to give my siblings the boost they need to finish their studies. I'm not looking for fame; I just want to give back to them, with actions, a little of everything they gave us.",
    motto:
      "My only goal is to see my family safe and happy. Every pixel helps build that future.",
    closing:
      "If you decide to join in, you’ll be helping a real, concrete dream come true. Thank you for believing in this and in those who fight every day to move forward.",
    imageAlt: "Illustration: young person working on a laptop",
    howTitle: "How you can be part of it",
    s1t: "1. Choose your space",
    s1d: "For every $1 USD, you get one pixel on our digital canvas. You can buy a block (e.g., 10x10) to make your mark.",
    s2t: "2. Leave your message",
    s2d: "Along with your image or color, you can add a message or a link. Your space will remain permanently visible on the canvas.",
    s3t: "3. Be part of the story",
    s3d: "Every pixel purchased brings us closer to our family's goals. You are contributing directly to a real, tangible dream.",
    s4t: "4. Follow our progress",
    s4d: "We will keep everyone updated on the progress toward our goals. Your contribution has a direct impact, and we want you to see it.",
    payWarnTitle: "Important payment note",
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
            <h1 className="text-lg font-bold text-stone-800">
              {t.headerTitle}
            </h1>

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

              <p className="mt-6 text-xl font-semibold italic text-lime-700">
                {t.motto}
              </p>

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
                  <h3 className="text-sm font-medium text-yellow-800">
                    {t.payWarnTitle}
                  </h3>
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
