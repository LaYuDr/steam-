// ==UserScript==
// @name         HMMC - How Much Money Do I Cost On Steam
// @namespace    https://akakanch.com/hmmc/
// @version      0.4
// @description  just buy games,steam sales are great deals. why this script?
// @author       Kanch
// @match        https://store.steampowered.com/account/history/
// @grant        none
// @name:zh-CN   HMMC - 我在Steam上花了多少钱了
// @description:zh-cn 本脚本可以帮助你计算你在Steam上的总花费
// ==/UserScript==

(function() {
    'use strict';
function hmmc(){

	//currency exchange
	var CUR = ['¥','HK$','$','€','£','₽','CDN$','₩','₹'];
	var CUR_RMB = [1.0,0.8136,6.3,7.7,8.8,0.1,5,0.0059,0.08521];

	//box to show info
	var loading = `<div class="home_area_spotlight" style="height:80px;width:100%;display:inline-block;">
				   <div class="spotlight_content" style="width:100%;text-align:center;">
					  <h2>Loading the costs in </h2>
					  <div class="spotlight_body">RMB </div>
					  <div class="spotlight_body spotlight_price price">
						 <div class="discount_block discount_block_spotlight discount_block_large">
							<div class="discount_pct" id="spent_money">wait few seconds...</div>
						 </div>
					  </div>
				   </div>
				   <div class="ds_options">
					  <div></div>
				   </div>
				</div>`;

	var donestr = `<div class="home_area_spotlight" style="height:80px;width:100%;display:inline-block;">
				   <div class="spotlight_content" style="width:100%;text-align:center;">
					  <h2>You have spent</h2>
					  <div class="spotlight_body">RMB </div>
					  <div class="spotlight_body spotlight_price price">
						 <div class="discount_block discount_block_spotlight discount_block_large">
							<div class="discount_pct" id="spent_money">@SPENT@</div>
						 </div>
					  </div>
				   </div>
				   <div class="ds_options">
					  <div></div>
				   </div>
				</div>`;
	// target div before our box
	var ppt = document.querySelector(".account_management");
	ppt.insertAdjacentHTML("afterend", loading);

	//load all wallet transactions

	console.log("Loading all transactions....");
	WalletHistory_LoadMore();

	console.log("done.\r\nWaiting for 8 seconds...");
	 setTimeout(function() {
		//extract all transactions
		var costRM = [];
		var cc = document.getElementsByClassName('wht_wallet_change');
		var change = document.getElementsByClassName('wht_total');
		var balance = document.getElementsByClassName('wht_wallet_balance');
        var wht_type  = document.getElementsByClassName('wht_type');
        var sumMoney = 0;
		for (var i = 1; i < cc.length; i++) {
			if(change[i].textContent.length >1){
				//check if it is expenditure
				if((cc[i].textContent.length > 3 && cc[i].textContent[0]=='-') || (cc[i].textContent.length < 2 && balance[i].textContent.length < 2)){
                    if(change[i].className.indexOf("wht_refunded")!=-1) continue;
                    if(wht_type[i].textContent.indexOf("退款")!=-1) continue;
					var vv =  change[i].textContent.replace(/[^\-+.0-9]/g,'');
					var oly = change[i].textContent.replace(/[^\-+.0-9฿USDTL₵¢₹₡B₫NT€ƒ₲Kč₭£₤₥₦₱₨₽$₮₩¥₴₪֏¥HK$CND$pуб.]/g,'');
                    if(change[i].textContent.indexOf('ARS$')!=-1){
                        var str = change[i].textContent.replace(/,/g, ".");
                        str = str.replace(/[^\-+.0-9]/g,'');
						vv = 0.05971*parseFloat(str);
					}else if(change[i].textContent.indexOf('pуб.')!=-1){
                        var str = change[i].textContent.replace(/,/g, ".");
                        str = str.replace(/[^\-+.0-9]/g,'');
						vv = 0.08457*parseFloat(str.replace(",","."));
					}else if(oly.indexOf('HK$')!=-1){
						vv = CUR_RMB[CUR.indexOf('HK$')]*parseFloat(vv);
					}else if(oly.indexOf('฿')!=-1){
						vv =0.1973*parseFloat(vv);
					}else if(oly.indexOf('USD')!=-1){
						vv =6.3337*parseFloat(vv);
					}else if(oly.indexOf('TL')!=-1){
						vv =0.4685*parseFloat(vv);
					}else if(oly.indexOf('₫')!=-1){
						vv =0.0002780*parseFloat(vv);
					}else if(oly.indexOf('NT')!=-1){
                        var str = change[i].textContent.replace(/,/g, ".");
                        str = str.replace(/[^\-+.0-9]/g,'');
						vv =0.2273*parseFloat(vv);0.2273
					}else if(oly.indexOf('CDN$')!=-1){
						vv = CUR_RMB[CUR.indexOf('CDN$')]*parseFloat(vv);
					}else{
						vv = CUR_RMB[CUR.indexOf(oly[0])]*parseFloat(vv);
					}
					if(!parseFloat(vv)){
						console.log('NAN')
					}
                    sumMoney+=parseFloat(vv);
					//convert currency to RMB
                    console.log("金额:",change[i].textContent,"转RMB:",parseFloat(vv),"总:",sumMoney);
					costRM.push( parseFloat(vv) );
				}
			}
		}

		// compute all cost
		var X = costRM.reduce(function(a, b) { return a + b; }, 0);
		console.log('done.\r\n-\r\n-\r\nYou have cost ¥ ' + Number((X).toFixed(2)) + ' RMB on Steam so far.\r\n-\r\n-\r\n');
		document.querySelector(".home_area_spotlight").remove();
		ppt.insertAdjacentHTML("afterend", donestr.replace("@SPENT@",Number((X).toFixed(2))));
	 },8888);
}
    hmmc();
})();
