import Joi from 'joi';

export const userSchema = Joi.object().keys({
    login: Joi.string().required(),
    password: Joi.string().regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/).required(),
    age: Joi.number().min(4).max(130).required(),
    isDeleted: Joi.boolean().required()
});

export const groupSchema = Joi.object().keys({
    name: Joi.string().required(),
    permissions: Joi.array().items(Joi.string().valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')).required()
});

export const userGroupSchema = Joi.object().keys({
    groupId: Joi.number().required(),
    userIds: Joi.array().items(Joi.number()).min(1).required()
});
