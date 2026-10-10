export const getInvoice = async () => {
  try {
    const invoice = await fetch(
      `${import.meta.env.VITE_API_URI}/api/invoice/${sessionStorage.getItem(
        "user"
      )}`,
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      }
    );
    return invoice;
  } catch (error) {
    return error;
  }
};

export const getHosting = async () => {
  try {
    const host = await fetch(
      `${import.meta.env.VITE_API_URI}/api/hosting/${sessionStorage.getItem(
        "user"
      )}`,
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      }
    );
    return host;
  } catch (error) {
    return error;
  }
};

export const getWebsite = async () => {
  try {
    const website = await fetch(
      `${import.meta.env.VITE_API_URI}/api/website/${sessionStorage.getItem(
        "user"
      )}`,
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      }
    );
    return website;
  } catch (error) {
    return error;
  }
};
