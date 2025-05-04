import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const About = () => {
  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-stone-900">
      <div className="flex flex-col justify-center text-slate-300 p-4 rounded-md bg-stone-800 shadow-lg w-[95vw] xl:max-w-[60vw]">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg flex justify-start gap-2 font-semibold text-white mt-6 mb-3">
              How does it work?
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="w-full h-[300px] sm:h-[350px]">
                <p className="mb-2">
                  Make a donation of{" "}
                  <span className="text-lime-600">$1.00</span> per pixel and
                  participate in a grand raffle at the end of the canvas. You
                  can select any available spot on the canvas and add a message
                  or a link to redirect to a webpage.
                </p>

                <p className="mb-2">
                  The pixels are grouped in{" "}
                  <span className="text-lime-600">5x5 blocks</span>, meaning you
                  can obtain up to{" "}
                  <span className="text-lime-600">25 pixels</span> at a time
                  with your donation.
                </p>

                <p className="mb-2">
                  Once the canvas is completed, a completely random raffle will
                  take place, distributing{" "}
                  <span className="text-lime-600">$100,000.00</span>.
                  Additionally, the account that has accumulated the highest
                  number of pixels through donations will automatically receive{" "}
                  <span className="text-lime-600">$10,000.00</span>.
                </p>

                <p className="mb-2">
                  The winners will be announced on the official website,
                  ensuring full transparency in the selection process.
                </p>

                <p className="mb-2 ">
                  <strong>Special Bonus:</strong> If all the pixels are occupied
                  before August 21 of this year (my mom's birthday), I will
                  conduct{" "}
                  <span className="text-lime-600">
                    four additional raffles of $50,000.00
                  </span>{" "}
                  each, separate from the main $100,000 raffle.
                </p>

                <p className="mb-2 ">
                  <strong>Another Ultra Special Bonus:</strong> If all the
                  pixels are occupied before May 19 of this year (2025) (my
                  birthday), I will conduct{" "}
                  <span className="text-lime-600">
                    one additional raffles of $500,000.00
                  </span>{" "}
                  each, separate from the main $100,000 raffle.
                </p>

                <p className="mb-2 text-yellow-400">
                  <strong>Important notice:</strong> When redirected to the
                  payment page, the currency displayed will be in Guaraníes
                  instead of dollars. This is because the only available
                  platform for receiving international donations does not
                  support USD display. However, the conversion will be accurate,
                  and your donation will still be processed correctly.
                </p>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl flex justify-start gap-2 font-semibold text-white mb-4">
              About <span className="text-lime-600">Tatakae Pixel & Me</span>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="w-full h-[300px] lg:h-[400px]">
                <p className="mb-2">
                  Tatakae Pixel captures the essence of the <span className="text-lime-600">Million Dollar Homepage</span> from 2005, reinventing it with online payments, instant interaction, and fresh dynamics.
                </p>

                <p className="mb-2">
                  I’m Santiago, I’m 23 years old, and together with my brother I’m the provider for our family of five. We shared a single room, and although we now live more comfortably, we still long for a home that is truly ours.
                </p>

                <p className="mb-2">
                  With a loan I bought two laptops—one to sell and generate capital, the other to work with—but a friend I offered shelter to stole them. And now I’m trying to publish this page without knowing if I’ll make it to the end of the month.
                </p>

                <p className="mb-2">
                  My driving force is my parents, to whom I owe everything: I long to see my mother happy, owning her own home and fulfilling her dream of traveling; my father, now 61, who walked to elementary school barefoot and has lived on his own since he was 14—I want to take him to his first World Cup; and finally, to see my siblings able to study without having to work.
                </p>
                <p className="mb-2">
                  As for me, I dream of earning a scholarship abroad, but every day I am the pillar that keeps my parents and siblings afloat. Our unity is what drives me.
                </p>

                <p className="mb-2 font-semibold text-lime-600">
                  I don’t seek fame or recognition; I only want my family to be happy and secure.
                </p>

                <p className="text-white text-center mt-4 cursor-pointer">
                  Would you help me make this a reality?
                </p>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
        <br />
        <Link
          to={"/"}
          className="flex gap-2 hover:text-lime-600 transition-colors ease-linear"
        >
          <ArrowRight /> Click to go back to the canvas{" "}
        </Link>
      </div>
    </div>
  );
};
