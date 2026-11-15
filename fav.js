(function(){
  var root=document.getElementById('favRoot'),mode=root.getAttribute('data-mode');
  function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;}
  function render(a){
    root.innerHTML='';
    if(mode==='fav'){
      if(!a.length){root.appendChild(el('div','empty','暂无收藏，去首页逛逛吧'));return;}
      var g=el('div','grid');
      a.forEach(function(it){
        var card=el('a','card');card.href='/detail?id='+it.id;
        var p=el('div','poster');
        var img=document.createElement('img');img.loading='lazy';img.src=hgImg(it.pic);img.alt=it.name||'';
        p.appendChild(img);
        if(it.remarks){p.appendChild(el('div','badge',it.remarks));}
        card.appendChild(p);
        var cb=el('div','cbody');
        cb.appendChild(el('h3',null,it.name||''));
        cb.appendChild(el('div','sub','共 '+(it.eps||0)+' 集'));
        card.appendChild(cb);
        g.appendChild(card);
      });
      root.appendChild(g);
    }else{
      if(!a.length){root.appendChild(el('div','empty','暂无观看历史'));return;}
      a.forEach(function(it){
        var row=el('div','hrow');
        var img=document.createElement('img');img.loading='lazy';img.src=hgImg(it.pic);img.alt=it.name||'';
        row.appendChild(img);
        var hi=el('div','hi');
        hi.appendChild(el('h3',null,it.name||''));
        var when='';
        if(it.t){var d=new Date(it.t);when=' · '+(d.getMonth()+1)+'月'+d.getDate()+'日 '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2);}
        hi.appendChild(el('div','hs','看到 '+(it.epName||'')+when));
        row.appendChild(hi);
        var go=el('a','go','继续播放');go.href='/play?id='+it.id+'&ep='+(it.ep||0);
        row.appendChild(go);
        root.appendChild(row);
      });
    }
  }
  function localData(){return mode==='fav'?hgFavs():hgLoad('hg_hist');}
  var serverMode=false;
  hgMeP.then(function(me){
    if(me&&me.logged){
      serverMode=true;
      fetch(mode==='fav'?'/api/favs':'/api/hist').then(function(r){return r.json();})
        .then(function(a){render(a||[]);}).catch(function(){render(localData());});
    }else{
      render(localData());
    }
  });
  var cb=document.getElementById('clearBtn');
  if(cb){cb.addEventListener('click',function(){
    hgSave('hg_hist',[]);
    if(serverMode){fetch('/api/histclear',{method:'POST'}).then(function(){render([]);}).catch(function(){render([]);});}
    else{render([]);}
  });}
})();
