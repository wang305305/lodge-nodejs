const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    if (req.headers.cookie) {
      const token = req.headers.cookie.slice(6,);
    } else {
      return res.status(401).send("no access token");
    }

    console.log(token)
    if (!token)
      return res.status(401).send("no access token");
    try {
        const decoded = await jwt.verify(token, 'PrivKey');
        console.log(decoded)
        req.user = {
            username: decoded.username
        };
        //next();
        res.status(200).send('token successfully verified')
    } catch (err) {
      console.log("err", err);
      res.clearCookie("token");
      return res.status(400).send(err.message);
    }
  };
  
  module.exports = verifyToken;