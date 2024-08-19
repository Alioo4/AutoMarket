const Joi = require("joi");

const { prisma } = require("../helpers/db");

const create = async(req, res, next) => {
    try {
        const { title, photo } = req.body

        const schema = Joi.object({
            title: Joi.string().required(),
            photo: Joi.string().required()
          });
      
          const { error } = schema.validate({ title, photo });
          if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const newCateg = await prisma.category.create({data: {
            title,
            photo
        }});

        res.status(201).json({ status: 201, message: "Success", data: newCateg});
    } catch (error) {
        next(error)
    }
}

const getAll = async(req, res, next) => {
    try {
        const allCateg = await prisma.category.findMany();

        res.status(200).json({ status: 200, message: "Success", data: allCateg});
    } catch (error) {
        next(error)
    }
}

const findOne = async(req, res, next) => {
    try {
        const {id} = req.params;

        const findId = await prisma.category.findUnique({where: {id}});

        if(!findId)
            return res.status(404).json({status: 404, message: 'This id not found!!!'})

        res.json({status: 200, message: 'Success', data: findId});
    } catch (error) {
        next(error)
    }
}

const change = async(req, res, next) => {
    try {
        const {id} = req.params;

        const { title, photo } = req.body

        const findId = await prisma.category.findFirst({where: {id}})

        if(!findId)
            return res.status(404).json({ status: 404, message: "This category not found!!!"})

         await prisma.category.update({where: {id}, data: {
            title,
            photo
        }})

        res.status(200).json({ status: 200, message: "Successfully update!!!"});
    } catch (error) {
        next(error)
    }
}

const remove = async(req, res, next) => {
    try {
        const { id } = req.params

        const findId = await prisma.category.findFirst({where: {id}})

        if(!findId)
            return res.status(404).json({ status: 404, message: "This category not found!!!"})

        await prisma.category.delete({where:{id}})

        res.status(200).json({ status: 200, message: "Successfully delete!!!"});
    } catch (error) {
        next(error)
    }
}


module.exports = {
    create,
    getAll,
    findOne,
    change,
    remove,
}