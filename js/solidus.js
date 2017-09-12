function decodeStats(response) {
    if (response == null) return null;

    var result = response.result;
    if (result == null || result.length == null || result.length < 193) return null;

    var weiPerEther = new BigNumber("1000000000000000000", 10);
    var totalContributionExact = new BigNumber(result.substr(2, 64), 16).div(weiPerEther);

    return {
        totalContribution: totalContributionExact.round(3, BigNumber.ROUND_DOWN),
        totalSupply: new BigNumber(result.substr(66, 64), 16).div(weiPerEther).round(3, BigNumber.ROUND_DOWN),
        totalBalancingTokens: new BigNumber(result.substr(130, 64), 16).div(weiPerEther).round(3, BigNumber.ROUND_DOWN),
        tokenMultiplier: new BigNumber(result.substr(194, 64), 16).round(3, BigNumber.ROUND_DOWN),
        purchasingAllowed: new BigNumber(result.substr(258, 64), 16).isZero() == false
    };
}

function getStats() {
    var url =  "https://api.etherscan.io/api?module=proxy&action=eth_call&to=0xdcf533abdbae655e8fd438a9435733dbd9068b89&data=0xc59d48470000000000000000000000000000000000000000000000000000000000000000&tag=latest";
    return $.ajax(url, {
        cache: false,
        dataType: "json"
    }).then(function (data) { return decodeStats(data); });
}

function updatePage(stats) {
    if (stats == null) return;

    $("#total-ether").text(stats.totalContribution.toFixed(1));
    $("#total-tokens").text(stats.totalSupply.toFixed(1));
    $("#total-balancing-tokens").text(stats.totalBalancingTokens.toFixed(1));
    $("#token-multiplier").text(stats.tokenMultiplier);
}

function refresh() { getStats().then(updatePage); }

$(function() {
    try {
        refresh();
        setInterval(refresh, 1000 * 60 * 5);
    } catch (err) { }
});

// Scroll 

   $(function() {
	  $('a[href*=#]:not([href=#])').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {

	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html,body').animate({
	          scrollTop: target.offset().top
	        }, 1000);
	        return false;
	      }
	    }
	  });
	});

// Tabs

$(function(){
 $('.btn-circle').on('click',function(){
   $('.btn-circle.btn-info').removeClass('btn-info').addClass('btn-default');
   $(this).addClass('btn-info').removeClass('btn-default').blur();
 });

 $('.next-step, .prev-step').on('click', function (e){
   var $activeTab = $('.tab-pane.active');

   $('.btn-circle.btn-info').removeClass('btn-info').addClass('btn-default');

   if ( $(e.target).hasClass('next-step') )
   {
      var nextTab = $activeTab.next('.tab-pane').attr('id');
      $('[href="#'+ nextTab +'"]').addClass('btn-info').removeClass('btn-default');
      $('[href="#'+ nextTab +'"]').tab('show');
   }
   else
   {
      var prevTab = $activeTab.prev('.tab-pane').attr('id');
      $('[href="#'+ prevTab +'"]').addClass('btn-info').removeClass('btn-default');
      $('[href="#'+ prevTab +'"]').tab('show');
   }
 });
});

// copy to clipboard

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}
