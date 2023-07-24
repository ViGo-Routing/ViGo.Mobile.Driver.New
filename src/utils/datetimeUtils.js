import Moment from "moment";

export const toVnDateTimeString = (datetime) => {
  return Moment(datetime).format("hh:mm - DD/MM/YYYY");
};
