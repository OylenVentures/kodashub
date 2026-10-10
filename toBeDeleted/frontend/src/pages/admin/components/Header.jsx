import { useLocation } from "react-router-dom";
import { FaAlignJustify } from "react-icons/fa";
import admin from "../../../assets/male.jpg";

export const Header = ({ handleToggle }) => {
  const path = useLocation();
  const headerTitle = path?.pathname.split("/").splice(1, 2);

  return (
    <header className='flex justify-between items-center p-5 shadow-md'>
      <FaAlignJustify
        className='cursor-pointer text-purple-500'
        onClick={handleToggle}
      />
      <h3>
        {headerTitle.length < 2
          ? "DASHBOARD"
          : headerTitle[1].toLocaleUpperCase()}
      </h3>
      <img
        src={admin}
        className='w-10 border-2 border-purple-500 aspect-square rounded-full'
        alt='avatar'
      />
    </header>
  );
};
