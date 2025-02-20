var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is a required field.'],
        maxLength: [50, 'Max length allowed is 50, got {VALUE}'],
        trim: true
    },
    genre: [{
        type: String,
        maxLength: [30, 'Max length allowed is 30, got {VALUE}'],
        default: undefined,
        trim: true,
        required: true
    }],
    genreString: {
        type: String,
        default: function () {
            str = '';
            this.genre.forEach((g) => {
                str += g + ', ';
            });
            return str.slice(0, -2);
        }
    },
    author: {
        type: String,
        required: true,
        default: 'John Doe',
        trim: true,
        maxLength: [50, 'Max length allowed is 50, got {VALUE}'],
    },
    description: {
        type: String,
        required: false,
        default: function () {
            return `${this.title} | A work by ${this.author}`
        },
        maxLength: [500, 'Max length allowed is 500, got {VALUE}'],
    },
    rating: {
        type: mongoose.Schema.Types.Decimal128,
        min: [0.0, 'Rating cannot be negative.'],
        max: [5.0, 'Maximum possible rating is 5, got {VALUE}'],
        get: (r) => { return Number(r).toFixed(1); },
        required: true,
        default: 0.0
    },
    mrp: {
        type: mongoose.Schema.Types.Decimal128,
        min: [0.0, 'MRP of the book cannot be negative.'],
        get: (r) => { return Number(r).toFixed(1); },
        required: false
    },
    available_copies: {
        type: Number,
        min: [0, 'Available copies cannot be negative.'],
        default: 0,
        required: true,
        default: 0
    }
});

/* Custom validator for the genre array */
bookSchema.path('genre').validate(
    function (arr) {
        if (!arr) throw new Error('You must specify atleast one valid genre for the book.');
        else return true;
    },
    'Genre cannot be an empty array.'
);

module.exports = mongoose.model("book", bookSchema);
