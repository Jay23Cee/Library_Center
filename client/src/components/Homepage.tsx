import React from "react";
import library_image from "../images/library1.jpg";
import mind_image from "../images/mind.jpg";
import idea from "../images/idea.jpg";
import cube from "../images/cube.jpg";
import chess from "../images/chess.jpg";
import reading from "../images/book.jpg";
import panda from "../images/panda.png";
import { Link, useNavigate } from "react-router-dom";

function Homepage() {
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col">
      <section className="w-full max-w-[1340px] bg-main-primary p-12 md:p-20 grid grid-cols-1 md:grid-cols-[1.2fr,1fr] justify-center items-center overflow-hidden">
        <img
          className="opacity-80 order-0 w-full h-auto md:h-[350px]"
          src={library_image}
          alt="library"
        />
        <div className="w-full flex flex-col justify-center items-center text-center text-secondary">
          <h3 className="font-bold text-2xl md:text-4xl mt-8 md:mt-0">
            Library <span className="text-accent">X</span>press
          </h3>
          <p className="font-courier text-sm md:text-base mt-2 md:mt-4">
            Discover endless knowledge at Library <br />
            <span className="font-bold text-lg md:text-xl">X</span>press
          </p>
        </div>
      </section>

      <section className="w-full bg-main-highlight py-16 md:py-24">
        <h1 className="text-2xl md:text-4xl font-bold text-primary text-center mb-12">
          The benefits of reading...
        </h1>
        <div className="w-full max-w-6xl grid gap-10 md:grid-cols-2 lg:grid-cols-3 mx-auto">
          {benefitsOfReadingData.map((item, index) => (
            <div
              key={index}
              className="bg-main-primary p-6 rounded-lg shadow-md text-secondary"
            >
              <img className="w-full h-44 mb-4" src={item.img} alt="library" />
              <h1 className="text-xl md:text-2xl font-bold mb-2">{item.title}</h1>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full py-24 bg-main-primary grid gap-8 md:gap-4 grid-cols-1 md:grid-cols-[1.5fr,1fr] justify-center items-center">
        <a className="w-full flex justify-center md:justify-end items-center">
          <img
            className="opacity-80 w-full max-w-md md:max-w-lg"
            src={panda}
            alt="library"
            onClick={() => {
              navigate("/signup");
            }}
          />
        </a>
        <div className="w-full font-courier flex flex-col justify-center items-center md:items-start text-secondary">
          <h1 className="text-2xl md:text-4xl text-center md:text-left mb-4 md:mb-6">
            Make sure to{" "}
            <Link
              to="/signup"
              className="text-base md:text-lg hover:opacity-60 text-primary"
            >
              Sign Up
            </Link>
          </h1>
        </div>
      </section>
    </div>
  );
}

const benefitsOfReadingData = [
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
];

export default Homepage;
