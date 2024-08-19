const Joi = require("joi");
const bcrypt = require("bcrypt");

const { createToken } = require("../helpers/jwt");
const { prisma } = require("../helpers/db");

const register = async (req, res, next) => {
  try {
    const { fullname, phone, password } = req.body;

    const schema = Joi.object({
        fullname: Joi.string().min(5).required(),
        phone: Joi.string().min(5).required(),
        password: Joi.string().min(5).required(),
    });

    const { error } = schema.validate({ fullname, phone, password });
    if (error) {
      return res.status(400).json({ status:400, message: error.details[0].message });
    }

    const existingUser = await prisma.users.findUnique({ where: { phone } });

    if (existingUser) {
      return res.status(401).json({ status: 401, message: "This Phone is already taken!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.users.create({
      data: {
        fullname,
        phone,
        password: hashedPassword,
      },
    });

    const token = createToken({ id: newUser.id, isAdmin: newUser.isAdmin });

    res.json({ status: 201, message: "Registration successful!", data: token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    const schema = Joi.object({
      phone: Joi.string().min(5).required(),
      password: Joi.string().min(5).required(),
    });

    const { error } = schema.validate({ phone, password });
    if (error) {
      return res.status(400).json({ status: 400, message: error.details[0].message });
    }

    const existingUser = await prisma.users.findUnique({ where: { phone } });
    if (!existingUser) {
      return res.status(401).json({ status: 401, message: "Phone or password incorrect!!!" });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ status: 401, message: "Phone or password incorrect!!!" });
    }

    const token = createToken({ id: existingUser.id, isAdmin: existingUser.isAdmin });

    res.json({ status:200, message: "Login successful!!!", data:token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};