const signin = async (user) => {
  try {
    const response = await fetch("http://localhost:3000/auth/signin/", {
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
const signout = async () => {
  try {
    const response = await fetch("http://localhost:3000/auth/signout/", {
      method: "GET",
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
const googleSignin = async (tokenId) => {
  try {
    const response = await fetch("http://localhost:3000/google-login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tokenId),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
export { signin, signout, googleSignin };
