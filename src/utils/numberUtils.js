export const vndFormat = (balance) => {
  return balance.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "đ";
};
