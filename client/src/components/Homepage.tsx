import React from "react";
import library_image from "../images/library1.jpg";
import mind_image from "../images/mind.jpg";
import idea from "../images/idea.jpg";
import cube from "../images/boy2.jpg";
import chess from "../images/kb2.jpg";
import reading from "../images/lightbulb1.jpg";
import environment from "../images/signup1.png";
import writing from "../images/writing.png";
import panda from "../images/signup1.png";
import { Link, useNavigate } from "react-router-dom";
import focus from "../images/brain.png";

function Homepage() {
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col items-center">
      {/* First section */}
      <section className="main-intro main-target w-screen h-screen bg-main-primary flex items-center justify-center p-0 md:p-0">
        <div className="intro-text flex flex-col items-center justify-center text-center text-main-secondary">
          <h3 className="font-bold text-4xl md:text-8xl shadow-lg text-shadow-glow">
            Library Xpress
          </h3>
          <p className="font-mono text-xl md:text-5xl mt-4 shadow-md text-shadow-glow">
            Your Gateway to Classic Literature
          </p>
        </div>
      </section>

      <section className="w-full bg-gray-50 py-16 px-4 md:px-16 shadow-lg">
        <h2 className="text-4xl md:text-5xl text-shadow-orange-glow font-bold text-center text-main-navyblue mb-10 text-shadow">
          Welcome to Library Xpress
        </h2>
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0 items-center justify-center text-center md:text-left text-gray-700">
          <div className="w-full md:w-1/2">
            <div className="flex items-center mb-4">
              <i className="fas fa-book-reader text-4xl text-main-secondary mr-4"></i>
              <p className="text-lg md:text-xl font-medium">
                Library Xpress is your ultimate destination for classic
                literature. Here, you can discover a rich collection of books
                that are now in the public domain, available absolutely free!
              </p>
            </div>
            <div className="flex items-center">
              <i className="fas fa-ship text-4xl text-main-secondary mr-4"></i>
              <p className="text-lg md:text-xl font-medium">
                Explore the writings of Mark Twain, or set sail on the
                adventurous seas with characters from timeless novels. The
                treasure trove of knowledge is just a click away!
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <ul className="list-none text-lg md:text-xl font-medium space-y-2">
              <li>
                <i className="fas fa-infinity mr-2"></i>
                Unlimited access to classic literature
              </li>
              <li>
                <i className="fas fa-th-large mr-2 color-main-secondary"></i>
                Various categories like Adventure, Mystery, Romance, and more
              </li>
              <li>
                <i className="fas fa-book-open mr-2"></i>
                High-quality, digitized versions of books
              </li>
              <li>
                <i className="fas fa-star mr-2"></i>
                Curated selections to guide your reading journey
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            className="px-8 py-3 text-lg font-semibold text-white bg-main-accent rounded-lg hover:bg-main-secondary"
            to="/login"
          >
            <i className="fas fa-search mr-2"></i>
            Browse Books
          </Link>
        </div>
      </section>

      {/* Second section */}
      <section className="w-full bg-main-accent py-16 px-4 md:px-16 shadow-2xl">
        <h1 className="text-3xl md:text-5xl font-extrabold text-main-primary text-center mb-8 text-shadow">
          The Benefits of Reading...
        </h1>
        <p className="text-lg md:text-xl text-center text-main-navyblue mb-8">
          Reading has been scientifically proven to have numerous benefits such
          as enhancing brain function, reducing stress, and much more. Explore
          the benefits below:
        </p>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {benefitsOfReadingData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col bg-main-primary p-8 rounded-xl shadow-lg border border-gray-300 hover:shadow-xl hover:border-transparent transition-shadow duration-300"
            >
              <div className="w-full aspect-w-16 aspect-h-9 rounded-t-xl overflow-hidden mb-6">
                <img
                  className="w-full h-full object-cover"
                  src={item.img}
                  alt={item.imgAlt || "benefit image"}
                />
              </div>
              <div className="flex flex-col flex-grow">
                <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-main-secondary text-shadow">
                  {item.title}
                </h1>
                <p className="flex-grow">{item.description}</p>
                {/* Conditionally render Read More link if link property exists */}
                {item.link && (
                  <a
                    href={item.link}
                    className="mt-4 text-main-highlight font-semibold hover:underline"
                  >
                    Read More
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Third section */}
      <section className="sign-up w-screen py-24 bg-main-primary flex justify-center items-center">
        <div className="w-full font-courier flex flex-col justify-center items-center text-secondary">
          <h1 className="text-2xl text-shadow-glow text-main-accent text-shadow md:text-5xl lg:text-6xl text-center md:text-left mb-4 md:mb-6 custom-shadow">
            Join our community today!{" "}
            <Link
              to="/signup"
              className="inline-flex bg-blue-300 hover:bg-blue-800 items-center px-4 py-2 text-xl md:text-5xl lg:text-8xl text-primary bg-transparent rounded-lg transition-all"
            >
              <span className="mr-2">🚀</span>
              Sign Up
            </Link>
          </h1>
          <p className="text-center text-white-main text-sm md:text-xl lg:text-xxl text-shadow-glow">
            Get exclusive access to our resources and more.
          </p>
        </div>
      </section>
    </div>
  );
}

interface BenefitOfReading {
  img: string;
  title: string;
  description: string;
  link?: string; // Optional link property
  imgAlt?: string; // Optional imgAlt property
}

const benefitsOfReadingData: BenefitOfReading[] = [
  {
    img: reading,
    title: "Reading for Wellness",
    description:
      "By incorporating reading into your routine, you can reap the numerous benefits it has for mental and emotional wellness, such as stress reduction and improved focus. Make it a regular part of your routine for overall well-being.",
  },
  {
    img: cube,
    title: "Reading for Self-Care",
    description:
      "Reading can be a powerful tool for self-care, providing relaxation, personal growth, and an escape from daily life. Make it a habit to nourish your mind and soul through literature.",
  },
  {
    img: chess,
    title: "Wealth Through Reading",
    description:
      "Reading can expand our minds, provide valuable knowledge and insights, and lead to personal and financial success. Make it a habit to continually invest in yourself through reading.",
  },
  {
    img: focus,
    title: "Improving Concentration and Focus",
    description:
      "In an age of distractions, reading can train your mind to focus on one task at a time, which can improve your attention span and ability to concentrate on other areas of life.",
  },
  {
    img: environment,
    title: "Environmental Awareness",
    description:
      "Reading about environmental issues and sustainability can increase your awareness and understanding of the challenges facing our planet. This knowledge is crucial for making informed decisions and taking action to protect the environment.",
  },
  {
    img: writing,
    title: "Strengthening Writing Skills",
    description:
      "Regular reading can dramatically improve your writing skills. By exposing yourself to well-written content, you unconsciously pick up on grammar, vocabulary, and styles of writing. This can be reflected in your own writing, helping you to communicate more effectively and creatively.",
  },
];

export default Homepage;
