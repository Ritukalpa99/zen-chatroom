const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = asyncHandler(async(req,res) => {
    const {userId} = req.body;

    if(!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }
    let isChat = await Chat.find({
        isGroupChat : false,
        $and : [
            {users : {$elemMatch : {$eq : req.user._id}}},
            {users : {$elemMatch : {$eq : req.userId}}},
        ]
    }).populate("users","-password").populate("lastestMessage");

    isChat = await User.populate(isChat, {
        path : 'latestMessage.sender',
        select : "name pic email",
    });

    if(isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        let chatData = {
            chatName : "sender",
            isGroupChat : false,
            users : [req.user._id, userId],
        };
        try {
            const createdChat = await Chat.create(chatData);

            const FullChat = await Chat.findOne({ _id : createdChat._id}).populate("users","-password");

            res.status(200).send(FullChat);
        }catch(error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
})


const fetchChats = asyncHandler(async (req,res) => {
    try {
        let result = await Chat.find({
            users : {$elemMatch : {$eq : req.user._id}}
        })
        .populate("users", "-password")
        .populate("groupAdmin","-password")
        // .populate("latestMesssage")
        .sort({updatedAt : -1});

        result = await User.populate(result, {
            path : 'latestMessage.sender',
            select : "name pic email",
        });
        // console.log(result);
        res.send(result)
    }catch(error) {

    }
})
module.exports = {accessChat,fetchChats}