"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logo from "@/components/logo_feedback.png";
export default function About() {
  const router = useRouter();

  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-between min-h-screen bg-gradient-to-r from-emerald-50 via-amber-50 to-rose-50 text-gray-800 p-6 md:p-0">
      {/* Left Section - Text and Description */}
      <section className="flex flex-col justify-center px-8 md:px-16 lg:px-24 w-full md:w-1/2 space-y-6 mt-8 md:mt-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-teal-800">
          Experience | Anonymous Feedback
        </h1>
        <p className="text-base sm:text-lg md:text-xl font-light mb-6 text-gray-700">
          Our platform allows you to securely share and receive anonymous
          feedback, suggestions, or comments. Create your unique personal link
          and start gathering anonymous insights from your community with ease.
        </p>
        <button className="rounded-xl bg-teal-800 text-white px-4 py-2 font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-800 focus:ring-offset-2 text-2xl ">
          <Link href="/sign-in">Get Started</Link>
        </button>
      </section>

      {/* Right Section - Image in a Card */}
      <section className="w-full md:w-2/3 flex justify-center mt-8 md:mt-0">
        <div className="bg-white shadow-lg shadow-gray-400 rounded-3xl p-6 flex flex-col items-center justify-center">
          <Image
            src={logo} // Add your image path here
            alt="Feedback Illustration"
            width={400}
            height={300}
            className="rounded-lg"
          />
        </div>
      </section>
    </div>
  );
}
