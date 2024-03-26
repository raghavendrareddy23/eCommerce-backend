const WishList = require('../models/wishList');
const Item = require('../models/products');


const addToWishList = async (req, res) => {
    let userId = req.params.userId;

    if (!userId && req.user) {
        userId = req.user._id;
    }

    if (!userId) {
        return res.status(401).send('User not authenticated');
    }

    const { productId } = req.body;

    try {
        let wishList = await WishList.findOne({ userId });
        let item = await Item.findOne({ _id: productId });

        if (!item) {
            return res.status(404).send('Item not found!');
        }

        if (wishList) {
            let existingItem = wishList.items.find(item => item.productId.equals(productId));

            if (existingItem) {
                return res.status(400).send('Product is already in the wishlist');
            } else {
                wishList.items.push({ productId });
                wishList = await wishList.save();
                return res.status(201).send(wishList);
            }
        } else {
            const newWishList = await WishList.create({
                userId,
                items: [{ productId}],
            });
            return res.status(201).send(newWishList);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}


const getWishList = async (req, res) => {
    const userId = req.params.userId;
    try {
        const wishList = await WishList.findOne({ userId }).populate('items.productId');
        if (!wishList) {
            return res.status(404).send('Wish list not found');
        }
        res.send(wishList);
    } catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong');
    }
};

const removeFromWishList = async (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;
    try {
        const wishList = await WishList.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId } } },
            { new: true }
        );
        if (!wishList) {
            return res.status(404).send('Wish list not found');
        }
        res.status(200).send(wishList);
    } catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong');
    }
};

module.exports = {
    addToWishList,
    getWishList,
    removeFromWishList,
}
