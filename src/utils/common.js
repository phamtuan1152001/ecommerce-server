class Common {
  getPagination(page, size) {
    const limit = size ? +size : 0;
    const offset = page === 1 ? 0 : (page - 1) * limit;

    return { limit, offset };
  }
}

module.exports = new Common()