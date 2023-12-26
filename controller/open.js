const Feed = require("../models").feed;
const User = require("../models").user;
const { cookie_option } = require("../util/jwt.js");

const {
  create_hashed_password,
  make_password_hashed,
} = require("../util/crypto.js");
const jwt = require("../util/jwt.js");

async function test(req, res) {
  try {
    const data = "ok";
    return res.status(200).send({ message: "테스트 성공", data });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "테스트 실패" });
  }
}

async function item(req, res) {
  const { id } = req.params;
  try {
    const find_feed = await Feed.findByPk(id);
    const data = find_feed;
    return res.status(200).send({ message: "앨범 하나 조회 성공", data });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "앨범 하나 조회 실패" });
  }
}

async function upload_file(req, res) {
  try {
    console.log("file call ok");
    console.log(req.body);
    console.log(req.file);

    res.send("upload ok");
  } catch (err) {
    console.log(err);
  }
}

async function upload_file2(req, res) {
  try {
    console.log("file call ok");
    console.log(req.files);

    res.status(200).send({
      url: req.files[0].location,
    });
  } catch (err) {
    console.log(err);
  }
}

const login = async (req, res) => {
  console.log("call login");
  const { username, password } = req.body;
  try {
    const find_user = await User.findOne({ where: { username } });
    if (!find_user) {
      return res.status(400).send({ code: 400, message: "no_account" });
    }

    const { hashed_password } = await make_password_hashed(
      find_user.salt,
      password
    );
    if (hashed_password !== find_user.password) {
      return res
        .status(400)
        .send({ code: 400, message: "password_do_not_match" });
    }

    const user_data = {
      id: find_user.id,
      username: find_user.username,
    };

    const access_token = jwt.create_access(user_data);
    const refresh_token = jwt.create_refresh(user_data);

    console.log(access_token);
    console.log(refresh_token);

    res.cookie("access_token", access_token, cookie_option);
    res.cookie("refresh_token", refresh_token, cookie_option);

    const data = user_data;
    return res.status(200).send({ code: 200, message: "login_success", data });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "login_server_error" });
  }
};

const join = async (req, res) => {
  const { username, password } = req.body;
  try {
    const { hashed_password, salt } = await create_hashed_password(password);

    const create_user = await User.create({
      username,
      password: hashed_password,
      salt,
    });

    const user_data = {
      id: create_user.id,
      username: create_user.username,
    };

    const access_token = jwt.create_access(user_data);
    const refresh_token = jwt.create_refresh(user_data);

    res.cookie("access_token", access_token, cookie_option);
    res.cookie("refresh_token", refresh_token, cookie_option);

    const data = user_data;
    return res.status(200).send({ code: 200, message: "join_success", data });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "join_server_error" });
  }
};

// 로그아웃
const logout = async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return res.status(200).send({ message: "logout_success" });
  } catch (err) {
    return res.status(500).send({ message: "logout_server_error" });
  }
};

module.exports = { test, item, upload_file, upload_file2, login, join, logout };
