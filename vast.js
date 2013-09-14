var VastObject=function()
{
	this.Id=0.0,
	this.AdSystem='Google IMA';
	this.AdTitle='Default Advertisement';
        this.Impression={'id':0.0,'link':'http://tracking.approachfoundation.org/track.gif?json=[{"key"="val"},{"key"="val"}]'};
	this.Creatives=[];
	this.Tracking=[];

	return this;
};
var VastLink = 'http://ad.doubleclick.net/pfadx/N270.132652.1516607168321/B3442378.3;dcadv=1379578;sz=0x0;ord=79879;dcmt=text/xml';	
var VastAd = new VastObject();
var VastDoc = '';

var CallVast=function(data)
{
	VastDoc=$(data);
	VastAd = new VastObject();
	VastAd.Id = $(VastDoc).find('Ad').attr('id');
	VastAd.AdSystem = $(VastDoc).find('AdSystem').text();
	VastAd.AdTitle = $(VastDoc).find('AdTitle').text();
	VastAd.Impression.id = $(VastDoc).find('Impression').attr('id');
	VastAd.Impression.link = $(VastDoc).find('Impression').text();
	$(VastDoc).find('Creative').each( function(index, AdCreativeTag)
	{
		AdCreative = { 'AdID':0,'Duration':0,'Tracking':[],'MediaFiles':[] };
		AdCreative.AdID = $(AdCreativeTag).attr('AdID');
		AdCreative.Duration = $(AdCreativeTag).find('Duration').text() ;
		timeHMS=AdCreative.Duration.split(':');
		AdCreative.Duration = parseInt(timeHMS[0])*60*60+parseInt(timeHMS[1])*60+parseInt(timeHMS[2]);

		$(AdCreativeTag).find('Tracking').each(function(index2, TagCursor)
		{
			AdCreative.Tracking[$(TagCursor).attr('event')]= $(TagCursor).text();
		});
		MediaFiles = $(AdCreativeTag).find('MediaFiles');
		$(AdCreativeTag).find('MediaFile').each(function(index2, TagCursor)
		{
			AdCreative.MediaFiles.push( $(TagCursor).text() );
		});

		if($(AdCreativeTag).find('Linear').size === 0 && $(AdCreativeTag).find('NonLinear').size() > 0)	AdCreative.Type = 'NonLinear';
		else	AdCreative.Type = 'Linear';
		VastAd.Creatives.push(AdCreative);
	});

	console.log(VastAd);
};




$.get(VastLink, function(d){ 	CallVast(d);} , 'xml');


