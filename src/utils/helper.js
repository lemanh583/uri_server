class Helper {
  static removeAccents(str, flag) {
    str = str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .replace(/[:"'*`,.^$]/g, "")
      .replace(/\s/g, "-")
      .replace(/\//g, "-");
    str = flag ? str + "-" + Date.now() : str + "";
    return str;
  }
}

module.exports = Helper;
