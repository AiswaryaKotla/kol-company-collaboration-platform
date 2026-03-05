import { Link } from "react-router-dom";

function NotFound() {

  return (

    <div className="h-screen flex flex-col items-center justify-center text-center">

      <h1 className="text-6xl font-bold text-blue-600">
        404
      </h1>

      <p className="text-gray-500 mt-2">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg"
      >
        Go Home
      </Link>

    </div>

  );

}

export default NotFound;