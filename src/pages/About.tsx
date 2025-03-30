import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const About = () => {
  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-stone-900">
      <div className="flex flex-col justify-center text-slate-300 p-4 rounded-md bg-stone-800 shadow-lg w-[95vw] xl:max-w-[60vw]">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl flex justify-start gap-2 font-semibold text-white mb-4">About <span className="text-lime-600">Tatakae Pixel & Me</span></AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                Tatakae Pixel started as an idea to support my family and make our dreams come true—an idea that began 20 years ago.
              </p>

              <p className="mb-2">
                Tatakae Pixel is inspired by the iconic <span className="text-lime-600">Million Dollar Homepage</span> created by Alex Tew in 2005, a groundbreaking project that sold pixels as advertising space. At the time, I was only three years old and couldn't compete with him, but now, with modern technology, I’m bringing the concept back with a twist. My version enhances the idea with online payments, real-time interaction, and new dynamics.
              </p>

              <p className="mb-2">
                My name is Santiago, I’m twenty-three years old, and my brother and I are the main providers for our family. We are a family of five. We used to live in a small house where all five of us shared the same room. Since I got a slightly more stable job, we’ve been able to move into a more comfortable house, but it’s still not ours. I've been working since I was 14 to help my parents and pay part of my school tuition.
              </p>

              <p className="mb-2">
                I've been trying to bring this project to life for a long time, but I couldn't because I lacked the necessary resources. I even took out a loan to buy a couple of laptops—one to sell and start a buying-and-selling business to manage some capital and another to work. But they were stolen. One night, I invited a friend to my house so he could have a place to sleep because he had nowhere to go. He took them and disappeared.
              </p>

              <p className="mb-2">
                I'm doing this because I want to study. I dream of applying for a scholarship abroad, but I can't because I am the backbone of my family. They need me every day, and we rely on each other. I want to fulfill my mother’s dream of owning a house and taking her to visit Turkey. It hurt me deeply to hear her say the other day that she had given up and would never be able to go.
              </p>

              <p className="mb-2 font-semibold text-lime-600">
                I don’t seek fame, influence, or recognition. That’s why I won’t share my social media, even though I would like to. I just want my family and me to be happy.
              </p>

              <p className="text-white text-center mt-4 cursor-pointer">
                So, could you please help me?
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg flex justify-start gap-2 font-semibold text-white mt-6 mb-3">
              How does it work?
            </AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                Make a donation of <span className="text-lime-600">$1.00</span> per pixel and participate in a grand raffle at the end of the canvas. You can select any available spot on the canvas and add a message or a link to redirect to a webpage.
              </p>

              <p className="mb-2">
                The pixels are grouped in <span className="text-lime-600">5x5 blocks</span>, meaning you can obtain up to <span className="text-lime-600">25 pixels</span> at a time with your donation.
              </p>

              <p className="mb-2">
                Once the canvas is completed, a completely random raffle will take place, distributing <span className="text-lime-600">$100,000.00</span>. Additionally, the account that has accumulated the highest number of pixels through donations will automatically receive <span className="text-lime-600">$10,000.00</span>.
              </p>

              <p className="mb-2">
                The winners will be announced on the official website, ensuring full transparency in the selection process.
              </p>


              <p className="mb-2 text-yellow-400">
                <strong>Important notice:</strong> When redirected to the payment page, the currency displayed will be in Guaraníes instead of dollars. This is because the only available platform for receiving international donations does not support USD display. However, the conversion will be accurate, and your donation will still be processed correctly.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <br />
        <Link to={'/'} className="flex gap-2 hover:text-lime-600 transition-colors ease-linear"><ArrowRight /> Click to go back to the canvas </Link>
      </div>
    </div>
  );
};
