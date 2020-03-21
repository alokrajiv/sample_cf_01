let time = require("time");
exports.handler = async (event: any, context: any) => {
    const currentTime = new time.Date();
    currentTime.setTimezone("America/Los_Angeles");
    return {
        statusCode: "200",
        body: "The time in Los Angeles is: " + currentTime.toString(),
    };
};
