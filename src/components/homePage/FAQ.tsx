import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from "@reach/accordion";
import "@reach/accordion/styles.css";
import { ChevronUpIcon } from "lucide-react";
import Headline from "../../../components/shared/Heading";

const FAQ = () => {
  const faqItems = [
    {
      question: "Do you require a prescription for all medicines?",
      answer:
        "Not all medicines require a prescription. Over-the-counter (OTC) medicines can be purchased without one, but prescription medications need a valid prescription from a licensed doctor.",
    },
    {
      question: "Do you offer home delivery?",
      answer:
        "Yes, we offer fast and reliable home delivery services for medicines and healthcare products. Delivery times vary depending on your location, but we strive to deliver within 24-48 hours.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, mobile wallets, and online banking options. Cash on delivery (COD) is also available for select locations.",
    },
    {
      question: "Can I return or exchange medicines?",
      answer:
        "For safety reasons, we do not accept returns or exchanges of medicines. However, if you receive a damaged or incorrect product, please contact our support team within 24 hours for assistance.",
    },
  ];

  return (
    <div
      className="w-full px-4 py-16 bg-gradient-to-r from-cyan-100 via-blue-200 to-blue-600 bg-opacity-80"
      id="faq"
    >
      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 shadow-lg shadow-blue-400/30">
        <Headline heading="Frequently Asked Questions" />
        <Accordion>
          {faqItems.map((item, index) => (
            <AccordionItem key={index} className="my-4">
              <AccordionButton className="flex w-full justify-between items-center rounded-xl bg-blue-500 px-6 py-5 text-lg font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring focus-visible:ring-blue-600 transition ease-in-out duration-200">
                <span className="text-left">{item.question}</span>
                <ChevronUpIcon className="h-6 w-6 text-white transition-transform duration-200 transform rotate-0 group-open:rotate-180" />
              </AccordionButton>
              <AccordionPanel className="px-6 pt-4 pb-6 text-sm text-gray-700 bg-gray-50 rounded-lg">
                {item.answer}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
