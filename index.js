var Index = {
  itemsWidths: [
    25.7,
    74.3,
    30,
    34.6,
    35.4,
    64.2,
    35.8,
    30.1,
    69.9,
    37,
    32.8,
    30.2,
    30.8,
    34.6,
    34.6,
    69.2,
    30.8,
    65.8,
    34.2
  ],
  gridSetup: function() {
    var margin = 2.5;
    var grid = document.querySelector(".grid")
    var gridItems = grid.querySelectorAll(".grid-item");

    for (var i = 0; i < gridItems.length; i++) {
      // var itemWidth = ( ParseInt($(grid).innerWidth()) / 100) * itemsWidths[i] - margin * 2;
      gridItems[i].style.width = this.itemsWidths[i] + "%";
    }
  },
  modernize: function() {
    // photo slides
    if (!Modernizr.cssvhunit) {
      consoloe.log('falling back vh')
      $('.photoSlides').css('height', $(window).height());
    }
  }
}

var Slider = {
  slots: {
    a: $('.photo-top'),
    b: $('.photo-bottom')
  },
  stack: {
    top: $('.photo-top'),
    bottom: $('.photo-bottom')
  },
  slideUrls: [
    'photos/02-21_20140108170653_3959947_large.jpg',
    'photos/21_20131213163318_3929317_large.jpg',
    'photos/21_20131213163343_3929319_large.jpg',
    'photos/21_20101122202029_1047854_large.jpg',
    'photos/21_20131213163327_3929318_large.jpg'
  ],
  slideUrlsNarrow: [
    'photos/01-21_20101122172143_1047015_large.jpg',
    'photos/03-21_20101122171701_1046978_large.jpg',
    'photos/04-21_20101122172201_1047019_large.jpg',
    'photos/05-21_20101122172138_1047013_large.jpg',
    'photos/10-21_20101122171806_1046992_large.jpg'
  ],
  mobile: false,
  updDevice: function(width) {
    width = parseInt(width);
    if (width < 650) {
      if (!this.mobile) {
        this.mobile = true;
      }
    } else if (width > 650) {
      if (this.mobile) {
        this.mobile = false;
      }
    }
  },
  init: function(period, opts) {
    this.period = period;
    this.slots.a.addClass('ztop');
    this.slots.a.addClass('transition');

    this.slideUrls.push(this.slideUrls.shift());
    this.slideUrls.push(this.slideUrls.shift());

    var self = this;
    if (opts && opts.adaptToMobile) {
      if (parseInt($(window).width()) < 650) {
        this.mobile = true;
      };

      $(window).resize(function() {
        self.updDevice($(window).width());
      })
    }

    this.timeoutId = window.setTimeout(function() {
      self.slide();
    }, self.period);
  },
  slide: function() {
    var self = this;
    this.doSlide(this.stack.top, this.stack.bottom, function(top, bottom, cb) {
     this.timeoutId = window.setTimeout(function() {
       console.log(self)
       console.log(this)
         self.doSlide(top, bottom, cb)
     }, self.period)
    })
  },
  doSlide: function(top, bottom, cb) {
    var self = this;
    top.addClass('transparent');
    top.on('transitionend', function() {
      // prepare the slot to be the bottom next time
      $(this).removeClass('transition');
      $(this).removeClass('ztop');

      // put the bottom slide on the top
      bottom.addClass('ztop');
      bottom.addClass('transition');

      // bottom is now at the top, so we can make the latest top slot rigid
      $(this).removeClass('transparent');
      $(this).off('transitionend');

      var urls = (self.mobile) ? self.slideUrlsNarrow : self.slideUrls;
      var image = urls.shift();
      $(this).css('background-image', 'url('+ image +')');
      urls.push(image);
      console.log(cb)
      cb(bottom, top, cb)
      // self.stack.top = bottom;
      // self.stack.bottom = top;
    })
  }

    /*

    */

}

function initIndex() {
  // Index.gridSetup();
  Index.modernize();
  Slider.init(2850, {adaptToMobile: true});
}

$(document).ready(initIndex)
