(function(){
  hgWireFav(document.getElementById('favBtn'));
  var w=document.getElementById('watchBtn');
  if(w){
    var h=hgHistGet(w.getAttribute('data-id'));
    if(h){w.setAttribute('href','/play?id='+h.id+'&ep='+h.ep);w.textContent='▶ 继续播放 · '+h.epName;}
    hgMeP.then(function(me){
      if(me&&me.logged){
        fetch('/api/hist').then(function(r){return r.json();}).then(function(list){
          for(var i=0;i<(list||[]).length;i++){
            if(String(list[i].id)===String(w.getAttribute('data-id'))){
              w.setAttribute('href','/play?id='+list[i].id+'&ep='+list[i].ep);
              w.textContent='▶ 继续播放 · '+(list[i].epName||'');
              break;
            }
          }
        }).catch(function(){});
      }
    });
  }
})();
