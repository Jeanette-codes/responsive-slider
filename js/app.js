(function($){

    jQuery.fn.extend({

        rSlider: function(){

            // arguments array alias
            var c = typeof arguments[0] !== 'undefined' ? arguments[0] : {};

            // default values
            var slideSelector = typeof c.slides !== 'undefined' ? c.slides : 'li'; 
            var nextSelector = typeof c.next !== 'undefined' ? c.next : '.next'; 
            var prevSelector = typeof c.prev !== 'undefined' ? c.prev : '.prev'; 
            this.curSlide = typeof c.start !== 'undefined' ? c.start : 0;
            this.loop = typeof c.loop !== 'undefinded' ? c.loop : false;
            this.speed = typeof c.speed !== 'undefinded' ? c.speed : 1000;
            this.nextCallback = typeof c.nextCallback !== 'undefined' ? c.nextCallback : {};
            this.prevCallback = typeof c.prevCallback !== 'undefined' ? c.prevCallback : {};

            this.slider = this;
            this.slides = this.slider.find(slideSelector); 
            this.next = this.slider.find(nextSelector);
            this.prev = this.slider.find(prevSelector);
            this.index = this.slides.length - 1;
            this.trigger = false;

            this.init = function(){
                var self = this;
                this.show();
                this.setListeners();
            };

            this.setListeners = function() {
                this.setNext();
                this.setPrev();
            };

            // unbinds controls but adds empty click to prevent default
            this.unbindNext = function() {
                this.next.unbind('click').bind('click', function(e){
                    e.preventDefault();
                });
            };

            // unbinds controls but adds empty click to prevent default
            this.unbindPrev = function() {
                this.prev.unbind('click').bind('click', function(e){
                    e.preventDefault();
                });
            };

            // sets previous button click handler
            this.setPrev = function(){
                var self = this;
                if(this.curSlide !== 0 && this.loop === false) {
                    this.prev.unbind('click').bind('click', function(e){
                        e.preventDefault();
                        self.moveSlide('back');
                        if(self.curSlide !== 0) self.curSlide = self.curSlide - 1;
                        self.prev.removeClass('inactive');
                        self.next.removeClass('inactive');
                        self.prevCallback();
                    });
                } else if (this.loop === false) {
                    this.prev.addClass('inactive');
                } 
                if (this.loop === true) {
                    this.prev.unbind('click').bind('click', function(e){
                        e.preventDefault();
                        self.moveSlide('back');
                        if(self.curSlide === 0){ 
                            //self.curSlide = self.curSlide;
                        } else {
                            self.curSlide = self.curSlide - 1;
                        }
                        self.prevCallback();
                    });
                } 
            };

            // sets next button click handler
            this.setNext = function(){
                var self = this;
                if(this.curSlide !== this.index && this.loop === false) {
                    this.next.unbind('click').bind('click', function(e){
                        e.preventDefault();
                        self.moveSlide('forward');
                        if(self.curSlide !== self.index) self.curSlide = self.curSlide + 1;
                        self.nextCallback();
                        self.prev.removeClass('inactive');
                        self.next.removeClass('inactive');
                    });
                } else if (this.loop === false) {
                    this.next.addClass('inactive');
                } 
                if (this.loop === true) { 
                    this.next.unbind('click').bind('click', function(e){
                        e.preventDefault();
                        self.moveSlide('forward');
                        self.curSlide = self.curSlide + 1
                        self.prevCallback();
                    });
                }
            };
                    

            // hides everything but the passed slide index
            // sets current slide number 
            this.show = function() {
                var self = this;
                this.slides.each(function(i,e){
                    if(i !== self.curSlide)$(e).hide();
                });
            };

            // returns width of slider div
            this.getWidth = function(){
                return this.slider.width();
            };

            // returns height of slider div
            this.getHeight = function(){
                return this.slider.height();
            };

            // strips inline styles and shows the slide requested
            this.endRender = function(){
                this.slider.attr('style','');
                this.slides.attr('style','');
                this.show();
            };

            this.moveSlide = function(direction){
                var mod = (direction === 'back') ? -1 : 1;
                var self = this;
                var height = this.getHeight();
                var width = this.getWidth();
                var slide = $(this.slides[this.curSlide]);
                var nextSlide = $(this.slides[this.curSlide + mod]);

                //TODO not entirely sure this logic should be in the move function
                if(this.loop === true) {
                    if (this.curSlide === this.index && direction === 'forward') {
                        nextSlide = $(this.slides[0]);
                        this.curSlide = -1;
                    }
                    if(this.curSlide === 0 && direction === 'back') {
                        nextSlide = $(this.slides[this.index]);
                        this.curSlide = this.index + 1;
                    } 
                }

                this.unbindNext();
                this.unbindPrev();

                this.slider.css({
                    'width': width,
                    'height': height
                });

                slide.css({
                    'position': 'absolute', 
                    'left': 0, 
                    'top': 0, 
                    'width': width, 
                    'height': height
                });

                nextSlide.css({
                    'position': 'absolute', 
                    'left': width * mod, 
                    'top': 0, 
                    'width': width, 
                    'height': height,
                    'display': 'block'
                });

                slide.animate({
                    left: width * -mod
                },this.speed);

                nextSlide.animate({
                    left:0
                },this.speed, function(){
                    self.setNext();
                    self.setPrev();
                    self.endRender();
                });
            };
            this.init();
        }
    });
})(jQuery);

$('.slider').rSlider({
    slides: 'li',
    next: '.next',
    prev: '.prev',
    start: 0,
    loop: true,
    speed: 100,
    nextCallback: function() {
    },
    prevCallback: function() {
    }
});
