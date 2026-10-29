export const register = async (req, res, next) => {
  try {
    res.status(201).json({
      success: true,
      message: "User successfully registered",
    });
  } catch (error) {
    next(error);
  }
};
