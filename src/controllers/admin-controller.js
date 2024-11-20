const Joi = require("joi");
const bcrypt = require("bcrypt");

const { createToken } = require("../helpers/jwt");
const { prisma } = require("../helpers/db");

const create = async (req, res, next) => {
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
        isAdmin: true,
      },
    });

    const token = createToken({ id: newUser.id, isAdmin: newUser.isAdmin });

    res.json({ status: 201, message: "Registration successful!", data: token });
  } catch (error) {
    next(error);
  }
}

const login = async (req, res, next) => {
    try {
      const { phone, password } = req.body;
  
      const schema = Joi.object({
        phone: Joi.string().min(5).required(),
        password: Joi.string().min(5).required(),
      });
  
      const { error } = schema.validate({ phone, password });
      if (error) {
        return res.status(400).json({ status:400, message: 'Phone and password must be min(5)!!!' });
      }
  
      const existingUser = await prisma.users.findUnique({ where: { phone } });
      if (!existingUser) {
        return res.status(401).json({ status: 401, message: "Phone or password incorrect!!!" });
      }

      if(!existingUser.isAdmin)
        return res.status(401).json({ status: 401, message: "Permission Denied!!!"})
  
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      if (!passwordMatch) {
        return res.status(401).json({ status: 401, message: "Phone or password incorrect!!!" });
      }
  
      const token = createToken({ id: existingUser.id, isAdmin: existingUser.isAdmin });
  
      res.json({ status: 200, message: "Admin login successful!!!", data: token });
    } catch (error) {
      next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const allUsers = await prisma.users.findMany({where: {isActive: true}});

        res.json({status: 200, message: "Success!", data: allUsers})
    } catch (error) {
        next(error)
    }
} 

const changeUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { fullname, phone, password } = req.body;

        const schema = Joi.object({
            fullname: Joi.string().min(5).required(),
            phone: Joi.string().min(5).required(),
            password: Joi.string().min(5).required(),
        });

        const findId = await prisma.users.findFirst({where: {id}});

        if(!findId)
            return res.status(404).json({status: 404, message: "This user not found!!!"});
    
        const { error } = schema.validate({ fullname, phone, password });
        if (error) {
          return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const changeUser = await prisma.users.update({where: {id}, data: {fullname, phone, password: hashedPassword}})

        res.status(200).json({status:200, message: "Successfully changed!!!", data: changeUser})
    } catch (error) {
        next(error)
    }
} 
  
module.exports = {
    login,
    changeUser,
    getUsers,
    create
};