import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Registrationsuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#071d13] flex items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >

        <div className="bg-[#edf8ef] rounded-2xl shadow-2xl px-8 py-12 text-center">

          {/* Animated Check */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 180
            }}
            className="flex justify-center mb-7"
          >
            <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center">
              <CheckCircle
                size={45}
                strokeWidth={2}
                className="text-white"
              />
            </div>
          </motion.div>


          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-gray-800"
          >
            आपका पंजीकरण सफलतापूर्वक
            <br />
            पूरा हो गया है!
          </motion.h1>


          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 mt-5 leading-relaxed"
          >
            Your registration has been
            <br />
            completed successfully.
          </motion.p>


          {/* Dashboard */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{
              scale: 1.05,
              y: -2
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="mt-8 bg-[#174d2e] hover:bg-[#0f3c23] text-white px-7 py-3 rounded-lg font-medium transition"
          >
            Go to Dashboard
          </motion.button>

        </div>

      </motion.div>

    </div>
  );
}

export default Registrationsuccess;