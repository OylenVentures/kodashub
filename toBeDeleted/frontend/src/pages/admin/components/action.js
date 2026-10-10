export const getUser = async () => {
  try {
    const user = await fetch(`${import.meta.env.VITE_API_URI}/api/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return user;
  } catch (error) {
    return error;
  }
};

export const getInvoice = async () => {
  try {
    const invoice = await fetch(`${import.meta.env.VITE_API_URI}/api/invoice`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return invoice;
  } catch (error) {
    return error;
  }
};

export const getHosting = async () => {
  try {
    const host = await fetch(`${import.meta.env.VITE_API_URI}/api/hosting`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return host;
  } catch (error) {
    return error;
  }
};

export const getWebsite = async () => {
  try {
    const website = await fetch(`${import.meta.env.VITE_API_URI}/api/website`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return website;
  } catch (error) {
    return error;
  }
};
