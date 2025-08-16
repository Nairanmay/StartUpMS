// "use client";
// import { useEffect, useState } from "react";
// import { getUser } from "@/lib/api";
// import { useRouter } from "next/navigation";
// import {
//   Loader2,
//   Users,
//   FileText,
//   DollarSign,
//   ClipboardCheck,
// } from "lucide-react";
// import Link from "next/link";

// export default function AdminDashboard() {
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("access");
//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     getUser(token)
//       .then((res) => {
//         if (res.data.role === "admin") {
//           setUser(res.data);
//         } else {
//           router.push("/dashboard");
//         }
//       })
//       .catch(() => router.push("/login"));
//   }, [router]);

//   if (!user) {
//     return (
//       <div className="flex h-screen items-center justify-center animated-bg">
//         <Loader2 className="w-12 h-12 animate-spin text-white" />
//         <style jsx>{backgroundStyles}</style>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-10 animated-bg relative overflow-hidden">
//       {/* Floating Shapes */}
//       <div className="floating-shapes"></div>

//       {/* Welcome Card */}
//       <div className="relative z-10 max-w-4xl mx-auto bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-2xl p-8 mb-12 border border-pink-300">
//         <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-md mb-4">
//           Admin Dashboard
//         </h1>
//         <p className="text-lg text-gray-800">
//           Welcome,{" "}
//           <span className="font-semibold text-blue-900">{user.username}</span> (
//           <span className="capitalize">{user.role}</span>)
//         </p>
//         {user.company_code && (
//           <p className="mt-2 text-gray-700 text-sm tracking-wide">
//             Company Code:{" "}
//             <span className="font-semibold text-pink-600">
//               {user.company_code}
//             </span>
//           </p>
//         )}
//       </div>

//       {/* Admin Actions Grid */}
//       <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
//         <Link href="/admin/employee" className="group">
//           <ActionCard
//             icon={
//               <Users className="w-12 h-12 text-blue-400 group-hover:text-pink-400 transition" />
//             }
//             title="Manage Users"
//             description="Add, remove, or update user accounts and permissions."
//           />
//         </Link>
//         <Link href="/admin/pitch-deck" className="group">
//           <ActionCard
//             icon={
//               <FileText className="w-12 h-12 text-blue-400 group-hover:text-pink-400 transition" />
//             }
//             title="Pitch Deck Analysis"
//             description="AI Powered Pitch Deck Analyser."
//           />
//         </Link>
//         <Link href="/admin/funding-suggestions" className="group">
//           <ActionCard
//             icon={
//               <DollarSign className="w-12 h-12 text-blue-400 group-hover:text-pink-400 transition" />
//             }
//             title="Funding Suggestions"
//             description="AI powered Funding Suggestions."
//           />
//         </Link>
//         <Link href="/admin/assign_task" className="group">
//           <ActionCard
//             icon={
//               <ClipboardCheck className="w-12 h-12 text-blue-400 group-hover:text-pink-400 transition" />
//             }
//             title="Assign Tasks"
//             description="Assign tasks to employees and track progress."
//           />
//         </Link>
//       </div>

//       <style jsx>{backgroundStyles}</style>
//     </div>
//   );
// }

// function ActionCard({ icon, title, description }) {
//   return (
//     <div
//       className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-md p-6 cursor-pointer 
//       border border-pink-300 hover:shadow-2xl hover:scale-[1.05] 
//       transition-transform duration-300 ease-in-out"
//       style={{ height: "250px" }}
//     >
//       <div className="mb-6">{icon}</div>
//       <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
//       <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
//     </div>
//   );
// }

// const backgroundStyles = `
// .animated-bg {
//   background: linear-gradient(-45deg, #89cff0, #ffb6c1, #add8e6, #ffc0cb);
//   background-size: 400% 400%;
//   animation: gradientBG 10s ease infinite;
// }

// @keyframes gradientBG {
//   0% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
//   100% { background-position: 0% 50%; }
// }

// .floating-shapes::before,
// .floating-shapes::after {
//   content: "";
//   position: absolute;
//   border-radius: 50%;
//   opacity: 0.3;
//   animation: float 8s ease-in-out infinite;
// }

// .floating-shapes::before {
//   width: 300px;
//   height: 300px;
//   background: #ffb6c1;
//   top: -50px;
//   left: -100px;
// }

// .floating-shapes::after {
//   width: 400px;
//   height: 400px;
//   background: #add8e6;
//   bottom: -80px;
//   right: -150px;
// }

// @keyframes float {
//   0%, 100% { transform: translateY(0) translateX(0); }
//   50% { transform: translateY(-20px) translateX(10px); }
// }
// `;




"use client";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Users,
  FileText,
  DollarSign,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
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
      .then((res) => {
        if (res.data.role === "admin") {
          setUser(res.data);
        } else {
          router.push("/dashboard");
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center animated-bg">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
        <style jsx>{backgroundStyles}</style>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-10 relative overflow-hidden ${
        darkMode ? "bg-gray-900 text-white" : "animated-bg"
      }`}
    >
      {/* Toggle Dark/Light Button */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-indigo-700 transition"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Floating Shapes (disabled in dark mode for clarity) */}
      {!darkMode && <div className="floating-shapes"></div>}

      {/* Welcome Card */}
      <div
        className={`relative z-10 max-w-4xl mx-auto rounded-2xl p-8 mb-12 border ${
          darkMode
            ? "bg-gray-800 border-gray-600 text-white"
            : "bg-white bg-opacity-90 backdrop-blur-md shadow-2xl border-pink-300"
        }`}
      >
        <h1 className="text-4xl font-extrabold drop-shadow-md mb-4">
          Admin Dashboard
        </h1>
        <p className="text-lg">
          Welcome,{" "}
          <span className="font-semibold text-blue-400">{user.username}</span> (
          <span className="capitalize">{user.role}</span>)
        </p>
        {user.company_code && (
          <p className="mt-2 text-sm tracking-wide">
            Company Code:{" "}
            <span className="font-semibold text-pink-400">
              {user.company_code}
            </span>
          </p>
        )}
      </div>

      {/* Admin Actions Grid */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Link href="/admin/employee" className="group">
          <ActionCard
            icon={
              <Users className="w-12 h-12 text-blue-400 group-hover:text-pink-400 transition" />
            }
            title="Manage Users"
            description="Add, remove, or update user accounts and permissions."
            darkMode={darkMode}
          />
        </Link>
        <Link href="/admin/pitch-deck" className="group">
          <ActionCard
            icon={
              <FileText className="w-12 h-12 text-blue-400 group-hover:text-pink-400 transition" />
            }
            title="Pitch Deck Analysis"
            description="AI Powered Pitch Deck Analyser."
            darkMode={darkMode}
          />
        </Link>
        <Link href="/admin/funding-suggestions" className="group">
          <ActionCard
            icon={
              <DollarSign className="w-12 h-12 text-blue-400 group-hover:text-pink-400 transition" />
            }
            title="Funding Suggestions"
            description="AI powered Funding Suggestions."
            darkMode={darkMode}
          />
        </Link>
        <Link href="/admin/assign_task" className="group">
          <ActionCard
            icon={
              <ClipboardCheck className="w-12 h-12 text-blue-400 group-hover:text-pink-400 transition" />
            }
            title="Assign Tasks"
            description="Assign tasks to employees and track progress."
            darkMode={darkMode}
          />
        </Link>
      </div>

      {!darkMode && <style jsx>{backgroundStyles}</style>}
    </div>
  );
}

function ActionCard({ icon, title, description, darkMode }) {
  return (
    <div
      className={`rounded-xl shadow-md p-6 cursor-pointer transition-transform duration-300 ease-in-out border ${
        darkMode
          ? "bg-gray-800 border-gray-600 text-white hover:shadow-xl hover:scale-[1.05]"
          : "bg-white bg-opacity-90 backdrop-blur-md border-pink-300 hover:shadow-2xl hover:scale-[1.05]"
      }`}
      style={{ height: "250px" }}
    >
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-sm leading-relaxed">{description}</p>
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
`;
