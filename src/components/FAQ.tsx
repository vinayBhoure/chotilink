import { useState } from 'react';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState<Number | null >(null);

    const faqs = [
        {
            question: "What is your return policy?",
            answer: "Our return policy allows returns within 30 days of purchase. The item must be in original condition with all packaging and tags intact."
        },
        {
            question: "How do I track my order?",
            answer: "You can track your order using the tracking number provided in your shipping confirmation email. Visit our tracking page and enter your tracking number."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Yes, we offer international shipping to most countries. Shipping rates and delivery times vary based on destination."
        }
    ];

    const toggleAccordion = (index:Number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="sm:w-[18rem] md:w-[24rem] lg:w-[36rem] mx-auto mt-10 bg-white shadow-md rounded-lg">
            {faqs.map((faq, index) => (
                <div key={index} className="border-b">
                    <button
                        className="w-full text-left p-4 focus:outline-none focus:bg-gray-100 flex justify-between items-center"
                        onClick={() => toggleAccordion(index)}
                    >
                        <span className="text-gray-900 text-lg">{faq.question}</span>
                        <span className="text-gray-500">
                            {activeIndex === index ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L10 7.414 6.707 10.707A1 1 0 015.293 9.293l4-4A1 1 0 0110 5z" clipRule="evenodd" />
                                </svg>
                            )}
                        </span>
                    </button>
                    {activeIndex === index && (
                        <div className="p-4 bg-gray-50 text-gray-700">
                            {faq.answer}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FAQ;
