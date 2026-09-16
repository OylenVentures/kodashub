import { UpdatePassword } from "./components/UpdatePassword";
import { User } from "./components/User";

const Profile = () => {
  return (
    <section className='space-y-5 flex flex-wrap justify-around'>
      <User />
      <UpdatePassword />
    </section>
  );
};

export default Profile;
