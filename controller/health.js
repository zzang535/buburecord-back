const Health = require("../models").health;

async function list(req, res) {
  const { id } = req.token;
  console.log(id);
  try {
    const result = await Health.findAll({
      where: { user_id: id },
      order: [["date", "DESC"]],
    });
    const data = result;
    res.status(200).send({ message: "get health list success", data });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "get health list fail" });
  }
}

async function create(req, res) {
  const { id } = req.token;
  const { date, title, content, content2 } = req.body;
  console.log(req.body);
  console.log(id);
  try {
    const createData = {
      date: date,
      title: title,
      content: content,
      content2: content2,
      user_id: id,
    };
    await Health.create(createData);
    return res.status(200).send({ message: "create health success" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "create health fail" });
  }
}

async function update(req, res) {
  const { id, date, title, content, content2 } = req.body;
  try {
    const updateData = {
      date: date,
      title: title,
      content: content,
      content2: content2,
    };
    await Health.update(updateData, {
      where: { id },
    });
    return res.status(200).send({ message: "update health success" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "update health fail" });
  }
}

async function uploadFile(req, res) {
  console.log("call uploadFile");
  try {
    return res.status(200).send({ message: "uploadFile success" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "uploadFile health ail" });
  }
}

module.exports = { list, create, update, uploadFile };
