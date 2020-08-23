const Follow = require("../models/follow");
const User = require("../models/user");

const followController = {
  async addFollow(req, res, next) {
    const { userId, followId } = req.body;
    let follow;

    try {
      follow = await Follow.findOne({ user: userId });
      if (!follow) {
        follow = new Follow();
        follow.user = userId;
        follow.follows.push(followId);
        follow.save();
      } else {
        if (!follow.follows.includes(followId)) {
          follow.follows.push(followId);
          follow.save();
        } else {
          let ids = follow.follows.filter((res) => res != followId);
          follow.follows = ids;
          follow.save();
        }
      }

      return res.status(200).json({ data: follow });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },

  async getFollows(req, res, next) {
    const { userId } = req.params;
    let follow;
    try {
      follow = await Follow.findOne({ user: userId });
      return res.status(200).json({ data: follow });
    } catch (err) {
      console.log(err);
      return res.status(200).json({ error: "Falha Interna" });
    }
  },

  async showFollows(req, res, next) {
    const { userId } = req.params;
    let user, follow;
    try {
      follow = await Follow.findOne({ user: userId });

      let followers = follow ? follow.follows : [];
      let followersData = [];

      for (let i = 0; i < followers.length; i++) {
        user = await User.findById(followers[i]);

        if (req.query.filter) {
          let re = new RegExp(req.query.filter, "g");
          if (re.test(user.username)) {
            followersData.push({
              _id: user._id,
              username: user.username,
              image: user.image,
            });
          }
        } else {
          followersData.push({
            _id: user._id,
            username: user.username,
            image: user.image,
          });
        }
      }

      return res.status(200).json({ data: followersData });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Falha Interna" });
    }
  },
};

module.exports = followController;
