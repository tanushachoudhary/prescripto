// import React, { useContext, useEffect, useState } from "react";
// import { AppContext } from "./../context/AppContext";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const MyAppointments = () => {
//   const { backendUrl, token, getDoctorsData } = useContext(AppContext);

//   const [appointments, setAppointments] = useState([]);
//   const months = [
//     " ",
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   const navigate = useNavigate();

//   const slotDateFormat = (slotDate) => {
//     const dateArray = slotDate.split("_");
//     return (
//       dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
//     );
//   };

//   const getUserAppointments = async () => {
//     try {
//       const { data } = await axios.get(backendUrl + "/api/user/appointments", {
//         headers: { token },
//       });

//       if (data.success) {
//         setAppointments(data.appointments.reverse());
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   const rescheduleAppointment=async (appointmentId)=>{
//     try {
//       const { data } = await axios.post(
//         backendUrl + "/api/user/reschedule-appointment",
//         { appointmentId },
//         { headers: { token } }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         getUserAppointments();
//         getDoctorsData();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   }

//   const cancelAppointment = async (appointmentId) => {
//     try {
//       const { data } = await axios.post(
//         backendUrl + "/api/user/cancel-appointment",
//         { appointmentId },
//         { headers: { token } }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         getUserAppointments();
//         getDoctorsData();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   const initPay = (order) => {
//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID ,
//       amount: order.amount,
//       currency: order.currency,
//       name: "Appointment Payment",
//       description: "Appointment Payment",
//       order_id: order.id,
//       receipt: order.receipt,
//       handler: async (response) => {
//         console.log(response);
//         try {
//           const { data } = await axios.post(
//             backendUrl + "/api/user/verifyRazorpay",
//             response,
//             { headers: { token } }
//           );

//           if (data.success) {
//             getUserAppointments();
//             navigate("/my-appointments");
//           }
//         } catch (error) {
//           console.log(error);
//           toast.error(error.message);
//         }
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   const appointmentRazorpay = async (appointmentId) => {
//     try {
//       const { data } = await axios.post(
//         backendUrl + "/api/user/payment-razorpay",
//         { appointmentId },
//         { headers: { token } }
//       );

//       if (data.success) {
//         initPay(data.order);
//       }
//     } catch (error) {}
//   };

//   useEffect(() => {
//     if (token) {
//       getUserAppointments();
//     }
//   }, [token]);

//   return (
//     <div>
//       <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
//         My Appointments
//       </p>
//       <div>
//         {appointments.map((item, index) => (
//           <div
//             className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
//             key={index}
//           >
//             <div>
//               <img
//                 className="w-32 bg-indigo-50"
//                 src={item.docData.image}
//                 alt=""
//               />
//             </div>
//             <div className="flex-1 text-sm text-zinc-600">
//               <p className="text-neutral-800 font-semibold">
//                 {item.docData.name}
//               </p>
//               <p>{item.docData.speciality}</p>
//               <p className="text-zinc-700 font-medium mt-1">Address:</p>
//               <p className="text-xs">{item.docData.address.line1}</p>
//               <p className="text-xs">{item.docData.address.line2}</p>
//               <p className="text-xs mt-1">
//                 <span className="text-sm text-neutral-700 font-medium">
//                   Date & Time:
//                 </span>{" "}
//                 {slotDateFormat(item.slotDate)} | {item.slotTime}
//               </p>
//             </div>
//             <div></div>
//             <div className="flex flex-col gap-2 justify-end">
//               {!item.cancelled && item.payment && !item.isCompleted && (
//                 <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">
//                   Paid
//                 </button>
//               )}
//               {!item.cancelled && !item.payment && !item.isCompleted && (
//                 <button
//                   onClick={() => appointmentRazorpay(item._id)}
//                   className="text-sm text-stone-600 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300"
//                 >
//                   Pay Online
//                 </button>
//               )}
//               {!item.cancelled && !item.isCompleted && (
//                 <button
//                   onClick={() => rescheduleAppointment(item._id)}
//                   className="text-sm text-stone-600 text-center sm:min-w-48 py-2 border hover:bg-amber-500 hover:text-white transition-all duration-300"
//                 >
//                   Reschedule Appointment
//                 </button>
//               )}
//               {!item.cancelled && !item.isCompleted && (
//                 <button
//                   onClick={() => cancelAppointment(item._id)}
//                   className="text-sm text-stone-600 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300"
//                 >
//                   Cancel Appointment
//                 </button>
//               )}
//               {item.cancelled && !item.isCompleted && (
//                 <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
//                   Appointment Cancelled
//                 </button>
//               )}
//               {item.isCompleted && (
//                 <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
//                   Completed
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MyAppointments;
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

// This is the main component for displaying user's appointments
const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData, doctors } = useContext(AppContext);

  // State for storing appointments and managing the reschedule modal
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reschedulingAppointment, setReschedulingAppointment] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedNewSlot, setSelectedNewSlot] = useState({
    date: "",
    time: "",
  });

  // Helper array for month names
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Formats the date string (e.g., "DD_MM_YYYY") for display
  const slotDateFormat = (slotDate) => {
    if (!slotDate) return "";
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  // Fetches the user's appointments from the backend
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch appointments.");
    }
  };

  // --- Reschedule Logic ---

  // Opens the reschedule modal and calculates available slots
  const handleOpenRescheduleModal = (appointment) => {
    const doctor = doctors.find((doc) => doc._id === appointment.docId);
    if (!doctor) {
      toast.error("Doctor's details not found.");
      return;
    }

    // --- Calculate available slots for the next 7 days ---
    const slots = [];
    const today = new Date();
    const originalDateTime = new Date(
      `${appointment.slotDate.split("_").reverse().join("-")}T${
        appointment.slotTime
      }`
    );

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = `${date.getDate()}_${
        date.getMonth() + 1
      }_${date.getFullYear()}`;

      // Assuming doctor's working hours are from 10:00 to 18:00
      for (let hour = 10; hour < 18; hour++) {
        const timeString = `${hour}:00`;
        const newSlotDateTime = new Date(
          `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}T${timeString}`
        );

        // Check if the slot is in the future compared to the original appointment
        const isSlotInFuture = newSlotDateTime > originalDateTime;

        // Check if the slot is already booked
        const isBooked = doctor.slots_booked[dateString]?.includes(timeString);

        if (isSlotInFuture && !isBooked) {
          slots.push({ date: dateString, time: timeString });
        }
      }
    }

    setAvailableSlots(slots);
    setReschedulingAppointment(appointment);
    setIsModalOpen(true);
  };

  // Closes the modal and resets state
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setReschedulingAppointment(null);
    setAvailableSlots([]);
    setSelectedNewSlot({ date: "", time: "" });
  };

  // Handles the final reschedule API call
  const rescheduleAppointment = async () => {
    if (!selectedNewSlot.date || !selectedNewSlot.time) {
      toast.error("Please select a new date and time.");
      return;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/reschedule-appointment`,
        {
          appointmentId: reschedulingAppointment._id,
          newSlotDate: selectedNewSlot.date,
          newSlotTime: selectedNewSlot.time,
        },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData(); // Refresh doctor data to get updated slots
        handleCloseModal(); // Close the modal on success
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verifyRazorpay",
            response,
            { headers: { token } }
          );

          if (data.success) {
            getUserAppointments();
            navigate("/my-appointments");
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        initPay(data.order);
      }
    } catch (error) {}
  };

  const cancelAppointment = async (appointmentId) => {
    // This function remains unchanged
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Fetches appointments when the component mounts and token is available
  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <>
      <div className="p-4">
        <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
          My Appointments
        </p>
        <div className="mt-4 space-y-4">
          {appointments.length > 0 ? (
            appointments.map((item) => (
              <div
                className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 p-4 border rounded-lg shadow-sm"
                key={item._id}
              >
                <div>
                  <img
                    className="w-32 h-32 object-cover rounded-md bg-indigo-50"
                    src={item.docData.image}
                    alt={item.docData.name}
                  />
                </div>
                <div className="flex-1 text-sm text-zinc-600">
                  <p className="text-neutral-800 font-semibold text-lg">
                    {item.docData.name}
                  </p>
                  <p>{item.docData.speciality}</p>
                  <p className="text-zinc-700 font-medium mt-2">Address:</p>
                  <p className="text-xs">{item.docData.address.line1}</p>
                  <p className="text-xs">{item.docData.address.line2}</p>
                  <p className="text-xs mt-2 bg-gray-100 p-2 rounded-md inline-block">
                    <span className="text-sm text-neutral-700 font-medium">
                      Date & Time:
                    </span>{" "}
                    {slotDateFormat(item.slotDate)} | {item.slotTime}
                  </p>
                </div>
                <div className="flex flex-col gap-2 justify-center col-span-2 sm:col-auto">
                  {/* Conditional Buttons based on appointment status */}
                  {!item.cancelled && !item.payment && !item.isCompleted && (
                    <button
                      onClick={() => appointmentRazorpay(item._id)}
                      className="text-sm text-stone-600 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      Pay Online
                    </button>
                  )}
                  {!item.cancelled && !item.isCompleted && (
                    <>
                      <button
                        onClick={() => handleOpenRescheduleModal(item)}
                        className="text-sm text-stone-600 text-center sm:min-w-48 py-2 px-4 border rounded-md hover:bg-amber-500 hover:text-white transition-all duration-300"
                      >
                        Reschedule Appointment
                      </button>
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="text-sm text-stone-600 text-center sm:min-w-48 py-2 px-4 border rounded-md hover:bg-red-600 hover:text-white transition-all duration-300"
                      >
                        Cancel Appointment
                      </button>
                    </>
                  )}
                  {/* Other status buttons */}
                  {item.cancelled && (
                    <button className="sm:min-w-48 py-2 px-4 border border-red-500 rounded-md text-red-500 cursor-not-allowed">
                      Cancelled
                    </button>
                  )}
                  {item.isCompleted && (
                    <button className="sm:min-w-48 py-2 px-4 border border-green-500 rounded-md text-green-500 cursor-not-allowed">
                      Completed
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>You have no appointments.</p>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Reschedule Appointment
            </h2>
            <p className="mb-1 text-sm">
              With:{" "}
              <span className="font-medium">
                {reschedulingAppointment.docData.name}
              </span>
            </p>
            <p className="mb-4 text-sm">
              From:{" "}
              <span className="font-medium">
                {slotDateFormat(reschedulingAppointment.slotDate)} at{" "}
                {reschedulingAppointment.slotTime}
              </span>
            </p>

            <h3 className="text-md font-medium mb-2">
              Select a new available slot:
            </h3>
            <div className="max-h-60 overflow-y-auto border p-2 rounded-md">
              {availableSlots.length > 0 ? (
                availableSlots.map((slot, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedNewSlot(slot)}
                    className={`p-2 my-1 rounded-md cursor-pointer transition-colors ${
                      selectedNewSlot.date === slot.date &&
                      selectedNewSlot.time === slot.time
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-blue-100"
                    }`}
                  >
                    {slotDateFormat(slot.date)} - {slot.time}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No available slots in the next 7 days.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleCloseModal}
                className="py-2 px-4 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={rescheduleAppointment}
                disabled={!selectedNewSlot.date}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyAppointments;
