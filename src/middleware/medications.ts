import Joi from "joi";

export const getAllMedications = {
  query: Joi.object().keys({
    page: Joi.string(),
    pageSize: Joi.string(),
    sortBy: Joi.string().valid('desc', 'asc', 'createdAt'),
    dateFrom: Joi.date(),
    dateTo: Joi.date(),
    searchTerm: Joi.string()
  })
};

export const registerMedication = {
  body: Joi.object().keys({
    code: Joi.string().regex(/^[A-Z0-9_]+$/).required(),
    name: Joi.string().regex(/^[a-zA-Z0-9_-]+$/).required(),
    weight: Joi.number().required(),
    image: Joi.string()
  })
};