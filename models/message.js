const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema(
    {
        header: {type:String, required: true, minLength: 1, maxLength: 40, required: true },
        body: {type:String, required: true, minLength: 1, maxLength: 160, required: true },
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        timestamp: {type: Date, default: Date.now, required: true},
    }
);

messageSchema
.virtual('url')
.get(function () {
    return '/message/' + this._id;
});

module.exports = mongoose.model('Message', messageSchema);