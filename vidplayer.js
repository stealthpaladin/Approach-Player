var ApproachDebugMode=true;


function debug(reason, loggable)
{
   console.log(reason);
   console.log(loggable);
}
function classSplit(incoming){return incoming.className.split(/\s+/); }
/*function keyPress()
{
window.keypress(function(event)
{
  switch(event.which)
  {
     case 13: alert(' 1');break; //carriage return
     case 27: alert(' 2');break; //escape
     default: break;
  }


});

}*/
var topChange=0, fullscreenModeActive = false, html5=true,controlsHidden = false,hideControls= false,AnimatingControls = false;
var ActiveTimeStream=0, ActiveFadePhase=0, FadeTimer=1, projectorClass='up';


	var BarWidth;
	var SeekerMargin;
	var SeekerMaxWidth;


CueObject=function()
{
	this.Component =
	{
		type: 'Post',                 //What sort of Component class you want to use
		instance: 0     //and an ID of a dynamic component instance. (There is table, web service and AJAX for this
	};
        this.Placement = ["projector"]; //set what type of cue event will happen. choices: overlay,projector,companion
	this.Cue =
	{
		start:  0.10,            //Relative Time Sequence Float
		end: 0.00,               //Likewise
		persist: true,              //Should the video
		onstart: 'func',              //the start time also become a cue so we may as well be fancy.
		onfinish: 'func'              //the end time also become a cue so we may as well be fancy.
	};



	this.id=0 ;    //the CueObject id
	this.triggered=false;   //true once it's component fires off
	return this;
}



var Needle=function()
   {
		var $elf=this;
		$elf.call={
			debug:function(ObjectOrProperty, reason)
			{
				if(typeof reason != 'undefined') console.log(reason);
				if(ApproachDebugMode) console.log(ObjectOrProperty);
			},
			ready:function()
			{
				$elf.ready=true;
				if($elf.waiting)
				{
				   $elf.call.setup();

				}
			},
			init:function(Player)
			{
			  html5=true;
			  $elf.ready = html5;    //not ready if flash
			  $elf.Player=Player;
			  $elf.Video = $elf.Player.getElementsByClassName('video')[0];
			  $elf.volume = $elf.Video.volume;     // maybe should = 1;

			  if(html5)
			  {
				browserPrefixes='webkit moz o ms'.split(' ');

				for (var i = 0, il = browserPrefixes.length; i < il; i++ )
				{
				    $elf.browser = browserPrefixes[i];
				    if (typeof document[$elf.browser + 'CancelFullScreen' ] != 'undefined' )  break;
				}

				$elf.fullScreenEventName = $elf.browser + 'fullscreenchange';
			    	switch (this.browser)
			    	{
				    case '': $elf.isFullScreen=document.fullScreen;
				    case 'webkit': $elf.isFullScreen=document.webkitIsFullScreen;
				    default: $elf.isFullScreen=document[$elf.browser + 'FullScreen'];
				}
				$elf.requestFullScreen = function(el)
				{
				    //alert(el[this.fullScreenApi.prefix+'RequestFullScreen']);
				    $elf.requestFullScreen=($elf.browser === '') ? el.requestFullScreen() : el[$elf.browser + 'RequestFullScreen']();
				}
				$elf.cancelFullScreen = function(el)
				{
					$elf.cancelFullScreen=($elf.browser === '') ? document.cancelFullScreen() : document[$elf.browser + 'CancelFullScreen']();
				}
                                $($elf.Player).bind($elf.fullScreenEvent,function(e){ PlayerEvents(e); });
			  }
			  else $elf.call.fullscreen = $elf.call.fullscreen_flash;

			  $elf.Controls = $elf.Player.getElementsByClassName('controls')[0];

			  if(!$elf.ready)		$elf.waiting=true;
			  else				$elf.call.setup();

			},
                        saveCssStates:function() //saves the default css for animatables such as projector or anything else that needs to animate
                        {
                           var animatables = $('.Player .animatable');
                           for(var i=0,L=animatables.length;i<L;i++)
                           {
                               $elf.call.debug(animatables[0]);

                              //  for(var ii=0;i<5;ii++)
                                //{

                                //}
                           }
                        },
			setup:function()
			{
				$($elf.Controls).find('li').each(function(i,obj)  //binding needle control buttons to .control li's
				{
				   var classes = classSplit(obj);
				   $.each(classes, function(i,_class)
				   {
					    switch(_class)
					    {
					    case 'play': $elf.Buttons.play = obj; break;
					    case 'pause': $elf.Buttons.pause = obj; break;
					    case 'stop': $elf.Buttons.stop = obj; break;
					    case 'fullscreen': $elf.Buttons.fullscreen = obj; break;
					    case 'volume': $elf.Buttons.volume = obj; $elf.Buttons.volumeDragger = obj.getElementsByClassName('volumeDragger')[0]; break;
					    case 'social': $elf.Buttons.social = obj; break;
					    case 'track': $elf.Buttons.track = obj; break;
					    case 'seek': $elf.Buttons.seek = obj;  break;
					    case 'projector': $elf.Buttons.projector = obj; $elf.Buttons.topBar = obj.getElementsByClassName('topBar')[0]; break;
					    default: break;
					    }
				   });

				    ActiveFadePhase=setInterval(function()
				    {
				       FadeTimer +=250;
				       if(FadeTimer%60001 == 0)
				       {
					  AnimatingControls = true;
					  $($.ActiveNeedle.Controls).fadeTo(1600,0, function(){AnimatingControls=false;controlsHidden=true;} );
				       }
				    },250);
				return $elf;
				});
			},
			get:function(){ return this.currentTime; },
			seek: function(e)
			{
				if(typeof e == 'undefined')
				{
					$elf.currentTime = $elf.Video.currentTime;
					$elf.currentPosition = SeekerMaxWidth*($elf.Video.currentTime / $elf.Video.duration) + 'px';
					$elf.Buttons.seek.style.width = $elf.currentPosition;
				}
				else
				{      // $elf.call.rewind(e);
					$.ActiveNeedle.Video.currentTime = ((e.pageX-$('.seek').offset().left)/SeekerMaxWidth) * $.ActiveNeedle.duration;
					$elf.currentTime = $.ActiveNeedle.Video.currentTime;
					$elf.call.discover();
				}
			},
			forward:function(e)
			{
				for(all in $elf.layers)
				{
					$elf.layers[all] = -1;
				}
				$.ActiveNeedle.Video.currentTime = ((e.pageX-$('.seek').offset().left)/SeekerMaxWidth) * $.ActiveNeedle.duration;
				$elf.currentTime = $.ActiveNeedle.Video.currentTime;
				$elf.call.discover();
			},
			rewind:function(e)
			{
				for(all in $elf.layers)
				{
					$elf.layers[all] = -1;
				}
				$.ActiveNeedle.Video.currentTime = ((e.pageX-$('.seek').offset().left)/SeekerMaxWidth) * $.ActiveNeedle.duration;
				$elf.currentTime = $.ActiveNeedle.Video.currentTime;
				$elf.call.discover();
			},
			discover:function()
			{

				var currentTimeF = ($elf.currentTime)/(($elf.duration));

				$elf.call.debug('$elf.currentTime \t\t\t\t->'+$elf.currentTime);
				$elf.call.debug('$elf.duration \t\t\t\t\t->'+$elf.duration);
				$elf.call.debug('Time Ratio \t\t\t\t\t\t->'+$elf.currentTime/$elf.duration);
				for(var i=0;i<$elf.CueList.length;i++)
				{
					if($elf.CueList[i].Cue.start * ($elf.duration *1000) >= $elf.currentTime*1000 )
					{
						$elf.call.debug('Found Next Cue:' + i);
						$elf.CueNext = i;
						break;

					}
				}

				for(var i=$elf.CueNext; i>0;i--)
				{
					$.each($elf.layers,function(placement, index)
					{
						alert(placement);
						if(placement != 0 && placement !='0' && placement != '\0' && placement != null)
						if($elf.CueList[i].Cue.end > $elf.currentTime){
						if($elf.layers[placement]==-1){
						if($.inArray(placement, $elf.CueList[i].Placement) > -1){

						$elf.layers[placement]=i;
						}}}
					});
				}

				/*	var timeToOut=($elf.CueList[$elf.CueNext].Cue.start*($elf.duration*1000.0))-($elf.Video.currentTime+0.0099);

					setTimeout(function(){$($elf.Player).trigger('CueEvent');}, timeToOut);
				*/


				if($elf.CueNext < $elf.CueList.length)
				{
					if(ApproachDebugMode)
					{
						$elf.call.debug('discover() is setting up Cue '+$elf.CueNext+': ');
						$elf.call.debug('Variables Breakdown: ');
						$elf.call.debug(	'$elf.CueList[$elf.CueNext].Cue.start \t\t->'		+$elf.CueList[$elf.CueNext].Cue.start +
									'\n$elf.currentTime \t\t\t\t\t\t\t->'			+$elf.currentTime+
									'\n$elf.duration \t\t\t\t\t\t\t\t->'				+$elf.duration+
									'\n$elf.CueNext \t\t\t\t\t\t\t\t->'				+$elf.CueNext
						);
						$elf.call.debug('-----------');
					}
					var TimeUntilCuePoint = 0;
					if($elf.CueList[$elf.CueNext] != null)
					{	//current time in seconds.html5 video duration also in seconds, not mili
						if($elf.currentTime.toFixed(10)  <= $elf.CueList[$elf.CueNext].Cue.start.toFixed(10)*$elf.duration.toFixed(10) )
						{
							TimeUntilCuePoint =  1000*($elf.CueList[$elf.CueNext].Cue.start.toFixed(10) * $elf.duration.toFixed(10) - $elf.currentTime.toFixed(10));
							TimeUntilCuePoint = Math.ceil(TimeUntilCuePoint) +500;
							setTimeout( function(){ $($elf.Video).trigger('CueEvent') ;  }, TimeUntilCuePoint);
						}
					}
				}
			},
			play:function()
			{
			    $elf.Video.play();
			    ActiveTimeStream=setInterval(function(){WhilePlaying(); },250);
			    $elf.playing = true;
			    $elf.currentTime = $elf.Video.currentTime;
			    $elf.duration = $elf.Video.duration;
			    $elf.call.seek();
			    setTimeout($elf.call.discover(), 10);
			},
			pause:function()
			{
				$elf.Video.pause();
				clearInterval(ActiveTimeStream);
				$elf.active = false;
			},
			next:function() {},
			fullscreen_flash:function()
			{
				 var fullscreen_window=window.open('http://debug.mydamnchannel.com/videofullscreenflash.html');
				 $(fullscreen_window).bind('ready',function(){alert('wth');});
				//$(fullscreen_window).html($elf.Video);
			},
			fullscreen: function(e)
			{
                                     if(!$elf.isFullScreen)
				     {
	                                     $elf.requestFullScreen(e.target);
                                             $($elf.Player).addClass('PlayerFullScreen');
                                     }
  				     else
                                     {
                                        $elf.cancelFullScreen(e.target);
				    	$($elf.Player).removeClass('PlayerFullScreen');
                                     }
                                   /*this.fullScreenApi= {
				     supportsFullScreen: false,
				     isFullScreen: function() { return false },
				     requestFullScreen: function() {},
				     cancelFullScreen: function() {},
				     fullScreenEventName: '-',
				     prefix: ''*/
				/*if($elf.fullscreen==-1)
				{
					var prevPlayerHeight = $($elf.Video).height();
					$elf.Player.style.position='fixed';
					$elf.Player.style.height='100%';
					$elf.Player.style.width='100%';
					$elf.Player.style.top='0px';
					$elf.Player.style.left='0px';
					$elf.Video.style.width='100%';
					$elf.Video.style.height='100%';

					fullscreenModeActive=true;
					BarWidth = $('.track').get(0).offsetWidth;
					SeekerMaxWidth = BarWidth - SeekerMargin;
					$.ActiveNeedle.Buttons.projector.style.top = $.ActiveNeedle.Controls.offsetHeight - $.ActiveNeedle.Video.offsetHeight - $.ActiveNeedle.Buttons.projector.offsetHeight + 'px';

				}
				else
				{
					$elf.Buttons.projector.style.marginTop='0px';
					$elf.Player.style.position='absolute';
					$elf.Player.style.height='480px';
					$elf.Player.style.width='720px';
					$elf.Player.style.top='0px';
					$elf.Player.style.left='0px';
					$elf.Video.style.width='720px';
					$elf.Video.style.height='480px';
					fullscreenModeActive=false;
					$.ActiveNeedle.Buttons.projector.style.top = $.ActiveNeedle.Controls.offsetHeight - $.ActiveNeedle.Video.offsetHeight - $.ActiveNeedle.Buttons.projector.offsetHeight + 'px';

				} */ //$elf.Video.requestFullScreen();

				$elf.fullscreen *= -1;
			},
			volume:function(clickX)
			{
				$elf.Buttons.volumeDragger.style.width=clickX-$($elf.Buttons.volume).offset().left + 'px';
				volumecalc=$($elf.Buttons.volumeDragger).width()/$($elf.Buttons.volume).width();

				$elf.Video.volume = 0.125*volumecalc.toFixed(6);
				$elf.volume = $elf.Video.volume;
			},
            cue:function(ActiveCue)
			{
				$elf.call.debug('\n\n-----------Cueing: '+$elf.CueNext+'----------------\n\n');

				$.each(ActiveCue.Placement, function(i, placement)
				{
					$elf.layers[placement]=$elf.CueNext;
                    if(placement == 'advertisement')
                    {

                    }
				});

				$elf.call.debug('Current Layer Status: ');
				$elf.call.debug($elf.layers);

				 /*$($elf.Controls).trigger('mouseenter');
				 setTimeout(function()
				 {
				    $elf.call.pause();
				    if($elf.CueList[$elf.CueNext].Placement)
				    $.each($elf.CueList[$elf.CueNext].Placement, function(i, obj)
				    {
					switch(obj)
					{
					  case 'projector': $($elf.Player).find( '.topBar').trigger('click'); $elf.call.projector(); break;
					  case 'overlay'  : $elf.call.overlay();break;
					  case 'companion': $elf.call.companion();break;
					  case 'advertisement' : break;
					  default: break;
					}

				    });
				 },800);*/

				$elf.CueNext++;
			},
			project:function()
			{
				if($.ActiveNeedle.projectorDown) //animate up
				{
					AnimatingControls=true;
					$($.ActiveNeedle.Buttons.projector).animate({top: $.ActiveNeedle.Controls.offsetHeight-$.ActiveNeedle.Player.offsetHeight - $.ActiveNeedle.Buttons.projector.offsetHeight +7 + 'px' },1200, function(){AnimatingControls=false; FadeTimer=1;});
                                        //$($.ActiveNeedle.Buttons.projector).animate(,);
                                        $.ActiveNeedle.projectorDown = 0;
				}
				else //animate down
				{
					Animatingcontrols=true;
					// $($.ActiveNeedle.Buttons.projector).animate({top: 0-$.ActiveNeedle.Buttons.projector.offsetHeight-$.ActiveNeedle.Controls.offsetHeight + 'px'}, 1200,function(){AnimatingControls=false; FadeTimer=1;});
					$($.ActiveNeedle.Buttons.projector).animate({top:    -($.ActiveNeedle.Buttons.projector.offsetHeight-$.ActiveNeedle.Buttons.topBar.offsetHeight-$.ActiveNeedle.Buttons.seek.offsetHeight)+ 'px'}, 1200,function(){AnimatingControls=false; FadeTimer=1;});
					$.ActiveNeedle.projectorDown = 1;
                                        $elf.call.debug('anim down'+($.ActiveNeedle.Buttons.projector.offsetHeight-$.ActiveNeedle.Controls.offsetHeight).toString());
				}
			},
			projector:function()
			{
				var requested = "Smart37";
				$.ajax({
					type: 'POST',
					dataType: 'json',
					url: 'http://debug.mydamnchannel.com/Approach/Service.php?publish=hexacode&instancename=Post&instancenum=0',
					data:
					{
						'json': '{"request":{"REQUEST":{"tokens":{},"PageID":"Smart18", "Child":"Smart45", "ChildRef":"0"}}}'
					},
					success:function(json, status, xhr)
					{
						// successful request; do something with the data
						$($elf.Buttons.projector).find('.projector_content').empty();
						$.each(json.refresh, function(i,obj)
						{
						    $($elf.Buttons.projector).find('.projector_content').html(obj);
						});
					},
					error:function(e,xhr,settings,exception)
					{
						$($elf.Buttons.projector).find('.projector_content').html('ERROR');
					}
				 });
			},
			overlay:function()
			{
				$($elf.Player).append('<div class="videoOverlay" style="background-color:#000; position:absolute; top:0px; left:0px; z-index:999; display:block; width:100%; height:100%;"></div>');
			},
			companion:function()
			{

			}
        };
		//end $elf.call
   this.Player= {};
   this.Video= {};
   this.Controls= {};
   this.Buttons= {};
   this.Instance= 0;

//Player DataSet
   this.HTML5 = 0;
   this.CueTimeline =0;
   this.CueNext=0;
   this.source='';
   this.active= false;
   this.playing= false;
   this.currentTime=0.00001;
   this.duration=0.00001;
   this.id= 12345;
   this.series='Default Series';
   this.channel='Default Channel';
   this.title='Default Title';
   this.user='Anonymous MyDamnChannel Viewer';
   this.ip='0.0.0.0';
   this.fullscreen=-1;

   this.animatables=[];

   this.layers=[];
   this.layers['overlay']=-1;
   this.layers['projector']=-1;
   this.layers['advertisement']=-1;
   this.layers['companion']=-1;
   this.layers['video']=-1;


   this.CueList=[];

   this.projectorDown=false;

        this.CueList[0] = new CueObject();
        this.CueList[0].Placement=['companion'];
	this.CueList[0].Cue.start = 0.10 ;
	this.CueList[0].Cue.end = 0.90;

	this.CueList[1] = new CueObject();
	this.CueList[1].Placement=['overlay'];
	this.CueList[1].Cue.start= 0.20 ;
	this.CueList[1].Cue.end =0.80 ;

        this.CueList[2] = new CueObject();
	this.CueList[2].Placement=['advertisement'];
	this.CueList[2].Cue.start=0.35;
	this.CueList[2].Cue.end=0.00;

        this.CueList[3] = new CueObject();
	this.CueList[3].Placement=['projector'];
	this.CueList[3].Cue.start=0.50;
	this.CueList[3].Cue.end=0.0;

        this.CueList[4] = new CueObject();
	this.CueList[4].Placement=['advertisement'];
	this.CueList[4].Cue.start=0.85;
	this.CueList[4].Cue.end=0.00;
        //$elf.call.debug(this.CueList);
        this.requestFullScreen=function(){};
        this.isFullScreen=function(){};
	this.cancelFullScreen=function(){};
	this.fullScreenEvent='fullscreenchange';
	this.browser='webkit';

   return this;
};





var $ActiveNeedle = new Needle();
var CueList = [];

function WhilePlaying()
{

	$.ActiveNeedle.call.seek();
	if(!APPROACHHTML5) $.ActiveNeedle.Video.currentTime = $.ActiveNeedle.Video.getPlayheadTime();
       // $.ActiveNeedle.currentTime = formatTime($.ActiveNeedle.Video.currentTime);

	$($.ActiveNeedle.Buttons.topBar).html(formatTime($.ActiveNeedle.currentTime));

}

function formatTime(time)
{
   time = Math.round(time);                //total seconds #1
   //time = (time - (time % 1000))/1000;    //total seconds #2
   var hours, minutes, seconds;

   seconds = time % 60;
   minutes = ((time-seconds)/60)%60;
   hours   = (time-minutes*60-seconds)/60;

   if(seconds<10) seconds = '0'+seconds;
   if(minutes<10) minutes ='0'+minutes;
   var result = minutes + ":"+seconds;
   (hours > 0) ? result = hours+result : '';
   return result;
}
function PlayerEvents(e)
{
    var classlist = e.target.className.split(/\s+/), c=0, L=0;

    if(e.type == 'click')
    {
        switch(classlist[0])
           {
          case "play" :		$.ActiveNeedle.call.play(); break;
          case "pause":		$.ActiveNeedle.call.pause(); break;
          case "stop":		$($.ActiveNeedle.Buttons.projector).trigger('CueEvent');  break;
          case "fullscreen":	$($.ActiveNeedle.Player).trigger($.ActiveNeedle.fullScreenEvent); break;
          case "seek":		$.ActiveNeedle.call.seek(e); break; //seek
          case "track":		$.ActiveNeedle.Video.currentTime = ((e.pageX-$('.seek').offset().left)/SeekerMaxWidth) *  $.ActiveNeedle.duration; break;
          case "volume":
          case "volumeDragger": $.ActiveNeedle.call.volume(e.pageX);break;
	  case "topBar":        $.ActiveNeedle.call.project(); break;
          default:				break;
            }
    }
    else if (e.type =='CueEvent')
    {
	$.ActiveNeedle.call.cue( $.ActiveNeedle.CueList[$.ActiveNeedle.CueNext] );
	$.ActiveNeedle.call.discover();

    }
    else if(e.type == $.ActiveNeedle.fullScreenEvent)
    {  alert('ff');
        $.ActiveNeedle.call.fullscreen(e);
    }


	if(e.type == 'mouseover' || e.type == 'mouseenter' || e.type=='mouseleave')
	{
		if(controlsHidden && !AnimatingControls)
		{
			AnimatingControls = true;
			$($.ActiveNeedle.Controls).fadeTo(1600,1, function(){AnimatingControls=false; controlsHidden=false;} );
		}
		FadeTimer =1;
	}
}
$(document).ready(
    function()
    {
		//remove proper player and insert one.

        $(window).bind('keydown', function(event) {
        switch (event.keyCode) {
          case 13: // Left
            alert('1');
          break;

          case 27: // Up
               alert('2');
          break;
          case 32: alert(3); break;

          default: break;
        }
      }, false);

        BarWidth = $('.track').get(0).offsetWidth;
        SeekerMargin = 20;
        SeekerMaxWidth = BarWidth - SeekerMargin;

        $('.Player').bind('click CueEvent', function(event){ PlayerEvents(event);} );
        $('.Player .controls').bind('mouseenter mouseleave mouseover', function(event){ PlayerEvents(event); });

        $('.Player').each(function(instance, Player)
        {
            Player.Needle=new Needle();
            Player.Needle.call.init(Player);    //Reference to it's container div
	});

        topChange=$('.controls .projector').get(0).style.top;


    $.ActiveNeedle =  $('.Player')[0].Needle;
    html5=APPROACHHTML5;
    }
);
