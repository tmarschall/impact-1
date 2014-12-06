(function(){
	var charities = [];
	var jqXHR = $.getJSON('/impact/json/charities.json', function( data ) {
		charities = data.charities;

		$('#amount').val("100");
		var charity = getCharityById(charities, 'sci');
		updateCharity(charity);
		updateImpacts(charity, 100);
	})
	.fail(function(data, textStatus, error) {
		console.error("Could not load charities.json, status: " + textStatus + ", error: " + error);
  	});


	var getCharityById = function(charities, id) {
		for (var i = 0; i<charities.length; i++) {
			if (charities[i].id == id) return charities[i];
		}
		return charities[0];
	};

	var calculateImpacts = function(charity, donation) {
		var impacts = [];
		var overheadMultiplier = 1.0 - charity.overhead;
		var usableDonation = overheadMultiplier*donation;
		for (i = 0; i < charity.pricePoints.length; i++) {
			pp = charity.pricePoints[i];
			if (usableDonation >= pp.price) {
				impacts.push({
					number: Math.floor(usableDonation/pp.price),
					action: pp.action,
					item: pp.item,
					iconURL: pp.iconURL,
					color: pp.color
				});
			}
		}
		return impacts;
	};

	var updateImpacts = function(charity, donation) {
		var impacts = calculateImpacts(charity, donation);
		var n = impacts.length;
		if (n == 0) {
			impacts = [{
				number: 0,
				action: charity.pricePoints[0].action,
				item: charity.pricePoints[0].item,
				iconURL: charity.pricePoints[0].iconURL,
				color: charity.pricePoints[0].color
			}];
			n = 1;
		}
		for (var j=0; j<n; j++) {
			var resultId = "#result"+String(j+1);
			$(resultId).removeClass('result-green result-red result-blue').addClass('result-'+impacts[j].color);
			$(resultId+" div.number span").html(String(impacts[j].number).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
			$(resultId+" div.thing span").html(impacts[j].action);
			$(resultId+" p.info").html(impacts[j].item);
			$(resultId+" img.icon").attr('src', impacts[j].iconURL);
			$(resultId).show();
		}
		for (var j=n; j<6; j++) {
			var resultId = "#result"+String(j+1);
			$(resultId).hide();
		}
	};

	var updateCharity = function(charity) {
		$('#donate span').html(charity.name);
		$('#learnmore span').html(charity.name);
		$('#organisation p').html(charity.organization);
		$('#numbers p').html(charity.numbers);
		$('#recommendation p').html(charity.recommendation);
	};

	$('input:radio[name=charity]').change( function() {
		var charity = getCharityById(charities, this.id);
		var donation = parseFloat($('#amount').val()) || 0;

		updateCharity(charity);
		updateImpacts(charity, donation);
		$(document).trigger('contentChange');
	});

	$('#amount').on("change input", function() {
		var charId = $('input:radio[name=charity]:checked')[0].id;
		var charity = getCharityById(charities, charId);
		var donation = parseFloat($('#amount').val()) || 0;

		updateImpacts(charity, donation);
		$(document).trigger('contentChange');
	});

	$('#amount').keypress( function(e) {
		if (e.which == 13) {
			e.preventDefault();
			var charId = $('input:radio[name=charity]:checked')[0].id;
			var charity = getCharityById(charities, charId);
			var donation = parseFloat($('#amount').val()) || 0;

			updateImpacts(charity, donation);
			$(document).trigger('contentChange');
		}
	});

}());