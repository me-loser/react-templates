const create = async (user) => {
  try {
    const response = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const activate = async (token) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/user/activate-account",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(token),
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
const list = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/users");
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
const read = async (params, credentials) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/users/${params.userId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
const update = async (params, credentials, user) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/users/${params.userId}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + credentials.t,
        },
        body: JSON.stringify(user),
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const remove = async (params, credentials) => {
  try {
    let response = await fetch(
      `http://localhost:3000/api/users/${params.userId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
const forgotPassword = async (email) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/user/forgot-password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: email }),
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const resetPassword = async (resetData) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/user/reset-password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(resetData),
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
export {
  create,
  list,
  read,
  update,
  remove,
  forgotPassword,
  resetPassword,
  activate,
};
