import React from "react";
import { assets } from "./../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/*-------left section-----------*/}
        <div>
          <img className="w-40 mb-5" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            We provide a seamless online doctor appointment booking experience,
            allowing patients to connect with trusted healthcare professionals
            effortlessly. Prescripto ensures quick access to verified doctors
            across various specialties, enabling hassle-free consultations from
            the comfort of your home.
          </p>
        </div>
        {/*-------center section-----------*/}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        {/*-------right section-----------*/}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+1-234-456-7890</li>
            <li>prescripto@gmail.com</li>
          </ul>
        </div>
      </div>
      {/* ----------copyright------------ */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025 @ Tanusha - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
