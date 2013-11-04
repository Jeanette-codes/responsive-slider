(function($){

    jQuery.fn.extend({

        rSlider: function(){

            // arguments array alias
            var c = typeof arguments[0] !== 'undefined' ? arguments[0] : {};

            // default values
            var slideSelector = typeof c.slides !== 'undefined' ? c.slides : 'li'; 
            var listNav = typeof c.controls !== 'undefined' ? c.controls : '.controls li a';
            var nextSelector = typeof c.next !== 'undefined' ? c.next : '.next'; 
            var prevSelector = typeof c.prev !== 'undefined' ? c.prev : '.prev'; 
            this.curSlide = typeof c.start !== 'undefined' ? c.start : 0;
            this.loop = typeof c.loop !== 'undefinded' ? c.loop : false;
            this.speed = typeof c.speed !== 'undefinded' ? c.speed : 1000;
            this.nextCallback = typeof c.nextCallback !== 'undefined' ? c.nextCallback : {};
            this.prevCallback = typeof c.prevCallback !== 'undefined' ? c.prevCallback : {};

            this.slider = this.find('.slider');
            this.slides = this.slider.find(slideSelector); 
            this.controls = this.find(listNav);
            this.next = this.slider.find(nextSelector);
            this.prev = this.slider.find(prevSelector);
            this.index = this.slides.length - 1;
            this.trigger = false;
            this.controlArray = [];

            this.init = function(){
                var self = this;
                this.controls.each(function(i, e) {
                    self.controlArray.push($(this));
                });
                this.show();
                this.setButtons();
                this.checkActives();
            };

            // unbinds buttons and adds empty click to prevent default
            this.unbindButtons = function() {
                this.next.unbind('click').bind('click', function(e){
                    e.preventDefault();
                });

                this.prev.unbind('click').bind('click', function(e){
                    e.preventDefault();
                });

                $(this.controlArray).each(function(){
                    this.unbind('click').bind('click', function(e){
                        e.preventDefault();
                    });
                });
            };

            // sets button click handlers
            this.setButtons = function() {
                var self = this;

                this.prev.unbind('click').bind('click', function(e){
                    e.preventDefault();
                    self.moveSlide(self.curSlide - 1);
                    self.prevCallback();
                });
                
                this.next.unbind('click').bind('click', function(e){
                    e.preventDefault();
                    self.moveSlide(self.curSlide + 1);
                    self.nextCallback();
                });

                //TODO build control array only once
                $(this.controlArray).each(function(i, e) {
                    this.unbind('click').bind('click',{index:i}, $.proxy(function(e){
                        e.preventDefault();
                        if(self.curSlide !== e.data.index) {
                            self.moveSlide(e.data.index)
                        }
                    },this));
                });
            };

            // checks and sets the active / inactive state 
            // for nav buttons
            this.checkActives = function(){

                // checks if it's set to loop and if prev / next exist
                if (!this.loop && this.prev.length > 0 && this.next.length > 0){
                    this.prev.removeClass('inactive');
                    this.next.removeClass('inactive');

                    if (this.curSlide === 0){
                        this.prev.addClass('inactive');
                        this.next.removeClass('inactive');
                    } else if (this.curSlide === this.index){
                        this.prev.removeClass('inactive');
                        this.next.addClass('inactive');
                    }
                }

                if (this.controlArray.length > 0) {
                    $(this.controlArray).each(function(){
                        $(this).removeClass('active');
                    });
                    this.controlArray[this.curSlide].addClass('active');
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

            this.moveSlide = function(pos){
                //set curslide in here
                var self = this;
                var mod = (pos < this.curSlide) ? -1 : 1;
                var height = this.getHeight();
                var width = this.getWidth();
                var slide = $(this.slides[this.curSlide]);
                var nextSlide = $(this.slides[pos]);
                this.curSlide = pos;

                // this logic is in move function so the slide
                // comes from the right direction (timing).
                if(this.loop === true) {
                    if (this.curSlide === this.index + 1 && mod === 1) {
                        nextSlide = $(this.slides[0]);
                        this.curSlide = 0;
                    }
                    if(this.curSlide < 0 && mod === -1) {
                        nextSlide = $(this.slides[this.index]);
                        this.curSlide = this.index;
                    } 
                }

                this.unbindButtons();

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
                    self.setButtons();
                    self.endRender();
                });

                this.checkActives();
            };
            this.init();
        }
    });
})(jQuery);

$(document).ready(function(){
    $('.slide-container').rSlider({
        slides: 'li',
        next: '.next',
        prev: '.prev',
        controls: '.slider-list-control li a',
        start: 0,
        loop: false,
        speed: 100,
        nextCallback: function() {
        },
        prevCallback: function() {
        }
    });
});


