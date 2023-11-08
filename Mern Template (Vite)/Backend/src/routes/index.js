const helloRoute = {
  method: "get",
  path: "/hello",
  handler: (req, res) => {
    res.send("hello!");
  },
};
export const routes = [helloRoute];
