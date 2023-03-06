"use strict";

const helper = {};

helper.displayStars = (stars) => {
    const star = Math.floor(stars);
    const floatStar = stars - star;

    let isHalf = 0;
    if (floatStar != 0) {
        isHalf = floatStar >= 0.5 ? 1 : 0;
    }

    let show = "";
    for (let i = 0; i < star; i++) {
        show += '<i class="fa fa-star"></i>';
    }

    if (isHalf)
        show += '<i class="fa fa-star-half"></i>';

    for (let i = 5 - star - isHalf; i >= 1; i--) {
        show += '<i class="fa fa-star-o"></i>';
    }
    return show;
};

helper.specifications = (specs) => specs.split("\n\n");

helper.formatTime = (time) => time.toString().slice(4, 15);

module.exports = helper;
