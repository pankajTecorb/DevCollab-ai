import Joi, { string } from 'joi';

//******Singup Schema********/
const signUpSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required(),
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    countryCode: Joi.string(),
    phoneNumber: Joi.string()
        .min(10)
        .max(10)
        .messages({
            'string.empty': `Phone Number cannot be an empty field`,
            'string.min': `Phone Number should have a minimum length of {#limit}`,
            'string.max': `Phone Number should have a maximum length of {#limit}`,
            'any.required': `Phone Number is a required field`
        }),
    password: Joi.string().required()

})
//******Login Schema********/
const loginSchema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required(),

})

//******changePassword Schema********/
const changePasswordSchema = Joi.object({
    newPassword: Joi.string().min(6).max(10).required(),
    password: Joi.string().max(10).required(),
    role:Joi.string().required()
})
//******Update profile********/
const updateSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required(),
    countryCode: Joi.string(),
    phoneNumber: Joi.string()
        .min(10)
        .max(10)
        .messages({
            'string.empty': `Phone Number cannot be an empty field`,
            'string.min': `Phone Number should have a minimum length of {#limit}`,
            'string.max': `Phone Number should have a maximum length of {#limit}`,
            'any.required': `Phone Number is a required field`
        }),
    image: Joi.string(),
    role:Joi.string().required()

})

//******User Registor********/
const userSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required(),
    email: Joi.string().required(),
    designation: Joi.string(),
    countryCode: Joi.string(),
    phoneNumber: Joi.string()
        .min(10)
        .max(10)
        // .required()
        .messages({
            'string.empty': `Phone Number cannot be an empty field`,
            'string.min': `Phone Number should have a minimum length of {#limit}`,
            'string.max': `Phone Number should have a maximum length of {#limit}`,
            'any.required': `Phone Number is a required field`
        }),
    image: Joi.string(),
    role: Joi.string().optional(),

})

//******Project Registor********/
const projectSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required(),
    description: Joi.string(),
    role:Joi.string().required()
})


export {
    signUpSchema,
    loginSchema,
    changePasswordSchema,
    updateSchema,
    userSchema,
    projectSchema

}