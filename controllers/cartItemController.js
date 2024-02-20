const Cart = require('../models/cartItem');
const Item = require('../models/products');

const addCartItem = async (req, res) => {
    let userId = req.params.userId;
    
    if (!userId && req.user) {
        userId = req.user._id; 
    }

    if (!userId) {
        return res.status(401).send('User not authenticated');
    }

    const { productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId });
        let item = await Item.findOne({ _id: productId });

        if (!item) {
            return res.status(404).send('Item not found!');
        }

        const price = item.sellPrice;
        const name = item.productName;

        if (cart) {
            let itemIndex = cart.items.findIndex(p => p.productId == productId);

            if (itemIndex > -1) {
                let productItem = cart.items[itemIndex];
                productItem.quantity += quantity;
                cart.items[itemIndex] = productItem;
            } else {
                cart.items.push({ productId, name, quantity, price });
            }
            cart.bill += quantity * price;
            cart = await cart.save();
            return res.status(201).send(cart);
        } else {
            const newCart = await Cart.create({
                userId,
                items: [{ productId, name, quantity, price }],
                bill: quantity * price
            });
            return res.status(201).send(newCart);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}


const getCartItems = async (req, res) => {
    const userId = req.params.id;
    try{
        let cart = await Cart.findOne({userId});
        if(cart && cart.items.length>0){
            res.send(cart);
        }
        else{
            res.send(null);
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

const updateCartItem = async (req, res) => {
    const userId = req.params.id;
    const { productId, quantity } = req.body;

    try{
        let cart = await Cart.findOne({userId});
        let item = await Item.findOne({_id: productId});

        if(!item)
            return res.status(404).send('Item not found!'); 
        
        if(!cart)
          return res.status(400).send("Cart not found");
        else{
            // if cart exists for the user
            let itemIndex = cart.items.findIndex(p => p.productId == productId);

            // Check if product exists or not
            if(itemIndex == -1)
              return res.status(404).send('Item not found in cart!');
            else {
                let productItem = cart.items[itemIndex];
                productItem.quantity = quantity;
                cart.items[itemIndex] = productItem;
            }
            cart.bill = cart.items.reduce((sum, item) => sum + item.price * item.quantity,0);
            cart = await cart.save();
            return res.status(201).send(cart);
        }     
    }
    catch (err) {
        console.log("Error in update cart", err);
        res.status(500).send("Something went wrong");
    }
}

const deleteCartItemById = async (req, res) => {
    const userId = req.params.userId;
    const itemId = req.params.itemId;
    try {
        let cart = await Cart.findOneAndUpdate(
            { userId: userId },
            { $pull: { items: { _id: itemId } } },
            { new: true }
        );
        if (!cart) {
            return res.status(404).send("Cart not found");
        }
        // Recalculate the bill after item removal
        cart.bill = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        cart = await cart.save();
        return res.status(200).send(cart);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

const deleteAllCartItems = async (req, res) => {
    const userId = req.params.userId;
    try {
        let cart = await Cart.findOneAndDelete({ userId: userId });
        if (!cart) {
            return res.status(404).send("Cart not found");
        }
        return res.status(200).send("Cart items deleted successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}


module.exports = { addCartItem, getCartItems, updateCartItem, deleteAllCartItems, deleteCartItemById };
