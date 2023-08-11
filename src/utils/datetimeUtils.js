import moment from "moment";
import Moment from "moment";

export const toVnDateTimeString = (datetime) => {
  return Moment(datetime).format("hh:mm - DD/MM/YYYY");
};

export const getMaximumDob = () => {
  return moment().subtract(5, "years").toDate();
};
