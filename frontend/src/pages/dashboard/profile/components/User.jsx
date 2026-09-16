import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const User = () => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    try {
      e.preventDefault();
      const storedUser = sessionStorage?.getItem("user");
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/api/users/${storedUser}`,
        {
          method: "PATCH",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Profile saves successfully");
      } else {
        toast.error("An error occurred during update.");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    const storedUser = sessionStorage?.getItem("user");
    fetch(`${import.meta.env.VITE_API_URI}/api/users/${storedUser}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    })
      .then((resp) => resp.json())
      .then((result) =>
        setUser({
          first_name: result?.existingUser.first_name,
          last_name: result?.existingUser?.last_name,
          email: result?.existingUser?.email,
          phone_number: result?.existingUser?.phone_number,
        })
      )
      .catch((error) => toast.error(error));
  }, []);

  return (
    <form
      onSubmit={handleUpdate}
      className='auth-form lg:w-1/2 p-5 bg-white rounded-md'>
      <h3>Review your details</h3>
      <div className='form-group'>
        <label htmlFor='first_name'>First name</label>
        <input
          type='text'
          name='first_name'
          id='first_name'
          className='p-2 rounded-md border w-full'
          value={user.first_name}
          onChange={handleChange}
          placeholder='Ada'
        />
      </div>
      <div className='form-group'>
        <label htmlFor='last_name'>Last name</label>
        <input
          type='text'
          name='last_name'
          id='last_name'
          className='p-2 rounded-md border w-full'
          value={user.last_name}
          onChange={handleChange}
          placeholder='Pamilerin'
        />
      </div>
      <div className='form-group'>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          name='email'
          id='email'
          className='p-2 rounded-md border w-full'
          value={user.email}
          onChange={handleChange}
          readOnly
          placeholder='adapam@gmail.com'
        />
      </div>
      <div className='form-group'>
        <label htmlFor='phone_number'>Phone number</label>
        <input
          type='tel'
          name='phone_number'
          id='phone_number'
          className='p-2 rounded-md border w-full'
          value={user.phone_number}
          onChange={handleChange}
          placeholder='+2348123456789'
        />
      </div>

      <button className='btn'>Save</button>
    </form>
  );
};
