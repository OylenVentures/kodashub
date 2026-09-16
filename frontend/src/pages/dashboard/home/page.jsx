import { useEffect } from "react";
import Datapool from "./components/Datapool";
import Ticket from "./components/Ticket";
import { jwtDecode } from "jwt-decode";

export default function DashboardPage() {
  useEffect(() => {
    const decode = jwtDecode(sessionStorage.getItem("token"));
    sessionStorage.setItem("user", decode.email);
  }, []);

  return (
    <section className='space-y-5'>
      <Datapool />
      <Ticket />
    </section>
  );
}
