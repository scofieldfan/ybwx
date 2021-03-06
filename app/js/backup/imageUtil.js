var ImageUtil = {

    imagecut: function(oriwidth, oriheight, OUTPUT_WIDTH, OUTPUT_HEIGHT) {

        var CUT_LIMIT = 40;
        var STAN_H_W = OUTPUT_HEIGHT / OUTPUT_WIDTH;
        var width = parseFloat(oriwidth);
        var height = parseFloat(oriheight);
        var CutLeft = 0,
            CutTop = 0,
            CutRight = width,
            CutBottom = height,
            CH = 0,
            CW = 0,
            H_W = 0,
            CH_A = 0,
            CW_A = 0,
            H_O = 0;
        var cutType = 0;
        if (height < width * 0.90) {
            CH = height * 0.30;
            CW = width * 0.20;
            if (height * 0.70 > width * STAN_H_W) {
                CW_A = 0;
                CH_A = height - width * STAN_H_W;
                cutType = 11;
            } else if (height * 0.70 > width * 0.80 * STAN_H_W) {
                CH_A = CH;
                CW_A = width - (height - CH_A) / STAN_H_W;
                cutType = 12;
            } else if (height < width * 0.80 * STAN_H_W) {
                CH_A = 0;
                CW_A = width - height / STAN_H_W;
                cutType = 13;
            } else {
                CW_A = CW;
                CH_A = height - (width - CW_A) * STAN_H_W;
                cutType = 14;
            }

            CutTop = CH_A * 0.4;
            CutBottom = CH_A * 0.6;
            CutLeft = CW_A * 0.5;
            CutRight = CW_A * 0.5;
        } else {
            CW = width * 0.12;
            CutLeft = CW * 0.5;
            CutRight = CW * 0.5;

            H_W = height * 0.1 / (width * 0.1);
            CH = height * 0.16;
            CutTop = CH * 0.5;
            CutBottom = height * H_W * H_W * H_W * H_W * 0.045;
            var CutBottom_Limit = parseInt(height - width - CutTop + CutLeft + CutRight);
            if (CutBottom_Limit < 0) CutBottom_Limit = 0;
            if (CutBottom > CutBottom_Limit) CutBottom = CutBottom_Limit;
            if (CutBottom < CH * 0.5) CutBottom = CH * 0.5;

            H_O = height - CutTop - CutBottom;

            if (H_O > width * STAN_H_W) {
                CW_A = 0;
                CH_A = height - width * STAN_H_W;
                cutType = 21;
            } else if (H_O > width * 0.88 * STAN_H_W) {
                CH_A = CutTop + CutBottom;
                CW_A = width - (height - CH_A) / STAN_H_W;
                cutType = 22;
            } else if (height < width * 0.88 * STAN_H_W) {
                CH_A = 0;
                CW_A = width - height / STAN_H_W;
                cutType = 23;
            } else {
                CW_A = CW;
                CH_A = height - (width - CW_A) * STAN_H_W;
                cutType = 24;
            }

            if (CH_A > height * 0.16) {
                CutTop = height * 0.08;
            } else {
                CutTop = CH_A * 0.5;
            }
            // CutTop = height * 0.08;
            CutBottom = CH_A - CutTop;
            CutLeft = CW_A * 0.5;
            CutRight = CW_A * 0.5;
        }

        var after_cut_width = width - CutRight - CutLeft;
        var after_cut_height = height - CutBottom - CutTop;

        var ratio = (after_cut_width / OUTPUT_WIDTH);
        var origin_width = parseInt(width / ratio);
        var origin_height = parseInt(height / ratio);
        var left = parseInt(CutLeft / ratio);
        var top = parseInt(CutTop / ratio);
        var right = parseInt(CutRight / ratio);
        var bottom = parseInt(CutBottom / ratio);
        return [left, top, origin_width, origin_height];
    },

    loadimg_and_cut: function(imageobj, width, height, isP) {
        if (imageobj == undefined || imageobj.length <= 0) return false;
        var img = new Image();
        var imageurl = encodeURIComponent(imageobj.attr('imageurl'));
        img.timeFrom = new Date().getTime();
        img.onload = function() {

            var loadingTime = new Date().getTime() - this.timeFrom;
            if (img.width >= width && img.height >= height) {
                imageobj.attr('src', imageobj.attr('imageurl'));
                var cut_para = ImageUtil.imagecut(img.width, img.height, width, height);
                if (cut_para != null && cut_para.length == 4) {
                    imageobj.attr("width", cut_para[2]);
                    imageobj.attr("height", cut_para[3]);
                    var str = "left:" + -1 * cut_para[0] + "px;top:" + -1 * cut_para[1] + "px";
                    if (isP == null) {
                        str += ";position:relative";
                    }
                    imageobj.attr("style", str);
                }
            } else {
                imageobj.attr('src', imageobj.attr('imageurl'));
                var targetHeight = parseInt(width / img.width * img.height);
                var newWidth;
                var newHeight;
                if (targetHeight > height) {
                    imageobj.attr('width', width);
                    newWidth = width;
                    newHeight = targetHeight;
                } else {
                    imageobj.attr('height', height);
                    var targetWidth = parseInt(height / img.height * img.width);
                    newWidth = targetWidth;
                    newHeight = height;
                }
                var cut_para = ImageUtil.imagecut(newWidth, newHeight, width, height);
                var str = "left:" + -1 * cut_para[0] + "px;top:" + -1 * cut_para[1] + "px";
                if (isP == null) {
                    str += ";position:relative";
                }
                imageobj.attr("style", str);
            }
        }
        img.onerror = function() {
            img.src = imageobj.attr('errorimg');
            $(this).onerror = null;
        }
        img.src = imageobj.attr('imageurl');
    }
}