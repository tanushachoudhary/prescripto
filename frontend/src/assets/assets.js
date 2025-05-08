import appointment_img from "./appointment_img.png";
import header_img from "./header_img.png";
import group_profiles from "./group_profiles.png";
import profile_pic from "./profile_pic.png";
import contact_image from "./contact_image.png";
import about_image from "./about_image.png";
import logo from "./logo.svg";
import dropdown_icon from "./dropdown_icon.svg";
import menu_icon from "./menu_icon.svg";
import cross_icon from "./cross_icon.png";
import chats_icon from "./chats_icon.svg";
import verified_icon from "./verified_icon.svg";
import arrow_icon from "./arrow_icon.svg";
import info_icon from "./info_icon.svg";
import upload_icon from "./upload_icon.png";
import stripe_logo from "./stripe_logo.png";
import razorpay_logo from "./razorpay_logo.png";
import doc1 from "./doc1.png";
import doc2 from "./doc2.png";
import doc3 from "./doc3.png";
import doc4 from "./doc4.png";
import doc5 from "./doc5.png";
import doc6 from "./doc6.png";
import doc7 from "./doc7.png";
import doc8 from "./doc8.png";
import doc9 from "./doc9.png";
import doc10 from "./doc10.png";
import doc11 from "./doc11.png";
import doc12 from "./doc12.png";
import doc13 from "./doc13.png";
import doc14 from "./doc14.png";
import doc15 from "./doc15.png";
import Dermatologist from "./Dermatologist.svg";
import Gastroenterologist from "./Gastroenterologist.svg";
import General_physician from "./General_physician.svg";
import Gynecologist from "./Gynecologist.svg";
import Neurologist from "./Neurologist.svg";
import Pediatricians from "./Pediatricians.svg";

export const assets = {
  appointment_img,
  header_img,
  group_profiles,
  logo,
  chats_icon,
  verified_icon,
  info_icon,
  profile_pic,
  arrow_icon,
  contact_image,
  about_image,
  menu_icon,
  cross_icon,
  dropdown_icon,
  upload_icon,
  stripe_logo,
  razorpay_logo,
};

export const specialityData = [
  {
    speciality: "General physician",
    image: General_physician,
  },
  {
    speciality: "Gynecologist",
    image: Gynecologist,
  },
  {
    speciality: "Dermatologist",
    image: Dermatologist,
  },
  {
    speciality: "Pediatricians",
    image: Pediatricians,
  },
  {
    speciality: "Neurologist",
    image: Neurologist,
  },
  {
    speciality: "Gastroenterologist",
    image: Gastroenterologist,
  },
];

export const doctors = [
  {
    _id: "doc1",
    name: "Dr. Richard James",
    image: doc1,
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Richard James is dedicated to providing patient-centered care, emphasizing preventive health and early intervention strategies.",
    fees: 50,
    address: {
      line1: "17th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc2",
    name: "Dr. Emily Larson",
    image: doc2,
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: "3 Years",
    about:
      "Dr. Emily Larson specializes in women’s health, offering expert guidance on prenatal care, childbirth, and reproductive health.",
    fees: 60,
    address: {
      line1: "27th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc3",
    name: "Dr. Saransh Patel",
    image: doc3,
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: "1 Year",
    about:
      "Dr. Saransh Patel is passionate about skincare, helping patients manage acne, eczema, and other dermatological conditions.",
    fees: 30,
    address: {
      line1: "37th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc4",
    name: "Dr. Christopher Lee",
    image: doc4,
    speciality: "Pediatrician",
    degree: "MBBS",
    experience: "2 Years",
    about:
      "Dr. Christopher Lee is a dedicated pediatrician, ensuring the well-being and healthy development of children and infants.",
    fees: 40,
    address: {
      line1: "47th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc5",
    name: "Dr. Jennifer Garcia",
    image: doc5,
    speciality: "Neurologist",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Jennifer Garcia specializes in diagnosing and treating disorders of the nervous system, including migraines and epilepsy.",
    fees: 50,
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc6",
    name: "Dr. Andrew Williams",
    image: doc6,
    speciality: "Neurologist",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Andrew Williams has expertise in treating neurological disorders such as Parkinson’s disease and multiple sclerosis.",
    fees: 50,
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc7",
    name: "Dr. Christopher Davis",
    image: doc7,
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Christopher Davis focuses on holistic treatments and patient wellness, promoting a healthy lifestyle alongside medical care.",
    fees: 50,
    address: {
      line1: "17th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc8",
    name: "Dr. Timothy White",
    image: doc8,
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: "3 Years",
    about:
      "Dr. Timothy White is known for his compassionate approach to obstetrics and gynecology, ensuring safe deliveries and women’s wellness.",
    fees: 60,
    address: {
      line1: "27th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc9",
    name: "Dr. Ava Mitchell",
    image: doc9,
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: "1 Year",
    about:
      "Dr. Ava Mitchell specializes in cosmetic dermatology, helping patients achieve healthy and glowing skin.",
    fees: 30,
    address: {
      line1: "37th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc10",
    name: "Dr. Jeffrey King",
    image: doc10,
    speciality: "Pediatrician",
    degree: "MBBS",
    experience: "2 Years",
    about:
      "Dr. Jeffrey King is an expert in child healthcare, specializing in vaccinations and developmental health.",
    fees: 40,
    address: {
      line1: "47th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc11",
    name: "Dr. Zoe Kelly",
    image: doc11,
    speciality: "Gastroenterologist",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Zoe Kelly is a specialist in digestive health, helping patients manage conditions like IBS, acid reflux, and liver diseases.",
    fees: 50,
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc12",
    name: "Dr. Patrick Harris",
    image: doc12,
    speciality: "Gastroenterologist",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Patrick Harris specializes in digestive disorders, offering comprehensive treatments for gut health and nutrition.",
    fees: 50,
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc13",
    name: "Dr. Chloe Evans",
    image: doc13,
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Chloe Evans is committed to providing holistic and patient-focused medical care, emphasizing early diagnosis and preventive treatment strategies.",
    fees: 50,
    address: {
      line1: "17th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc14",
    name: "Dr. Ryan Martinez",
    image: doc14,
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: "3 Years",
    about:
      "Dr. Ryan Martinez specializes in women's health, offering expert care in reproductive health, prenatal support, and overall gynecological wellness.",
    fees: 60,
    address: {
      line1: "27th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc15",
    name: "Dr. Amelia Hill",
    image: doc15,
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: "1 Year",
    about:
      "Dr. Amelia Hill is passionate about skincare, focusing on treating common and complex dermatological conditions, including acne, eczema, and skin rejuvenation.",
    fees: 30,
    address: {
      line1: "37th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  //   {
  //     _id: "doc16",
  //     name: "Dr. Nathan Carter",
  //     image: doc16,
  //     speciality: "Cardiologist",
  //     degree: "MBBS, MD",
  //     experience: "6 Years",
  //     about:
  //       "Dr. Nathan Carter is an experienced cardiologist specializing in heart disease prevention, diagnosis, and treatment, ensuring optimal cardiovascular health for his patients.",
  //     fees: 80,
  //     address: {
  //       line1: "67th Cross, Richmond",
  //       line2: "Circle, Ring Road, London",
  //     },
  //   },
  //   {
  //     _id: "doc17",
  //     name: "Dr. Sophia Bennett",
  //     image: doc17,
  //     speciality: "Endocrinologist",
  //     degree: "MBBS, MD",
  //     experience: "5 Years",
  //     about:
  //       "Dr. Sophia Bennett focuses on diagnosing and treating hormonal disorders, including diabetes, thyroid imbalances, and metabolic conditions.",
  //     fees: 70,
  //     address: {
  //       line1: "77th Cross, Richmond",
  //       line2: "Circle, Ring Road, London",
  //     },
  //   },
  //   {
  //     _id: "doc18",
  //     name: "Dr. Oliver Hayes",
  //     image: doc18,
  //     speciality: "Orthopedic Surgeon",
  //     degree: "MBBS, MS",
  //     experience: "8 Years",
  //     about:
  //       "Dr. Oliver Hayes specializes in orthopedic surgeries, joint replacements, and sports injuries, helping patients regain mobility and lead pain-free lives.",
  //     fees: 90,
  //     address: {
  //       line1: "87th Cross, Richmond",
  //       line2: "Circle, Ring Road, London",
  //     },
  //   },
  //   {
  //     _id: "doc19",
  //     name: "Dr. Emma Thompson",
  //     image: doc19,
  //     speciality: "Psychiatrist",
  //     degree: "MBBS, MD",
  //     experience: "7 Years",
  //     about:
  //       "Dr. Emma Thompson provides compassionate mental health care, treating anxiety, depression, and other psychiatric disorders through therapy and medication management.",
  //     fees: 75,
  //     address: {
  //       line1: "97th Cross, Richmond",
  //       line2: "Circle, Ring Road, London",
  //     },
  //   },
  //   {
  //     _id: "doc20",
  //     name: "Dr. Lucas Wright",
  //     image: doc20,
  //     speciality: "Ophthalmologist",
  //     degree: "MBBS, MD",
  //     experience: "6 Years",
  //     about:
  //       "Dr. Lucas Wright is a leading ophthalmologist specializing in vision correction, cataract surgeries, and comprehensive eye care.",
  //     fees: 65,
  //     address: {
  //       line1: "107th Cross, Richmond",
  //       line2: "Circle, Ring Road, London",
  //     },
  //   },
];
