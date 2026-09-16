import { Link } from "react-router-dom";

export default function Button({ url, label }) {
  return (
    <Link to={url} className='btn'>
      {label}
    </Link>
  );
}
