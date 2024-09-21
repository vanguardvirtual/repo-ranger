import { Link } from 'react-router-dom';

const Errorpage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold text-[#C59F5E]">404</h1>
      <p className="mt-4 text-lg text-white ">Page Not Found</p>
      <Link to="/" className="mt-6 text-blue-500 hover:underline">
        Go back to homepage
      </Link>
    </div>
  );
};

export default Errorpage;
