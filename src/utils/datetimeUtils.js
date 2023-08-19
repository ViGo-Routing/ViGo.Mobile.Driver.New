import moment from "moment";
import Moment from "moment";

export const toVnDateTimeString = (datetime) => {
  return Moment(datetime).format("HH:mm - DD-MM-YYYY");
};

export const getMaximumDob = () => {
  return moment().subtract(5, "years").toDate();
};

export const toVnDateString = (datetime) => {
  return Moment(datetime).format("DD-MM-YYYY");
};

export const toVnTimeString = (datetime) => {
  return moment(datetime, "HH:mm:ss").format("HH:mm");
};

export const calculateAge = (dateOfBirth) => {
  var years = moment().diff(
    new Moment(dateOfBirth).format("YYYY-MM-DD"),
    "years",
    false
  );
  return years;
};
