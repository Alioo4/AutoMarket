const Joi = require("joi");

const { prisma } = require("../helpers/db");

const create = async(req, res, next) => {
    try {
        const { 
            name, 
            city, 
            year, 
            body, 
            mileage, 
            transmission, 
            color, 
            price, 
            photo, 
            categoryId, 
            description
        } = req.body

        const schema = Joi.object({
            name:         Joi.string().required(),
            city:         Joi.string().required(),
            year:         Joi.number().required(),
            body:         Joi.string().required(),
            mileage:      Joi.string().required(),
            transmission: Joi.string().required(),
            color:        Joi.string().required(),
            price:        Joi.string().required(),
            photo:        Joi.string().required(),
            categoryId:   Joi.string().required(),
            description:  Joi.string().required(),
          });
      
          const { error } = schema.validate({ name, city, year, body, mileage, transmission, color, price, photo, categoryId, description });
          if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const newCars = await prisma.cars.create({data: {
            name,
            city,
            year,
            body,
            mileage,
            transmission,
            color,
            price,
            photo,
            categoryId,
            description
        }});

        res.status(201).json({ status: 201, message: "Success", data: newCars.id});
    } catch (error) {
        next(error)
    }
}

const getAll = async(req, res, next) => {
    try {
        const allCars = await prisma.cars.findMany();

        res.status(200).json({ status: 200, message: "Success", data: allCars});
    } catch (error) {
        next(error)
    }
}

const get = async(req, res, next) => {
    try {
        const {id} = req.params;

        const categAllGet = await prisma.cars.findMany({where: {categoryId: id}})

        res.status(200).json({status:200, message: 'Success', data: categAllGet})
    } catch (error) {
        next(error)
    }
}

const getOne = async(req, res, next) => {
    try {
        const {id} = req.params

        const findId = await prisma.cars.findUnique({where: {id}});

        let cid = findId.categoryId

        const findCateg = await prisma.category.findFirst({where: {id: cid}})

        if(!findId)
            return res.status(404).json({status: 404, message: 'This id not found!!!'})

        res.status(200).json({ status: 200, message: "Success", data: {findId, categoryName: findCateg.title}});
    } catch (error) {
        next(error)
    }
}

const change = async(req, res, next) => {
    try {
        const {id} = req.params;

        const { 
            name, 
            city, 
            year, 
            body, 
            mileage, 
            transmission, 
            color, 
            price, 
            photo, 
            categoryId, 
            description
         } = req.body

        const findId = await prisma.cars.findFirst({where: {id}})

        if(!findId)
            return res.status(404).json({status: 404, message: "This car not found!!!"})

         await prisma.cars.update({where: {id}, data: {
            name,
            city,
            year,
            body,
            mileage,
            transmission,
            color,
            price,
            photo,
            categoryId,
            description
        }})

        res.status(200).json({ status: 200, message: "Successfully update!!!"});
    } catch (error) {
        next(error)
    }
}

const remove = async(req, res, next) => {
    try {
        const { id } = req.params

        const findId = await prisma.cars.findFirst({where: {id}})

        if(!findId)
            return res.status(404).json({ status: 404, message: "This car not found!!!"})

        await prisma.cars.delete({where:{id}})

        res.status(200).json({ status:200, message: "Successfully delete!!!"});
    } catch (error) {
        next(error)
    }
}
 
module.exports = {
    create,
    getAll,
    getOne,
    get,
    change,
    remove,
}