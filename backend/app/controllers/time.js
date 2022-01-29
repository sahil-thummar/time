const Time = require("../models/time");
const Joi = require('joi');
const { TIME_LIST_FETCHED, TIME_SAVED, TIME_DELETED } = require("../lib/success-message.json");
const { INTERNAL_SERVER_ERROR } = require("../lib/error-message.json");
const { responseGenerators, httpStatusCode } = require('./../lib/utils');

module.exports = {
    getTime: async (req, res) => {
        try {
            const timeList = await Time.find().select({ __v: 0 }).sort({ in: 1 });
            return res.status(httpStatusCode.OK).send(responseGenerators({ timeList }, httpStatusCode.OK, TIME_LIST_FETCHED, false))
        } catch (error) {
            console.error(`error in Get Time => , ${error}`);
            return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(responseGenerators({}, httpStatusCode.INTERNAL_SERVER_ERROR, error.message || error.error || INTERNAL_SERVER_ERROR, true))
        }
    },
    saveTime: async (req, res) => {
        try {
            const schema = Joi.object().keys({
                timeList: Joi.array().min(1).required().items(Joi.object({
                    in: Joi.number().required(),
                    out: Joi.number().required()
                })),
            });
            let validatedResult = schema.validate(req.body);
            if (validatedResult.error) {
                statusCode = 400;
                throw validatedResult.error.details[0];
            }
            const reqData = validatedResult.value;
            const savedTime = [];
            const alreadyExistsTime = [];
            const invalidTime = [];

            await Promise.all(
                reqData.timeList.map(async time => {
                    if (time.in < time.out && time.in >= 0 && time.out > 0 && time.in < (24 * 60) && time.out <= (24 * 60)) {
                        const timeCount = await Time.count({
                            $or: [
                                { in: { $gte: time.in, $lte: time.out } },
                                { out: { $gte: time.in, $lte: time.out } }
                            ]
                        });
                        if (timeCount) {
                            alreadyExistsTime.push(time);
                            console.log("alreadyExistsTime : ", time);
                        } else {
                            const newTime = new Time(time);
                            console.log("newTime : ", newTime);
                            await newTime.save();
                            savedTime.push(time);
                        }
                    } else {
                        invalidTime.push(time);
                    }
                })
            )
            return res.status(httpStatusCode.OK).send(responseGenerators({
                savedTime,
                invalidTime,
                alreadyExistsTime
            }, httpStatusCode.OK, TIME_SAVED, false))
        } catch (error) {
            console.error(`error in Save Time => , ${error}`);
            return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(responseGenerators({}, httpStatusCode.INTERNAL_SERVER_ERROR, error.message || error.error || INTERNAL_SERVER_ERROR, true))
        }
    },
    deleteTime: async (req, res) => {
        try {
            const schema = Joi.object().keys({
                timeId: Joi.string().required()
            });
            let validatedResult = schema.validate(req.query);
            if (validatedResult.error) {
                statusCode = 400;
                throw validatedResult.error.details[0];
            }
            const reqData = validatedResult.value;
            await Time.deleteOne({ _id: reqData.timeId });
            return res.status(httpStatusCode.OK).send(responseGenerators({}, httpStatusCode.OK, TIME_DELETED, false))
        } catch (error) {
            console.error(`error in Delete Time => , ${error}`);
            return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(responseGenerators({}, httpStatusCode.INTERNAL_SERVER_ERROR, error.message || error.error || INTERNAL_SERVER_ERROR, true))
        }
    }
}