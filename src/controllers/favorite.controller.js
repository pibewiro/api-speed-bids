const Favorite = require('../models/favorites');
const Product = require('../models/product');

const favoriteController = {
  async getFavorite(req, res, send) {
    const { userId } = req.params;
    let favorite;

    try {
      favorite = await Favorite.findOne({ user: userId });
      return res.status(200).json({ data: favorite });

    } catch (err) {
      console.log(err)
      res.status(500).json({ error: 'Falha Interna' })
    }
  },

  async addFavorite(req, res, next) {
    const { productId, userId } = req.body
    let product, favorite;

    try {
      favorite = await Favorite.findOne({ user: userId })
      if (!favorite) {
        favorite = await Favorite();
        favorite.user = userId;
        favorite.productDetails.push({ productId, active: true })
        favorite.save();
        return res.status(200).json({ success: true, data: favorite })
      }

      else {
        let checkId = favorite.productDetails.some(obj => obj.productId === productId)
        let checkFavs = favorite.productDetails.some(obj => obj.active === true && obj.productId === productId)

        if (!checkId) {
          favorite.productDetails.push({ productId, active: true });
          favorite.save();
        }

        else if (!checkFavs) {
          favorite.productDetails.map(res => {
            if (res.productId === productId) {
              res.active = true;
            }
          })
          favorite.save();
        }

        else {
          favorite.productDetails.map(res => {
            if (res.productId == productId) {
              res.active = false;
              favorite.save();
            }
          })
        }

        return res.status(200).json({ success: true, data: favorite })

      }




    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Falha Interna' })
    }

  },
}

module.exports = favoriteController;