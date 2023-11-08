const signin = async (user) => {
  try {
    const response = await fetch("/auth/signin/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
const signout = async () => {
  try {
    const response = await fetch("/auth/signout/", {
      method: "GET",
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
const forgotPassword = async (email) => {
  try {
    const response = await fetch("/auth/forgot-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const resetPassword = async (resetData) => {
  try {
    const response = await fetch("/auth/reset-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(resetData),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
export { signin, signout, forgotPassword, resetPassword };
