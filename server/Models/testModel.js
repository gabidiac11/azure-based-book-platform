module.exports = {
  index: (req, res, next) => {
    return res.status(200).send({ message: "Test 1" });
  },
};
