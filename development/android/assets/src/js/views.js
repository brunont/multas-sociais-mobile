// A Backbone view you can use which supports transitions
Demo.Views.Page = Backbone.View.extend({
	className: "page",

	initialize: function () {
		this.render();
	},
	show: function () {
		$('.page').css({"position": "absolute"});
		var direction_coefficient = this.options.back? 1 : -1;
		if ($('.page').length) {
			
			var $old = $('.page').not(this.el);
			
			//This fix was hard-won, just doing .css(property, '') doesn't work!
			$old.get(0).style["margin-left"] = ""
			$old.get(0).style["-webkit-transform"] = ""
			
			this.$el.appendTo('body').hide();
			this.$el.show().css({"margin-left": 320 * direction_coefficient});
			this.$el.anim({translate3d: -320 * direction_coefficient +'px,0,0'}, 0.3, 'linear');
			$old.anim({translate3d: -320 * direction_coefficient + 'px,0,0'}, 0.3, 'linear', function() {
				$old.remove();
				$('.page').css({"position": "static"});
			});
		} else {
			this.$el.appendTo('body').hide();
			this.$el.show();
		}
		/* TODO: This is not cross platform. Jquery has .scrollTop(), but zepto does not. Port? */
		window.scrollTo(0, 0);
	}
});


Demo.Views.Index = Demo.Views.Page.extend({

	initialize: function() {
		this.render();
	},

	render: function() {
		var that = this;
		this.collection.each(function(feed_item, index){
				if (index % 2 === 1) {
					var new_view = new Demo.Views.Feed({
						model: feed_item,
						odd: true}
					);
				} else {
					var new_view = new Demo.Views.Feed({
						model: feed_item,
						odd: false
					});
				}
				$(that.el).append(new_view.el);
		});
		return this;
	}
});


Demo.Views.Feed = Backbone.View.extend({

	events: Demo.Utils.click_or_tap({
		".feed-even": "expand_item",
		".feed-odd" : "expand_item"
	}),
	
	expand_item: function () {
		Demo.router.navigate("item/" + this.model.cid.split("").slice(1), true);
	},
	
	initialize: function() {
		this.render();
	},
	
	render: function() {
		var feed_class = (this.options.odd? "feed-odd" : "feed-even");
		$(this.el).append('<div class="' + feed_class + '">' +
							this.model.get("descricao") +
							"</div>");
		$(this.el).append('<div class="hidden"><img class="pic", src="' + this.model.get("foto_url") + '"></div>');
		return this;
	},
});


Demo.Views.Item = Demo.Views.Page.extend({

	events: Demo.Utils.click_or_tap({
		"#back.feed-even": "go_back",
		"#item.feed-even": "expand_item",
		"#item.feed-odd" : "expand_item"
	}),

	expand_item: function () {
		// Open an external URL in a separate view
		// forge.tabs.open("http://www.multassociais.net/multas/"+this.model.get("id"));
	},

	initialize: function() {
		this.render();
	},

	go_back: function() {
		Demo.router.navigate("", true);
	},
	
	render: function() {
		var placa = this.model.get("placa");
		var placa_line = (placa ? " Placa: " + placa : "");

		$(this.el).append('<div id="back", class="feed-even">Voltar</div>');
		
		$(this.el).append('<div id="pic"><img class="pic", src="' + this.model.get("foto_url") + '"></div>');
		
		$(this.el).append('<li id="item", class="feed-odd">' +
							this.model.get("descricao") +
							'<div class="placa">' +
								placa_line +
							'</div>' +
							'<div class="date">' +
								this.model.get("data_ocorrencia").split(" ").slice(0, -2).join(" ") +
							'</div>' +
						  '</li>');

		return this;
	}
});
