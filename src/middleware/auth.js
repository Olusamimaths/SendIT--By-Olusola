import jwt from 'jsonwebtoken';
let userData = '';

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Auth Failed',
    });
  }
};

// const userId = userData.id;

export { checkAuth, userData };
