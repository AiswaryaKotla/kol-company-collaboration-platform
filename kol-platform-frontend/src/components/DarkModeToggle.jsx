import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

function DarkModeToggle() {

  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {

    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

  }, [dark]);

  return (

    <button
      onClick={() => setDark(!dark)}
      className="relative w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-700 rounded-full p-1 transition"
    >

      <div
        className={`absolute bg-white w-5 h-5 rounded-full shadow-md transform transition ${
          dark ? "translate-x-6" : "translate-x-0"
        }`}
      />

      <div className="flex justify-between w-full px-1 text-xs">

        <FaSun className="text-yellow-500" />

        <FaMoon className="text-gray-900 dark:text-white" />

      </div>

    </button>

  );
}

export default DarkModeToggle;