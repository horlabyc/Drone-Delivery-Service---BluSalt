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