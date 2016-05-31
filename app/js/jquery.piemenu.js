/* Radial pie menu implementation using jQuery and <canvas>.
 *
 * Copyright (c) 2009 Andreas Fuchs <asf@boinkor.net>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


/* See README.markdown for usage info. */

(function($) {
    var defaults = {
            closeRadius: 140, //中心圆半径/
            radius: 300,
            num: 40, //指针的个数
            bigRadius: 350,
            padding: 20,
            outPadding: 1, //指针和外园之间的距离
            closePadding: 3,
            closeSymbolSize: 7,
            imgWidth: 80, //图标半径大小
            imgHeight: 80,
            globalAlpha: 0.9,
            onSelection: function() {},
            className: null,
            elementStyle: null,
            selectedColor: '#e0e0e0',
            backgroundColor: '#f4f4f4',
            disablebackgroundColor: '#F2F2F2',
            parentElement: 'body'
        },

        innerSegmentAngle = function(n) {
            return paddedSegmentAngle(n) ;
        },

        paddedSegmentAngle = function(n) {
            return 2 * Math.PI / n;
        },

        startAngle = function(n, total) {
            return (-Math.PI * 7 / 10) + paddedSegmentAngle(total) * n;
        },

        endAngle = function(n, total) {
            return startAngle(n, total) + innerSegmentAngle(total);
        };


    var setSelectedColor = function(ctx, i, isSelected, options) {
        ctx.fillStyle = (isSelected ? options.selectedColor : options.backgroundColor);

        if (isSelected) {
            //ctx.fillStyle =  options.pieConfig[i].hoverColor;
            ctx.fillStyle = options.selectedColor;
        } else {
            ctx.fillStyle = (options.pieConfig[i].isDisable ? options.disablebackgroundColor : options.backgroundColor);
        }
        console.log(ctx.fillStyle);
    };

    $.fn.pieMenu = function(position, options) {
        $.each(defaults,
            function(defaultName, value) {
                if (!(defaultName in options))
                    options[defaultName] = value;
            });
        var canvas = document.createElement('canvas'),
            highlight = '',
            nSegments = options.pieConfig.length;


        var width = $(document).width() - options.padding;
        // var radio = $(document).width()/414;

        /*
        if (width > 500) {
            width = 500;
        }*/
        //var dpr = 3;
        options.dpr = 3;
      

       
        //console.log("center:"+center);
        canvas.setAttribute('width', width * options.dpr);
        canvas.setAttribute('height', width * options.dpr);

        var center = canvas.width/2;

        radius = center; //一共可绘图的半径
        options.closeRadius = radius * 0.42;//内圆半径
        options.radio = $(document).width() / 414;
        if (options.radio > 1) {
            options.radio = 1;
        }
        $("#tip_text").width(center/2);
        $("#tip_text").css("left", center / 2 );
        $("#tip_text").css("margin-top", center / 2);
 
        if (options.className) {
            canvas.className = options.className;
        }
        $(canvas).css({
            width: width,
            height: width,
            margin: "0 auto",
            "-webkit-tap-highlight-color": "transparent",
            display: "block"
        })
        /*
            if (options.elementStyle)
                $(canvas).css(options.elementStyle);
            $(canvas).css({
                top: position.top - radius,
                left: position.left - radius
            });*/

        $(options.parentElement).append($(canvas));

        /*
        if (window.G_vmlCanvasManager) {
            // We're on IE, need to initialize the new canvas.
            window.G_vmlCanvasManager.initElement(canvas);
            canvas.unselectable = 'on'; // Make sure mouse clicks go through.
        }*/
        var draw = function() {
                var ctx = canvas.getContext('2d');
                ctx.globalAlpha = options.globalAlpha;
                ctx.strokeStyle = 'black';
                ctx.fillStyle = options.backgroundColor;
                ctx.lineCap = 'butt';
                ctx.lineJoin = 'round';
                ctx.lineWidth = 2;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Draw segments
                for (var i = 0; i < options.pieConfig.length; i++) {
                   // setSelectedColor(ctx, i, i === highlight, options);
                    drawSlice(ctx, radius, i, nSegments, center);
                }




                //中心区


                ctx.beginPath();
                //console.log("highlight:" + highlight);
                ctx.arc(center, center, options.closeRadius, 0, 2 * Math.PI);
                ctx.fillStyle = "#f5f5f5";
                ctx.fill();


                ctx.beginPath();
                //console.log("highlight:" + highlight);
                ctx.arc(center, center, options.closeRadius-20, 0, 2 * Math.PI);
                ctx.fillStyle = (highlight === 'x' ? options.selectedColor : "#FFF");
                ctx.fill();




                var centerFontsize = options.radio * 140;
                ctx.textAlign = "center";
                ctx.font = "normal " + centerFontsize + "px Arial,Microsoft YaHei";
                ctx.fillStyle = "#1e4e8e";
                ctx.fillText(options.sumScore, center, center  + radius*0.05);
                

                ctx.font = "normal 35px Arial,Microsoft YaHei";
                // ctx.fillText("9单", center-radius*0.1, center -radius*0.2);
                // ctx.fillText("保障中", center+radius*0.1, center -radius*0.2);
                ctx.fillStyle = "#999999";
                ctx.fillText("最高10分", center, center +radius*0.2);

            },
            destroy = function() {
                $(canvas).remove();
            },
            onClick = function(e) {
                changeHighlight(e);
                if (highlight !== null && highlight !== '')
                    if (highlight >= 0 && highlight < nSegments || highlight == 'x') {
                        if (e.data)
                            e.data(highlight);
                    }
                    //destroy();
            },
            changeHighlight = function(e) {
                var prevHighlight = highlight;
                var posn = $(canvas).offset();
                // console.log("x:" + e.pageX);
                // console.log("y:" + e.pageY);
                var x = e.pageX - posn.left,
                    y = e.pageY - posn.top;
                x = x * options.dpr;
                y = y * options.dpr;
                var cX = canvas.width / 2,
                    cY = canvas.height / 2;
                var centerDistance = Math.sqrt((cX - x) * (cX - x) + (cY - y) * (cY - y));
                // console.log("centerDistance:"+centerDistance);
                // console.log("width:"+width);
                // console.log("radius:"+radius);
                //console.log("highlight:"+highlight);
                //console.log("prevHighlight:"+prevHighlight);
                if (centerDistance < options.closeRadius) {
                    highlight = 'x';

                    // 点中间的默认不让显示了。
                    if (highlight != prevHighlight) {
                        draw();
                    }
                    /**/

                    //                } else if ( (centerDistance > (options.closeRadius + options.closePadding)) && (centerDistance<=radius) ) {
                } else if ((centerDistance > (options.closeRadius)) && (centerDistance <= width)) {
                    var dX = x - cX,
                        dY = y - cY;
                    var angle = null;
                    if (dX < 0) {
                        /*
                        if (dY < 0) {
                            angle = Math.asin(dY / centerDistance);
                        } else {
                            angle = Math.PI + Math.asin(-dY / centerDistance);
                        }*/
                        angle = Math.PI + Math.asin(-dY / centerDistance);
                        //console.log(Math.asin(dY / centerDistance));

                    } else {
                        angle = Math.asin(dY / centerDistance);
                    }
                    if(angle>=1.3*Math.PI && angle<=1.5*Math.PI){//计算角度的时候采用的取值不同,startAngle采用的是负值。
                        angle =angle -2*Math.PI;
                    }
                    // angle = angle - 0.7*Math.PI;
                    /*    
                    var firstAngle = 2*Math.PI - 0.7*Math.PI;
                    if(angle>firstAngle){
                         angle = 2*Math.PI-angle;
                     }*/
                    // console.log("angle...:"+angle);
                    //console.log("angle2...:"+(angle - 0.7*Math.PI));
                    //console.log("start angle:"+startAngle(0, nSegments));
                    //console.log("end angle:"+endAngle(0, nSegments));


                    for (var i = 0; i < options.pieConfig.length; i++) {
                        //                        if (startAngle(i, nSegments) < angle && endAngle(i, nSegments) >= angle && !options.pieConfig[i].isDisable) {
                        if (startAngle(i, nSegments) < angle && endAngle(i, nSegments) >= angle) {
                            highlight = i;
                            break;
                        }
                    }
                    /*
                     $('img', menu).each(
                         function(i, img) {
                             if (startAngle(i, nSegments) < angle &&
                                 endAngle(i, nSegments) >= angle) {
                                 highlight = i;
                                 return false;
                             }
                             return true;
                         });*/
                    if (highlight != prevHighlight) {
                        draw();
                    }
                } else if (centerDistance > width) {
                    highlight = '';
                    draw();

                }
            },
            toAngle = function(x) {
                return x * 180 / Math.PI
            },
            preLoadImg = function(url, callback) {
                var img = new Image(); //创建一个Image对象，实现图片的预下载  
                img.src = url;

                if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数  
                    callback.call(img);
                    return; // 直接返回，不用再处理onload事件  
                }

                img.onload = function() { //图片下载完毕时异步调用callback函数。  
                    callback.call(img); //将回调函数的this替换为Image对象  
                };
            },
            drawLine = function(ctx,centerX,centerY,angle,smallRadius,bigRadius){

                ctx.beginPath();
                ctx.strokeStyle="#000";
                ctx.save();
                ctx.translate(centerX, centerY);
                var x1 = Math.cos(angle) * (smallRadius);
                var y1 = Math.sin(angle) * (smallRadius);
                var x2 = Math.cos(angle) * (bigRadius);
                var y2 = Math.sin(angle) * (bigRadius);
              
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                ctx.restore();
            },
            drawSector = function(ctx,color,centerX,centerY,startAngle,endAngle,smallRadius,bigRadius){
                ctx.beginPath();
                ctx.fillStyle = color;
                ctx.arc(centerX, centerY, smallRadius,startAngle, endAngle, false);
                ctx.arc(centerX, centerY, bigRadius, endAngle , startAngle, true); 
                ctx.closePath();
                ctx.fill();
            },
            drawSlice = function(ctx, radius, n, total, center) {



                var startA = startAngle(n, total),
                    endA = endAngle(n, total);
                //console.log("startA:" + toAngle(startA));
                //console.log("endA:" + toAngle(endA));
                //console.log("startA:" + (startA));

                var bigRadius = radius * 0.7;


                /*
                debug...
                ctx.moveTo(center, center);
                ctx.lineTo(center+bigRadius, center);
                ctx.moveTo(center, center+10);
                ctx.lineTo(center+radius, center+10);
                ctx.stroke();
                */
                var pianX = 10;//圆心偏移的距离

                var middleAngle = (startA+endA)/2;

                var centerX = center + Math.cos(middleAngle) * pianX;
                var centerY = center + Math.sin(middleAngle) * pianX;

                //绘画基础扇形
                console.log(" highlight:"+ highlight);
                console.log(" n:"+ n);
                var pieColor = highlight===n?options.selectedColor:"#ebebeb";
                console.log(" pieColor:"+ pieColor);
                drawSector(ctx,pieColor, centerX,centerY,startA,endA,options.closeRadius-pianX,bigRadius);
               
                //绘画灰色分数扇形 
                var innerRadius = bigRadius +5;
                var outterRadius = bigRadius + 40;
                 // ctx.fillStyle = (isSelected ? options.selectedColor : options.backgroundColor);
           
                drawSector(ctx,"#f0f0f0", centerX,centerY,startA,endA,innerRadius,outterRadius);
                //drawSector(ctx,"#f0f0f0", centerX,centerY,startA,endA,innerRadius,outterRadius);

                //绘画带颜色的分数扇形 
                var anglePercent = (endA  - startA)*options.pieConfig[n].percent + startA;
                drawSector(ctx, options.pieConfig[n].color, centerX,centerY,startA,anglePercent,innerRadius,outterRadius);
               
                /*
                 drawLine(ctx,centerX,centerY,anglePercent,bigRadius+5,secHandLength);
                 drawLine(ctx,centerX,centerY,startA,bigRadius+5,secHandLength);
                /*
                var angDis = (endA + 0.04 - startA) / options.num;
              
                ctx.lineWidth = 1;
                for (var i = 0; i < options.num; i++) {
                    var angle = startA + angDis * i;
                    var percent = i / options.num;
                    ctx.beginPath();
                    ctx.save();
                    ctx.translate(center, center);
                    var x1 = Math.cos(angle) * (secHandLength);
                    var y1 = Math.sin(angle) * (secHandLength);
                    var x2 = Math.cos(angle) * (secHandLength + (secHandLength / 8));
                    var y2 = Math.sin(angle) * (secHandLength + (secHandLength / 8));

                    if (percent < options.pieConfig[n].percent) {
                        ctx.strokeStyle = options.pieConfig[n].color;
                    } else {
                        ctx.strokeStyle = "#bcbcbc";
                    }
                    // ctx.strokeStyle="#000";
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    //console.log(x1+":"+y1);
                    //console.log(x2+":"+y2);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.restore();
                }
                */

                var textHandLength = innerRadius + (outterRadius - innerRadius)/2 ;
                var middleAngle = (startA + endA) / 2;
                ctx.beginPath();
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.textAlign = "center";
                ctx.font = "normal 35px Arial,Microsoft YaHei";
                ctx.fillStyle = options.pieConfig[n].textColor;
                ctx.fillText(Math.floor((options.pieConfig[n].percent * 10)*10)/10, Math.cos(middleAngle) * textHandLength, Math.sin(middleAngle) * textHandLength + 15);
                ctx.restore();
                ctx.closePath();



                //console.log(".....................................")



                //                用图片来化
                if (options.pieConfig[n].img) {
                    preLoadImg(options.pieConfig[n].img, function() {
                        var iconW = options.imgWidth * options.radio;
                        var iconH = options.imgHeight * options.radio;

                        /*
                         if(screen.height<=480){
                             iconW = options.imgWidth*0.8;
                             iconH = options.imgHeight*0.8;
                        }*/
                        var iconCenterRadius = center * 0.62 - Math.max(iconW, iconH) / 2;
                        var midAngle = startA + (endA - startA) / 2;
                        var iconX = Math.cos(midAngle) * iconCenterRadius;
                        var iconY = Math.sin(midAngle) * iconCenterRadius - 20 * options.radio;
                        ctx.drawImage(this, center + iconX - iconW / 2, center + iconY - iconH / 2, iconW, iconH);
                        ctx.textAlign = "center";
                        ctx.font = " normal  35px Arial,Microsoft YaHei";
                        ctx.fillStyle = "#6f6f6f";
                        ctx.fillText(options.pieConfig[n].text, center + iconX, center + iconY + 80 * options.radio);
                    })

                }


            };

        $(canvas).
        mousemove(changeHighlight).
        mouseleave(function(e) {
            highlight = null;
            draw();
        }).
        bind('click', options.onSelection, onClick);
        draw();
    };
}(jQuery));