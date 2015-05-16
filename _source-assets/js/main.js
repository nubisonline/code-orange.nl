$(function(){
	'use strict';

	//Move grey paragraph below cover photo
	/*(function(){
		var currentTop = $("#cover > h3").first().offset().top;
		var shouldTop = (800/1440) * screen.width;
		if(shouldTop > currentTop){
			$("#cover > h3").first().css("margin-top", shouldTop - currentTop);
		}
	}());*/
	
	$(".company").click(function(){
		var url;
		if($(this).data("url") != undefined){
			url = $(this).data("url");
		}else{
			url = "http://" + $(this).attr('src').split("/").pop().split(".")[0] + ".nl";
		}
		window.open(url);
	});
	
	$("form").submit(function(){
		var formdata = {
			naam: $(this).find("[name=naam]").val(),
			email: $(this).find("[name=email]").val(),
			vraag: $(this).find("[name=bericht]").val()
		};
		
		$.ajax({
			type: "POST",
			url: "/services/contact_email.php",
			data: formdata,
			success: function(){
				$("form").find("input").val("");
				$("form").find("textarea").val("Je vraag is ingestuurd");
				
				var ga_data = {
					page: "/contact-thanks/",
					title: "Contact ingezonden"
				};
				
				ga('send', 'pageview', ga_data);
			}
		});
		
		return false;
	});
	
	$("form img").click(function(){
		$("form").submit();
	});
	
	$("#drop-down").on('click', function(){
                $('#drop-down img').css("visibility","hidden");
		$("#mega-menu").slideDown('fast', function(){
			$("#close").css("top", (-1 * $(".menuitem").first().offset().top) + 5);
		});
	});
	
	$("#menuCloseButton").on('click', function(){
               $('#drop-down img').removeAttr("style");
		$("#mega-menu").slideUp('fast');
	});
	
	$("#mega-menu li a").on('click', function(){
		$('#drop-down img').removeAttr("style");
                var href = $(this).attr('href');
		if(href.charAt(0) == "#"){
			$("#mega-menu").slideUp('fast');
			$.scrollTo($(href), 800);
			return false;
		}
	});
	// centers the last row of the team-member section
        function redraw_team_row(){
            if($( window ).width() >= 992){
		var total_members = $('#team-members').children().length;
		var members_left = total_members%5;
		var section_width = $("#team-members").width();
		var space_left = ((5-members_left)*0.2*section_width)/2;
		var select_element = total_members-(members_left-1);
		$("#team-members div:nth-child("+select_element+")").css("margin-left", space_left);  
            }else{
                    $('#team-members').children().css("margin-left","0");
            }
        }
        redraw_team_row();
        
        $("#expertise-list li").on("click",function(){
            $("#expertise-list li.current-item").removeClass("current-item") 
            $(this).addClass("current-item");
            var text_id = $(this).data("text");
            $('.current-text').removeClass("current-text");
            $("#"+text_id).addClass("current-text") 
            
        });

	function redraw_managers_section(){

		//Import the size of the image and the size of the section
		var img = { width: $("section#community-managers").data('imgWidth'),
					height: $("section#community-managers").data('imgHeight') };

		var section = {  inner_width: parseFloat($("section#community-managers").css('width')),
						inner_height: parseFloat($("section#community-managers").css('height')),
						       pad_x: parseFloat($("section#community-managers").css('padding-left')),					
							   pad_y: parseFloat($("section#community-managers").css('padding-top')) };

		//compute and store the real width of the section
		section.width  = section.inner_width  + 2 * section.pad_x;
		section.height = section.inner_height + 2 * section.pad_y;

		//calculate the behaviour of the background which is set to cover mode
		if ( section.width/section.height < img.width/img.height ){
			//scale vertical
			var scale = section.height/img.height;
			//crop horizontal
			var crop = {x: (scale * img.width - section.width), y:0};
		}else{
			//scale horizontal
			var scale = section.width/img.width;
			//crop vertical

			var crop = {x:0, y: (scale * img.height - section.height) };

		}

		//convert crop in px to a marginal crop
		crop.x = scale*img.width  / (scale*img.width -crop.x);
		crop.y = scale*img.height / (scale*img.height-crop.y);
		
		//pass calculations to redraw circles
		$(".employee_circle").each(function(index){
				redraw_employee_circle('#' + $(this).attr('id'),section,crop,scale);
		});

	}



	//initialise:

	//get background image size and store
	var img = new Image;
	img.src = $("section#community-managers").css('background-image').match(/url\(([^)]+)\)/i)[1];
	img.onload =function(){
		//store bg image size
		$("section#community-managers").data('imgWidth',this.width);
		$("section#community-managers").data('imgHeight',this.height);


		redraw_managers_section();

	};
	



	function redraw_employee_circle(circle_id,section,crop,scale){


		// Resize the circles with the rescaling of the image
		if (scale){
			var r=68*scale;
			var border = parseFloat( $(circle_id + " circle").attr('stroke-width') );
			var size = 2*r + border;
			$(circle_id + " circle").attr({r:r,cx:size/2,cy:size/2});
			$(circle_id).attr({width:size,height:size})
		};

		//import circle specs
		var circle = { width : parseFloat($(circle_id).css('width')),
					   height: parseFloat($(circle_id).css('height')),  
					        x: parseFloat($(circle_id).data('posx')),
					        y: parseFloat($(circle_id).data('posy')) };

		//convert coordinates from the full image to cropped image (the section)
		circle.x = circle.x * crop.x;
		circle.y = circle.y * crop.y;

		//convert coordinates from our scale of [100,-100] to actual pixels in x,y from the center
		circle.x = circle.x/100 * section.width/2;
		circle.y = circle.y/100 * section.height/2;

		//correct for the image centre
		circle.left = circle.x + section.width/2;
		circle.top  = circle.y + section.height/2;
		
		//correct for the position of the containing div (.circles)
		//circle.top  = circle.top  - section.pad_y;
		circle.left = circle.left - section.pad_x;

		//center the circle around its coordinates
		circle.top  = circle.top  - circle.width/2;
		circle.left = circle.left - circle.height/2;

		//export positions
		$(circle_id).css({'top': circle.top,'left': circle.left});		


		/*TODO:
			- Scrollen
			- Menu icon met animatie veranderen in kruisje
			- Prijzen mobiel
			- Contact: formulier links +wat nubis nog meer doet, adres gegevens rechts (niet bij mobile)

		*/
		
	};



	$( window ).resize(function(){redraw_managers_section; redraw_team_row();});

	
	$(".hexagon").on('mouseenter', function(){
		$(".employee_circle").hide();
		$("#circle_" + $(this).data('name')).fadeIn('fast');
	});

	$(".hexagon").on('mouseleave', function(){
		$("#circle_" + $(this).data('name')).fadeOut('fast');
	});
        
        
        
        
        $.getJSON("/assets/res/casescodeorange.json", function(cases){
		var i = 0;
                $("#home >section#cases #case-info #case-photo img").attr("src","/assets/img/cases/cases_code_orange/"+ cases[i].cover+ "" );
		$("#home >section#cases #case-info #case-text h4").text(cases[i].name);
		$("#home >section#cases #case-info #case-text p").text(cases[i].description);
		$("#home > section#cases #case-row .case").each(function(){
			var _case = cases[i];
			
			$(this).css("background-image", "url(/assets/img/cases/cases_code_orange/" + _case.cover + ")");
			$(this).find("p.title").text(_case.name);
			$(this).find("p:nth-child(2)").text(_case.type);
			$(this).click(function(){
				$("#home >section#cases #case-info #case-photo img").attr("src","/assets/img/cases/cases_code_orange/"+ _case.cover+ "" );
				$("#home >section#cases #case-info #case-text h4").text(_case.name);
				$("#home >section#cases #case-info #case-text p").text(_case.description);
			}); 
			i++;
		});
	});



});


