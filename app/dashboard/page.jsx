
// "use client";
// import { useEffect, useState } from "react";
// import { getUser } from "@/lib/api";
// import { useRouter } from "next/navigation";
// import { ClipboardList, FileText, Building } from "lucide-react";
// import Link from "next/link";

// export default function Dashboard() {
//   const [user, setUser] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("access");
//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     getUser(token)
//       .then((res) => setUser(res.data))
//       .catch(() => router.push("/login"));
//   }, [router]);

//   if (!user) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient">
//         <p className="text-white text-lg animate-pulse">Loading dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`min-h-screen p-8 animate-gradient transition-colors duration-500 ${
//         darkMode
//           ? "bg-gray-900 text-white"
//           : "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white"
//       }`}
//     >
//       {/* Toggle Button */}
//       <div className="absolute top-6 right-6 z-50">
//         <button
//           onClick={() => setDarkMode(!darkMode)}
//           className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-indigo-700 transition"
//         >
//           {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
//         </button>
//       </div>

//       {/* Header Section */}
//       <div className="backdrop-blur-md bg-white/30 shadow-lg rounded-xl p-6 mb-8 text-center border border-white/20">
//         <h1 className="text-4xl font-bold drop-shadow-lg">
//           Welcome, <span className="text-yellow-300">{user.username}</span>!
//         </h1>
//         <p className="mt-2">{user.email}</p>
//         <span className="inline-block mt-4 px-4 py-1 text-sm bg-yellow-400 text-gray-900 rounded-full shadow-md">
//           Role: {user.role}
//         </span>
//         {user.company_code && (
//           <p className="mt-2">
//             Company Code: <strong>{user.company_code}</strong>
//           </p>
//         )}
//       </div>

//       {/* Cards Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Tasks Card */}
//         <Link href="/view_task" className="group">
//           <div className="glass-card hover:scale-105 transition-transform duration-300 cursor-pointer">
//             <div className="flex items-center mb-4">
//               <div className="p-3 bg-blue-500/30 text-white rounded-full">
//                 <ClipboardList size={28} />
//               </div>
//               <h2 className="ml-4 text-2xl font-semibold">Tasks</h2>
//             </div>
//             <p>View and manage your assigned tasks efficiently.</p>
//           </div>
//         </Link>

//         {/* Documents Card */}
//         <div className="glass-card hover:scale-105 transition-transform duration-300">
//           <div className="flex items-center mb-4">
//             <div className="p-3 bg-green-500/30 text-white rounded-full">
//               <FileText size={28} />
//             </div>
//             <h2 className="ml-4 text-2xl font-semibold">Documents</h2>
//           </div>
//           <p>Access and upload important company documents.</p>
//         </div>

//         {/* Company Details Card */}
//         <div className="glass-card hover:scale-105 transition-transform duration-300">
//           <div className="flex items-center mb-4">
//             <div className="p-3 bg-purple-500/30 text-white rounded-full">
//               <Building size={28} />
//             </div>
//             <h2 className="ml-4 text-2xl font-semibold">Company Details</h2>
//           </div>
//           <p>Learn more about the company and its structure.</p>
//         </div>
//       </div>

//       <style jsx>{`
//         .animate-gradient {
//           background-size: 200% 200%;
//           animation: gradientMove 8s ease infinite;
//         }
//         @keyframes gradientMove {
//           0% {
//             background-position: 0% 50%;
//           }
//           50% {
//             background-position: 100% 50%;
//           }
//           100% {
//             background-position: 0% 50%;
//           }
//         }
//         .glass-card {
//           backdrop-filter: blur(12px);
//           background: rgba(255, 255, 255, 0.15);
//           border-radius: 1rem;
//           padding: 1.5rem;
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
//           transition: all 0.3s ease;
//         }
//       `}</style>
//     </div>
//   );
// }




"use client";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ClipboardList, FileText, Building } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/login");
      return;
    }

    getUser(token)
      .then((res) => setUser(res.data))
      .catch(() => router.push("/login"));
  }, [router]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen animated-bg relative overflow-hidden">
        {/* Floating Shapes */}
        <div className="floating-shapes"></div>
        <p className="text-white text-lg animate-pulse z-10">
          Loading dashboard...
        </p>
        <style jsx>{backgroundStyles}</style>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-8 relative overflow-hidden transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "animated-bg text-white"
      }`}
    >
      {/* Floating Shapes (only in light mode for clarity) */}
      {!darkMode && <div className="floating-shapes"></div>}

      {/* Toggle Button */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-indigo-700 transition"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Header Section */}
      <div className="relative z-10 backdrop-blur-md bg-white/30 shadow-lg rounded-xl p-6 mb-8 text-center border border-white/20">
        <h1 className="text-4xl font-bold drop-shadow-lg">
          Welcome, <span className="text-yellow-300">{user.username}</span>!
        </h1>
        <p className="mt-2">{user.email}</p>
        <span className="inline-block mt-4 px-4 py-1 text-sm bg-yellow-400 text-gray-900 rounded-full shadow-md">
          Role: {user.role}
        </span>
        {user.company_code && (
          <p className="mt-2">
            Company Code: <strong>{user.company_code}</strong>
          </p>
        )}
      </div>

      {/* Cards Section */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tasks Card */}
        <Link href="/view_task" className="group">
          <div className="glass-card hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-500/30 text-white rounded-full">
                <ClipboardList size={28} />
              </div>
              <h2 className="ml-4 text-2xl font-semibold">Tasks</h2>
            </div>
            <p>View and manage your assigned tasks efficiently.</p>
          </div>
        </Link>

        {/* Documents Card */}
        <div className="glass-card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-500/30 text-white rounded-full">
              <FileText size={28} />
            </div>
            <h2 className="ml-4 text-2xl font-semibold">Documents</h2>
          </div>
          <p>Access and upload important company documents.</p>
        </div>

        {/* Company Details Card */}
        <div className="glass-card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-500/30 text-white rounded-full">
              <Building size={28} />
            </div>
            <h2 className="ml-4 text-2xl font-semibold">Company Details</h2>
          </div>
          <p>Learn more about the company and its structure.</p>
        </div>
      </div>

      {/* Background + Glass Styles */}
      <style jsx>{backgroundStyles}</style>
    </div>
  );
}

const backgroundStyles = `
.animated-bg {
  background: linear-gradient(-45deg, #89cff0, #ffb6c1, #add8e6, #ffc0cb);
  background-size: 400% 400%;
  animation: gradientBG 10s ease infinite;
}
@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.floating-shapes::before,
.floating-shapes::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  animation: float 8s ease-in-out infinite;
}
.floating-shapes::before {
  width: 300px;
  height: 300px;
  background: #ffb6c1;
  top: -50px;
  left: -100px;
}
.floating-shapes::after {
  width: 400px;
  height: 400px;
  background: #add8e6;
  bottom: -80px;
  right: -150px;
}
@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-20px) translateX(10px); }
}
.glass-card {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}
`;
