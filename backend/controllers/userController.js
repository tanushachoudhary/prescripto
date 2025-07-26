import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import userModel from "./../models/userModel.js";
import doctorModel from "./../models/doctorModel.js";
import appointmentModel from "./../models/appointmentModel.js";
import razorpay from "razorpay";

//API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    //validating email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    //validating strong password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

    res.json({
      success: true,
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    // if (!email || !password) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Please fill all the fields" });
    // }

    // //validating email format
    // if (!validator.isEmail(email)) {
    //   return res.status(400).json({ success: false, message: "Invalid email" });
    // }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      res.json({
        success: true,
        token,
        message: "User logged in successfully",
      });
    }
    // if (!isMatch)
    else {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    res.json({
      success: true,
      userData,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to update user profile data
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;

    const imageFile = req.file;
    if (!name || !address || !phone || !dob || !gender) {
      return res.status(400).json({
        success: false,
        message: "Data Missing",
      });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      //upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = docData.slots_booked;

    //checking for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    }
    //if no slots booked for the date, create a new array for the date
    else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      docData,
      userData,
      amount: docData.fees,
      slotDate,
      slotTime,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    //updating doctor data with booked slots
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to reschedule an existing appointment
const rescheduleAppointment = async (req, res) => {
  try {
    // 1. Get the appointment ID and the new desired slot from the request body.
    const { appointmentId, newSlotDate, newSlotTime } = req.body;

    // Validate that we have the required information.
    if (!appointmentId || !newSlotDate || !newSlotTime) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment ID, new slot date, and new slot time are required.",
      });
    }

    // 2. Find the original appointment to be rescheduled.
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Original appointment not found.",
      });
    }

    const { docId, slotDate: oldSlotDate, slotTime: oldSlotTime } = appointment;

    // 3. The new slot must be after the original slot.
    // Create Date objects for easy comparison.
    const oldDateTime = new Date(`${oldSlotDate} ${oldSlotTime}`);
    const newDateTime = new Date(`${newSlotDate} ${newSlotTime}`);

    if (newDateTime <= oldDateTime) {
      return res.status(400).json({
        success: false,
        message:
          "New appointment time must be after the original appointment time.",
      });
    }

    // 4. Fetch the doctor's record to manage their slots.
    const doctor = await doctorModel.findById(docId);
    if (!doctor || !doctor.available) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found or is not available.",
      });
    }

    // 5. Check if the new, desired slot is available before making any changes.
    if (
      doctor.slots_booked[newSlotDate] &&
      doctor.slots_booked[newSlotDate].includes(newSlotTime)
    ) {
      return res.status(409).json({
        // 409 Conflict is a good status code here
        success: false,
        message: "The requested new slot is not available.",
      });
    }

    // --- If we reach here, the reschedule is valid and possible. ---

    // 6. Free up the old time slot from the doctor's schedule.
    if (doctor.slots_booked[oldSlotDate]) {
      const timeIndex = doctor.slots_booked[oldSlotDate].indexOf(oldSlotTime);
      if (timeIndex > -1) {
        doctor.slots_booked[oldSlotDate].splice(timeIndex, 1);
        // If the date array becomes empty, remove the date key entirely.
        if (doctor.slots_booked[oldSlotDate].length === 0) {
          delete doctor.slots_booked[oldSlotDate];
        }
      }
    }

    // 7. Book the new time slot in the doctor's schedule.
    if (!doctor.slots_booked[newSlotDate]) {
      doctor.slots_booked[newSlotDate] = []; // Create the array if the date is new
    }
    doctor.slots_booked[newSlotDate].push(newSlotTime);

    // 8. Save the updated doctor's schedule.
    // We must tell Mongoose that we've changed a nested object.
    doctor.markModified("slots_booked");
    await doctor.save();

    // 9. Update the appointment record with the new date and time.
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      slotDate: newSlotDate,
      slotTime: newSlotTime,
      date: Date.now(), // Update the timestamp to reflect when it was rescheduled
    });

    // 10. Send a success response.
    res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `An error occurred: ${error.message}`,
    });
  }
};

//API to get user appointments for my-appointments page
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    //verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized Action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    //releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (slot) => slot !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

//API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }

    //creating options for razorpay payment
    const options = {
      amount: appointmentData.amount * 100, // amount in the smallest currency unit
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    //creating order using razorpay instance
    const order = await razorpayInstance.orders.create(options);
    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    // console.log(orderInfo);

    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });
      res.json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      res.json({
        success: false,
        message: "Payment failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  rescheduleAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
};
