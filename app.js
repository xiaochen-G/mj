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
// --- user accounts (reopened 2026-11-18): session state, header user
// box, and a one-time merge of this browser's guest favorites/history
// into the account so they follow the user across devices.
var hgMe={logged:false};
var hgMeP=(function(){
  return fetch('/api/me').then(function(r){return r.json();}).then(function(d){
    hgMe=d||{logged:false};
    var ub=document.getElementById('userBox');
    if(ub){
      ub.innerHTML='';
      if(hgMe.logged){
        var a=document.createElement('a');a.href='/user';a.textContent=hgMe.name;ub.appendChild(a);
      }else{
        var l=document.createElement('a');l.href='/login';l.textContent='登录';ub.appendChild(l);
      }
    }
    if(hgMe.logged){
      var key='hg_merged_'+hgMe.name,done=false;
      try{done=!!localStorage.getItem(key);}catch(e){}
      if(!done){
        var favs=hgFavs(),hist=hgLoad('hg_hist');
        if(favs.length||hist.length){
          var mf=[],mh=[],i;
          for(i=0;i<favs.length;i++){mf.push({id:parseInt(favs[i].id,10)});}
          for(i=0;i<hist.length;i++){mh.push({id:parseInt(hist[i].id,10),ep:parseInt(hist[i].ep,10)||0});}
          fetch('/api/merge',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({favs:mf,hist:mh})})
            .then(function(){try{localStorage.setItem(key,'1');}catch(e){}}).catch(function(){});
        }else{try{localStorage.setItem(key,'1');}catch(e){}}
      }
    }
    return hgMe;
  }).catch(function(){return hgMe;});
})();
// --- ddys-style chrome: dark-mode toggle + search overlay (2026-11-15) ---
(function(){
  var tb=document.getElementById('themeBtn');
  function paint(){var d=document.documentElement.getAttribute('data-theme')==='dark';if(tb)tb.textContent=d?'☀️':'🌙';}
  if(tb){tb.addEventListener('click',function(){
    var d=document.documentElement.getAttribute('data-theme')==='dark';
    if(d){document.documentElement.removeAttribute('data-theme');try{localStorage.removeItem('hg_theme');}catch(e){}}
    else{document.documentElement.setAttribute('data-theme','dark');try{localStorage.setItem('hg_theme','dark');}catch(e){}}
    paint();
  });paint();}
  var sb=document.getElementById('searchBtn'),ov=document.getElementById('searchOverlay'),sc=document.getElementById('searchClose');
  if(sb&&ov){sb.addEventListener('click',function(){ov.hidden=false;var i=ov.querySelector('input');if(i){i.focus();}});}
  if(sc&&ov){sc.addEventListener('click',function(){ov.hidden=true;});}
  if(ov){ov.addEventListener('click',function(e){if(e.target===ov){ov.hidden=true;}});}
})();
// --- pager jump box (2026-11-15) ---
(function(){
  var pj=document.querySelector('.pgjump');
  if(!pj)return;
  pj.addEventListener('submit',function(e){
    e.preventDefault();
    var inp=pj.querySelector('input'),n=parseInt(inp.value,10);
    if(!n||n<1)return;
    var max=parseInt(inp.getAttribute('max'),10)||0;
    if(max&&n>max)n=max;
    location.href=pj.getAttribute('data-base')+n;
  });
})();
