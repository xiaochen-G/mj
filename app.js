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
// --- user session (pages stay anonymous/cacheable; identity comes from /api/me) ---
var hgMe=null;
var hgMeP=fetch('/api/me').then(function(r){return r.json();}).then(function(m){hgMe=m;hgPaintUser();hgMaybeMerge();return m;}).catch(function(){return {logged:false};});
function hgPaintUser(){
  var box=document.getElementById('userBox');
  if(!box||!hgMe)return;
  box.innerHTML='';
  if(hgMe.logged){
    var s=document.createElement('span');s.textContent='👤 '+hgMe.name;box.appendChild(s);
    var a=document.createElement('a');a.href='/logout';a.textContent='退出';box.appendChild(a);
  }else{
    var l=document.createElement('a');l.href='/login';l.textContent='登录';box.appendChild(l);
    var g=document.createElement('a');g.href='/register';g.textContent='注册';box.appendChild(g);
  }
}
function hgMaybeMerge(){
  if(!hgMe||!hgMe.logged)return;
  var key='hg_merged_'+hgMe.name;
  try{if(localStorage.getItem(key))return;}catch(e){return;}
  var favs=hgFavs(),hist=hgLoad('hg_hist');
  var done=function(){try{localStorage.setItem(key,'1');}catch(e){}};
  if(!favs.length&&!hist.length){done();return;}
  fetch('/api/merge',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({favs:favs,hist:hist})}).then(done).catch(function(){});
}
