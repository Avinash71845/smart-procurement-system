

import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🌾</div>

          <h1 className="text-2xl font-bold text-slate-900">
            SmartProcure
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Farmer Procurement Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            Welcome back
          </h2>

          <p className="text-sm text-slate-500 mt-1 mb-6">
            Login to manage your procurement slots
          </p>

          <form className="space-y-5">

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mobile Number
              </label>

              <input
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-3 rounded-xl border border-slate-300
                outline-none focus:ring-2 focus:ring-green-500
                focus:border-green-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-slate-300
                outline-none focus:ring-2 focus:ring-green-500
                focus:border-green-500 transition"
              />
            </div>

            {/* Login */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-green-600
              text-white font-semibold hover:bg-green-700
              active:scale-[0.98] transition"
            >
              Login
            </button>

          </form>

          {/* Register */}
          <div className="text-center mt-6 text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-600 font-semibold hover:text-green-700"
            >
              Register
            </Link>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Secure • Simple • Transparent
        </p>

      </div>
    </div>
  );
}

export default Login;