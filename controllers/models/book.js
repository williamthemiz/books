const mongoose = require('mongoose');
let Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

//definiendo el esquema de libro

let BookSchema = new Schema(
    {
        title: {type : String,required : true},
        author: {type : String,required : true},
        year:   {type : Number,required : true},
        pages:  {type : Number,required : true,min : 1},
        createdAt:  {type: Date,default:Date.now}
    },
    {
        versionKey:false
    }
);

//establece createdAt a la fecha de actual

BookSchema.pre('save',next => {
    now = new Date();
    if(!this.createdAt)
    {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('book',BookSchema);