import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function Registration() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#071d13] flex items-center justify-center px-4 py-8">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >

        <div className="bg-[#f5faf6] rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-[#174d2e] text-white px-6 py-5">

            <button
              onClick={() => navigate("/landingpage")}
              className="flex items-center gap-2 text-sm text-green-100 hover:text-white mb-5"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <h1 className="text-2xl font-bold">
              Farmer Registration
            </h1>

            <p className="text-sm text-green-100/70 mt-1">
              Register to access smart procurement services
            </p>

          </div>


          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/registrationsucess");
            }}
            className="p-7 space-y-5"
          >

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 transition"
              />
            </div>


            {/* Mobile */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Mobile
              </label>

              <input
                type="tel"
                placeholder="Enter mobile number"
                className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 transition"
              />
            </div>


            {/* Village */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Village
              </label>

              <input
                type="text"
                placeholder="Enter village"
                className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 transition"
              />
            </div>


            {/* District */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                District
              </label>

              <select className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-green-700">
                <option>Select district</option>
                <option>Gaya</option>
                <option>Patna</option>
                <option>Jehanabad</option>
                <option>Nalanda</option>
                <option>Aurangabad</option>
              </select>
            </div>


            {/* State */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                State
              </label>

              <select className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-green-700">
                <option>Select state</option>
                <option>Bihar</option>
                <option>Uttar Pradesh</option>
                <option>Jharkhand</option>
                <option>West Bengal</option>
              </select>
            </div>


            {/* Language */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Preferred Language
              </label>

              <select className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-green-700">
                <option>Hindi</option>
                <option>English</option>
                <option>Maithili</option>
              </select>
            </div>


            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-[#174d2e] hover:bg-[#0f3c23] text-white py-3 rounded-lg font-medium transition"
            >
              Register
            </motion.button>

          </form>

        </div>
      </motion.div>
    </div>
  );
}

export default Registration;