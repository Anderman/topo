(function ($) {

    $.fn.canvasAreaDraw = function (options) {

        this.each(function (index, element) {
            init.apply(element, [index, element, options]);
        });
    }

    var init = function (index, input, options) {
        var img = $(input)[index];
        var usemap = $('map[name="' + img.useMap.substr(1) + '"]')[0];
        var areas = usemap.areas;
        var PreventChange = false;
        input.ShowArea = function (index) {
            PreventChange = false;
            area = areas[index];
            var alt = area.alt;
            var coords = area.coords;
            if (coords.length) {
                points = coords.split(',').map(function (point) {
                    return parseInt(point, 10);
                });
            } else {
                points = [];
            }
            draw();
        };
        input.Highlight = function (index, text) {
            area = areas[index];
            var alt = area.alt;
            var coords = area.coords;
            if (coords.length) {
                points = coords.split(',').map(function (point) {
                    return parseInt(point, 10);
                });
            }
            var xCenter = 0, yCenter = 0
            for (var i = 0; i < points.length-1; i += 2) {
                xCenter += points[i];
                yCenter += points[i + 1];
            }
            xCenter = xCenter / ((points.length == 3 ? 2 : points.length) / 2);
            yCenter = yCenter / ((points.length == 3 ? 2 : points.length) / 2);
            PreventChange = true;
            draw();
            Hightlight(xCenter, yCenter, text);

        };
        input.clean = function () {
            ctx.canvas.width = ctx.canvas.width;
        }
        input.SaveArea = function () {
            PreventChange = false;
            var newCoords = points.join(',');
            if (typeof area != 'undefined' && area && area.coords != newCoords
                //&& window.confirm("Save coords?")
                ) {
                area.coords = newCoords;
            }
        }

        var points = [], activePoint, settings;
        var  $canvas, ctx, image;
        var draw, mousedown, stopdrag, move, resize,  rightclick;

        settings = $.extend({
            imageUrl: $(this).attr('data-image-url')
        }, options);

        //$reset = $('<button type="button" class="btn"><i class="icon-trash"></i>Clear</button>');
        $canvas = $('<canvas>');
        ctx = $canvas[0].getContext('2d');

        image = new Image();
        resize = function () {
            $canvas.attr('height', image.height).attr('width', image.width);
            $(input).attr('height', image.height).attr('width', image.width);
            $('#ImageCell').attr('width', image.width);
            draw();
        };
        $(image).load(resize);
        image.src = settings.imageUrl;
        if (image.loaded) resize();
        $canvas.css({ background: 'url(' + image.src + ')' });

        $(document).ready(function () {
            $(input).after($canvas);//$('<div class="EditUseMap" style="display:none;"').prepend(>
            
            $canvas.on('mousedown', mousedown);
            $canvas.on('contextmenu', rightclick);
            $canvas.on('mouseup', stopdrag);
        });


        move = function (e) {
            if (PreventChange) return;
            if (!e.offsetX) {
                e.offsetX = (e.pageX - $(e.target).offset().left);
                e.offsetY = (e.pageY - $(e.target).offset().top);
            }
            points[activePoint] = Math.round(e.offsetX);
            points[activePoint + 1] = Math.round(e.offsetY);
            draw();
        };

        stopdrag = function () {
            if (PreventChange) return;
            $(this).off('mousemove');
            activePoint = null;
        };

        rightclick = function (e) {
            if (PreventChange) return;
            e.preventDefault();
            if (!e.offsetX) {
                e.offsetX = (e.pageX - $(e.target).offset().left);
                e.offsetY = (e.pageY - $(e.target).offset().top);
            }
            var x = e.offsetX, y = e.offsetY;
            for (var i = 0; i < points.length-1; i += 2) {
                dis = Math.sqrt(Math.pow(x - points[i], 2) + Math.pow(y - points[i + 1], 2));
                if (dis < 6) {
                    points.splice(i, 2);
                    draw();
                    return false;
                }
            }
            return false;
        };

        mousedown = function (e) {
            if (PreventChange) return;
            var x, y, dis, lineDis, insertAt = points.length;

            if (e.which === 3) {
                return false;
            }

            e.preventDefault();
            if (!e.offsetX) {
                e.offsetX = (e.pageX - $(e.target).offset().left);
                e.offsetY = (e.pageY - $(e.target).offset().top);
            }
            x = e.offsetX; y = e.offsetY;

            for (var i = 0; i < points.length-1; i += 2) {
                dis = Math.sqrt(Math.pow(x - points[i], 2) + Math.pow(y - points[i + 1], 2));
                if (dis < 6) {
                    activePoint = i;
                    $(this).on('mousemove', move);
                    draw();
                    return false;
                }
            }

            for (var i = 0; i < points.length-1; i += 2) {
                if (i > 1) {
                    lineDis = dotLineLength(x, y, points[i], points[i + 1], points[i - 2], points[i - 1], true);
                    if (lineDis < 6) {
                        insertAt = i;
                    }
                }
            }

            points.splice(insertAt, 0, Math.round(x), Math.round(y));
            activePoint = insertAt;
            $(this).on('mousemove', move);
            draw();
            return false;
        };

        Hightlight = function (x, y, text) {
            ctx.font = "30px Verdana";
            // Create gradient
            var gradient = ctx.createLinearGradient(x, y, ctx.canvas.width, 0);
            gradient.addColorStop("0", "red");
            gradient.addColorStop("0.5", "orange");
            gradient.addColorStop("1.0", "yellow");
            // Fill with gradient
            ctx.strokeStyle = 'rgb(0,0,0)';// gradient;
            ctx.fillStyle = gradient;
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        }
        draw = function () {
            ctx.canvas.width = ctx.canvas.width;

            if (points.length < 2) {
                return false;
            }
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'rgb(255,255,255)'
            ctx.strokeStyle = 'rgb(255,20,20)';
            ctx.lineWidth = 1;
            if (points.length == 3) {
                ctx.fillRect(points[0] - 2, points[1] - 2, 4, 4);
                ctx.strokeRect(points[0] - 2, points[1] - 2, 4, 4);
                ctx.fillStyle = 'rgba(255,0,0,0.3)';
                ctx.arc(points[0], points[1], points[2], 0, 2 * Math.PI);
                ctx.stroke();

            }
            else if (points.length == 4) {
                ctx.fillRect(points[0] - 2, points[1] - 2, 4, 4);
                ctx.fillRect(points[2] - 2, points[3] - 2, 4, 4);
                ctx.strokeRect(points[0] - 2, points[1] - 2, 4, 4);
                ctx.strokeRect(points[2] - 2, points[3] - 2, 4, 4);
                ctx.fillStyle = 'rgba(255,0,0,0.3)';
                ctx.fillRect(points[0], points[1], points[2] - points[0], points[3] - points[1]);
                ctx.stroke();

            }
            else {
                ctx.beginPath();
                ctx.moveTo(points[0], points[1]);
                for (var i = 0; i < points.length-1; i += 2) {
                    ctx.fillRect(points[i] - 2, points[i + 1] - 2, 4, 4);
                    ctx.strokeRect(points[i] - 2, points[i + 1] - 2, 4, 4);
                    if (points.length > 2 && i > 1) {
                        ctx.lineTo(points[i], points[i + 1]);
                    }
                }
                ctx.closePath();
                ctx.fillStyle = 'rgba(255,0,0,0.3)';
                ctx.fill();
                ctx.stroke();
            }
        };

    };

    $(document).ready(function () {
        $('.canvas-area[data-image-url]').canvasAreaDraw();
    });

    var dotLineLength = function (x, y, x0, y0, x1, y1, o) {
        function lineLength(x, y, x0, y0) {
            return Math.sqrt((x -= x0) * x + (y -= y0) * y);
        }
        if (o && !(o = function (x, y, x0, y0, x1, y1) {
          if (!(x1 - x0)) return { x: x0, y: y };
        else if (!(y1 - y0)) return { x: x, y: y0 };
          var left, tg = -1 / ((y1 - y0) / (x1 - x0));
          return { x: left = (x1 * (x * tg - y + y0) + x0 * (x * -tg + y - y1)) / (tg * (x1 - x0) + y0 - y1), y: tg * left - tg * x + y };
        }(x, y, x0, y0, x1, y1), o.x >= Math.min(x0, x1) && o.x <= Math.max(x0, x1) && o.y >= Math.min(y0, y1) && o.y <= Math.max(y0, y1))) {
            var l1 = lineLength(x, y, x0, y0), l2 = lineLength(x, y, x1, y1);
            return l1 > l2 ? l2 : l1;
        }
        else {
            var a = y0 - y1, b = x1 - x0, c = x0 * y1 - y0 * x1;
            return Math.abs(a * x + b * y + c) / Math.sqrt(a * a + b * b);
        }
    };
})(jQuery);
