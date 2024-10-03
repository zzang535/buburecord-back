const History = require("../models").history;

async function list(req, res) {
  console.log("call list api");
  const { id } = req.token;
  console.log(id);

  try {
    const find_feed = await History.findAll({
      where: { user_id: id },
      order: [["date", "DESC"]],
    });
    const data = find_feed;
    res.status(200).send({ message: "get history success", data });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "get history fail" });
  }
}

async function create(req, res) {
  const { id } = req.token;
  const { date, contentKR, contentJP } = req.body;
  console.log(req.body);
  console.log(id);
  try {
    const createData = {
      date: date,
      content_korean: contentKR,
      content_japanese: contentJP,
      user_id: id,
    };

    console.log('createData', createData);

    await History.create(createData);
    return res.status(200).send({ message: "create history success" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "create history fail" });
  }
}

module.exports = { list, create };
