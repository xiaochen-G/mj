function hgLoad(k){try{var s=localStorage.getItem(k);return s?JSON.parse(s):[];}catch(e){return[];}}
function hgSave(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function hgFavs(){return hgLoad('hg_favs');}
function hgFavHas(id){var a=hgFavs();for(var i=0;i<a.length;i++){if(String(a[i].id)===String(id))return true;}return false;}
function hgFavToggle(it){var a=hgFavs(),out=[],found=false;for(var i=0;i<a.length;i++){if(String(a[i].id)===String(it.id)){found=true;}else{out.push(a[i]);}}if(!found){out.unshift(it);}hgSave('hg_favs',out);return !found;}
function hgHistGet(id){var a=hgLoad('hg_hist');for(var i=0;i<a.length;i++){if(String(a[i].id)===String(id))return a[i];}return null;}
function hgHistPut(it){it.t=Date.now();var a=hgLoad('hg_hist'),out=[it];for(var i=0;i<a.length;i++){if(String(a[i].id)!==String(it.id)){out.push(a[i]);}}if(out.length>100){out.length=100;}hgSave('hg_hist',out);}
function hgImg(pic){return pic||'';}
function hgWireFav(b){
  if(!b)return;
  var id=b.getAttribute('data-id');
  function item(){return {id:id,name:b.getAttribute('data-name'),pic:b.getAttribute('data-pic'),remarks:b.getAttribute('data-remarks'),eps:b.getAttribute('data-eps')};}
  function paint(){var f=hgFavHas(id);b.textContent=f?'★ 已收藏':'☆ 收藏';if(f){b.classList.add('on');}else{b.classList.remove('on');}}
  function syncLocal(on){var has=hgFavHas(id);if(on&&!has){hgFavToggle(item());}if(!on&&has){hgFavToggle({id:id});}paint();}
  b.addEventListener('click',function(){
    hgMeP.then(function(me){
      if(me&&me.logged){
        fetch('/api/fav',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:parseInt(id,10)})})
          .then(function(r){return r.json();}).then(function(d){syncLocal(!!d.on);}).catch(function(){hgFavToggle(item());paint();});
      }else{hgFavToggle(item());paint();}
    });
  });
  paint();
  hgMeP.then(function(me){
    if(me&&me.logged){
      fetch('/api/favstate?id='+encodeURIComponent(id)).then(function(r){return r.json();}).then(function(d){syncLocal(!!d.on);}).catch(function(){});
    }
  });
}
// --- user accounts are closed (Dario's order, 2026-11-14): no login/register.
// Favorites and history live only in this browser's localStorage.
var hgMe={logged:false};
var hgMeP=Promise.resolve(hgMe);
