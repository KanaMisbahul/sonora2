/* SONORA app.js: data, helper, layout bersama, keranjang, modal, menu. Dimuat di semua halaman. */
/* Fallback gambar dipasang paling awal. */
const FALLBACK_IMG='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#26272a"/><text x="400" y="310" fill="#8a8d92" font-family="sans-serif" font-size="28" letter-spacing="8" text-anchor="middle">SONORA</text></svg>');
function imgFail(i){i.onerror=null;i.src=FALLBACK_IMG;i.classList.add('ok')}
const seedProducts=[
{id:1,name:"Acoustic Guitar",category:"Gitar",sub:"Akustik",price:1250000,stock:12,image:"https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=700",desc:"Gitar akustik 6 senar dengan karakter suara hangat. Cocok untuk belajar, latihan, hingga tampil di panggung kecil.",spec:"6 senar · Acoustic · Natural wood",tag:"Best seller",model:""},
{id:2,name:"Electric Guitar",category:"Gitar",sub:"Elektrik",price:2500000,stock:7,image:"https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=700",desc:"Gitar elektrik dengan desain modern dan karakter suara fleksibel untuk berbagai genre musik.",spec:"6 senar · Solid body · Electric",tag:"Popular",model:""},
{id:3,name:"Digital Keyboard",category:"Keyboard",sub:"Portable",price:3200000,stock:8,image:"https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=700",desc:"Keyboard digital portable untuk belajar, latihan, dan eksplorasi berbagai suara instrumen.",spec:"61 keys · Digital · Portable",tag:"",model:""},
{id:4,name:"Digital Piano",category:"Keyboard",sub:"Digital Piano",price:5500000,stock:4,image:"https://images.unsplash.com/photo-1552422535-c45813c61732?w=700",desc:"Digital piano dengan rentang tuts lebar dan tampilan elegan untuk ruang musikmu.",spec:"88 keys · Digital piano",tag:"Premium",model:""},
{id:5,name:"Concert Ukulele",category:"Ukulele",sub:"Concert",price:650000,stock:15,image:"https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=700",desc:"Ukulele concert dengan ukuran nyaman dan suara cerah. Teman ideal untuk memulai perjalanan bermusik.",spec:"4 senar · Concert · Wood",tag:"",model:""},
{id:6,name:"Ukulele Soprano",category:"Ukulele",sub:"Soprano",price:450000,stock:18,image:"https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=700",desc:"Ukulele soprano yang ringkas, ringan, dan mudah dibawa ke mana saja.",spec:"4 senar · Soprano",tag:"",model:""},
{id:8,name:"Guitar Amplifier",category:"Aksesoris",sub:"Amplifier",price:950000,stock:6,image:"https://images.unsplash.com/photo-1593078166033-9e2b8f4b2c2c?w=700",desc:"Amplifier gitar untuk latihan dan membangun karakter suara elektrikmu.",spec:"Guitar amplifier",tag:"",model:""},
/* Aksesoris gitar. Foto Pick (MAYANK D) dan Tuner (Alexis Baydoun) dari Unsplash, Unsplash License. Strap, Tas, Capo belum punya foto (tampil placeholder). Isi URL gambar lewat Admin. */
{id:9,name:"Pick Gitar (Set 10)",category:"Aksesoris",sub:"Pick",price:15000,stock:100,image:"https://images.unsplash.com/photo-1542355365-6df0e84f06ac?w=700&q=80",desc:"Satu set pick gitar dengan beberapa ketebalan. Cocok untuk strumming maupun petikan.",spec:"Isi 10 pcs · Aneka ketebalan",tag:"",model:""},
{id:10,name:"Strap Gitar",category:"Aksesoris",sub:"Strap",price:75000,stock:40,image:"",desc:"Strap gitar dengan panjang yang bisa diatur. Nyaman dipakai untuk gitar akustik maupun elektrik.",spec:"Adjustable · Universal",tag:"",model:""},
{id:11,name:"Tas Gitar",category:"Aksesoris",sub:"Tas",price:250000,stock:20,image:"",desc:"Tas gitar berbantalan untuk melindungi instrumen saat dibawa bepergian.",spec:"Gigbag · Berbantalan · Akustik/Elektrik",tag:"",model:""},
{id:12,name:"Capo Gitar",category:"Aksesoris",sub:"Capo",price:60000,stock:35,image:"",desc:"Capo untuk mengubah nada dasar dengan cepat tanpa mengganti posisi jari.",spec:"Clamp · Universal",tag:"",model:""},
{id:13,name:"Tuner Gitar Clip-on",category:"Aksesoris",sub:"Tuner",price:90000,stock:25,image:"https://images.unsplash.com/photo-1595512994123-d7735bbbcaab?w=700&q=80",desc:"Tuner clip-on dengan layar yang mudah dibaca untuk menyetel senar dengan akurat.",spec:"Clip-on · Chromatic · LCD",tag:"",model:""}
];
const REDUCE=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Konfigurasi toko. Nomor WhatsApp memakai format internasional tanpa + (0822... jadi 62822...). */
const STORE={name:'SONORA',whatsapp:'6282237934990'};
function waLink(text){return 'https://wa.me/'+STORE.whatsapp+'?text='+encodeURIComponent(text)}
/* Pesan WhatsApp umum untuk semua tombol "Chat WhatsApp". */
const WA_DEFAULT=`Halo SONORA, saya ingin bertanya tentang produk.`;
const NAV=[['index.html','Beranda','home'],['etalase.html','Etalase','etalase'],['produk.html','Produk','produk'],['tentang.html','Tentang','tentang']];
let products=load('sonora_products',seedProducts),cart=load('sonora_cart',[]),activeProduct=null,detailQty=1,lastFocus=null;
function load(k,f){try{return JSON.parse(localStorage.getItem(k))??structuredClone(f)}catch{return structuredClone(f)}}
function save(){localStorage.setItem('sonora_products',JSON.stringify(products));localStorage.setItem('sonora_cart',JSON.stringify(cart))}
/* Versi seed. Naikkan saat seedProducts berubah supaya browser lama menerima produk baru tanpa menghapus data Admin. */
const SEED_VERSION=3;
function migrateSeed(){
  try{
    if(localStorage.getItem('sonora_seed_v')===String(SEED_VERSION))return;
    if(localStorage.getItem('sonora_products')!==null){
      const old=products.find(p=>p.id===7&&p.name==='Guitar Accessories Set');
      if(old){products=products.filter(p=>p!==old);cart=cart.filter(x=>x.id!==7)}
      seedProducts.filter(s=>s.id>=9).forEach(s=>{if(!products.some(p=>p.name===s.name))products.push({...s,id:Math.max(0,...products.map(p=>p.id))+1})});
      /* v3: isi foto seed untuk produk bernama sama yang gambarnya masih kosong. */
      seedProducts.filter(s=>s.image).forEach(s=>{const p=products.find(x=>x.name===s.name&&!x.image);if(p)p.image=s.image});
    }
    localStorage.setItem('sonora_seed_v',String(SEED_VERSION));
    save();
  }catch{}
}
function rupiah(n){return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n)}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function ic(name,fill=false){return `<i class="${fill?'ph-fill':'ph'} ph-${name}" aria-hidden="true"></i>`}

function productCard(p){
  const out=p.stock<=0,low=!out&&p.stock<=5;
  return `<article class="product"><div class="product-img"><img src="${esc(p.image||FALLBACK_IMG)}" alt="${esc(p.name)}" loading="lazy" decoding="async" onload="this.classList.add('ok')" onerror="imgFail(this)"></div><div class="product-info"><div class="product-meta"><span>${esc(p.category)} / ${esc(p.sub)}</span>${p.tag?`<b>${esc(p.tag)}</b>`:''}</div><h3>${esc(p.name)}</h3><p class="product-desc">${esc(p.desc)}</p><div class="price-row"><div><div class="price">${rupiah(p.price)}</div>${low?`<span class="stock-note">Sisa ${p.stock} unit</span>`:''}${out?'<span class="stock-note">Stok habis</span>':''}</div></div><div class="product-actions"><button class="btn ghost small" onclick="showDetail(${p.id})">Lihat detail</button><button class="btn small" ${out?'disabled':''} onclick="addCart(${p.id})">${ic('plus')} Keranjang</button></div></div></article>`
}
function renderProducts(){
  let q=document.getElementById('search').value.toLowerCase(),cat=document.getElementById('categoryFilter').value,sort=document.getElementById('sortFilter').value;
  let arr=products.filter(p=>(cat==='Semua'||p.category===cat)&&(p.name+' '+p.sub+' '+p.desc).toLowerCase().includes(q));
  if(sort==='low')arr.sort((a,b)=>a.price-b.price);
  if(sort==='high')arr.sort((a,b)=>b.price-a.price);
  if(sort==='az')arr.sort((a,b)=>a.name.localeCompare(b.name));
  document.getElementById('productCount').textContent=arr.length+' produk tersedia';
  document.getElementById('productGrid').innerHTML=arr.length?arr.map(productCard).join(''):`<div class="empty">${ic('magnifying-glass')}<p>Produk tidak ditemukan. Coba kata kunci lain.</p><button class="btn ghost small" onclick="resetFilters()">Reset filter</button></div>`
}
/* ---------- Beranda: produk pilihan (berlabel dulu) ---------- */
function renderFeatured(){const t=products.filter(p=>p.tag),r=products.filter(p=>!p.tag);document.getElementById('featuredGrid').innerHTML=[...t,...r].slice(0,4).map(productCard).join('')}

/* ---------- Etalase: dirender dari data produk ---------- */
const ETALASE_CATS=[['Gitar','Akustik dan elektrik'],['Keyboard','Digital dan portable'],['Ukulele','Soprano dan concert'],['Aksesoris','Amplifier, pick, strap, capo, tuner']];
function cabItem(p){
  const out=p.stock<=0;
  return `<button class="cab-item${out?' out':''}" onclick="showDetail(${p.id})" aria-label="${esc(p.name)}, ${out?'stok habis':rupiah(p.price)}. Buka detail"><span class="cab-img"><img src="${esc(p.image||FALLBACK_IMG)}" alt="" loading="lazy" decoding="async" onload="this.classList.add('ok')" onerror="imgFail(this)"></span><span class="cab-name">${esc(p.name)}</span><span class="cab-price mono">${out?'Stok habis':rupiah(p.price)}</span></button>`
}
function renderEtalase(){
  const by=c=>products.filter(p=>p.category===c);
  const rows=2,cap=rows*2;
  document.getElementById('cabinetCols').innerHTML=ETALASE_CATS.map(([c,note])=>{
    const list=by(c),over=list.length>cap,shown=over?list.slice(0,cap-1):list,slots=shown.map(cabItem);
    if(over)slots.push(`<button class="cab-item more" onclick="setCategory('${c}')">+${list.length-shown.length} lagi</button>`);
    let shelves='';for(let r=0;r<rows;r++){const chunk=slots.slice(r*2,r*2+2);shelves+=chunk.length?`<div class="cab-shelf">${chunk.join('')}</div>`:`<button class="cab-drawer" onclick="setCategory('${c}')" aria-label="Lihat semua ${c}, ${list.length} produk"><span>Lihat semua ${c}</span><small class="mono">${list.length} produk</small></button>`}
    return `<div class="cab-col" role="group" aria-label="${c}"><div class="cab-head"><div><h3>${c}</h3><small>${note}</small></div><button class="cab-all" onclick="setCategory('${c}')" aria-label="Lihat semua ${c}">${ic('arrow-right')}</button></div>${shelves}</div>`
  }).join('');
}
function resetFilters(){document.getElementById('search').value='';document.getElementById('categoryFilter').value='Semua';renderProducts()}
function setCategory(c){location.href='produk.html?kategori='+encodeURIComponent(c)}
function shopNow(){closeModal('cartModal');if(document.body.dataset.page!=='produk')location.href='produk.html'}
function toast(msg){let t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2400)}

function loadModelViewer(){if(customElements.get('model-viewer')||document.getElementById('mvScript'))return;const s=document.createElement('script');s.type='module';s.id='mvScript';s.src='https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';document.head.appendChild(s)}
function showDetail(id){
  let p=products.find(x=>x.id===id);if(!p)return;activeProduct=p;detailQty=1;
  const out=p.stock<=0,wa=waLink(`Halo ${STORE.name}, saya tertarik dengan ${p.name} (${rupiah(p.price)}). Apakah masih tersedia?`);
  if(p.model)loadModelViewer();
  let visual=p.model?`<model-viewer class="viewer" src="${esc(p.model)}" camera-controls ${REDUCE?'':'auto-rotate'} shadow-intensity="1" alt="${esc(p.name)}"></model-viewer>`:`<img class="detail-photo" src="${esc(p.image||FALLBACK_IMG)}" alt="${esc(p.name)}" onerror="imgFail(this)">`;
  document.getElementById('detailContent').innerHTML=`<div class="crumb">${esc(p.category)} / ${esc(p.sub)}</div><div class="detail-grid"><div>${visual}<div class="field" style="margin-top:14px"><label for="modelFile">Pratinjau model 3D (.glb / .gltf), opsional</label><input id="modelFile" type="file" accept=".glb,.gltf" onchange="previewModel(event)"><small class="muted">File hanya dipratinjau pada sesi browser ini.</small></div></div><div class="detail-copy"><h2 id="detailTitle">${esc(p.name)}</h2><div class="price big">${rupiah(p.price)}</div><p>${esc(p.desc)}</p><dl class="specs"><div><dt>Spesifikasi</dt><dd>${esc(p.spec)}</dd></div><div><dt>Subkategori</dt><dd>${esc(p.sub)}</dd></div><div><dt>Stok</dt><dd>${out?'Habis':p.stock+' unit'}</dd></div></dl><div class="quantity"><span>Jumlah</span><button aria-label="Kurangi jumlah" onclick="changeDetailQty(-1)">${ic('minus')}</button><b id="detailQty" class="mono">1</b><button aria-label="Tambah jumlah" onclick="changeDetailQty(1)">${ic('plus')}</button></div><button class="btn primary block" ${out?'disabled':''} onclick="addCart(${p.id},detailQty);closeModal('detailModal')">Tambahkan ke keranjang</button><a class="btn ghost block" style="margin-top:8px" href="${esc(wa)}" target="_blank" rel="noopener noreferrer">${ic('whatsapp-logo',true)} Tanya via WhatsApp</a></div></div>`;
  openModal('detailModal')
}
function changeDetailQty(n){detailQty=Math.max(1,Math.min(activeProduct.stock,detailQty+n));document.getElementById('detailQty').textContent=detailQty}
function previewModel(e){let f=e.target.files[0];if(!f)return;loadModelViewer();let url=URL.createObjectURL(f),old=document.querySelector('#detailContent model-viewer');let v=document.createElement('model-viewer');v.className='viewer';v.src=url;v.setAttribute('camera-controls','');if(!REDUCE)v.setAttribute('auto-rotate','');v.setAttribute('shadow-intensity','1');v.alt=activeProduct.name;old?old.replaceWith(v):document.querySelector('#detailContent .detail-photo').replaceWith(v)}

function addCart(id,qty=1){let p=products.find(x=>x.id===id);if(!p)return;let row=cart.find(x=>x.id===id);if(row)row.qty=Math.min(p.stock,row.qty+qty);else cart.push({id,qty:Math.min(p.stock,qty)});save();updateCart();toast('Produk ditambahkan ke keranjang')}
function updateCart(){const n=cart.reduce((s,x)=>s+x.qty,0),el=document.getElementById('cartCount');el.textContent=n;el.hidden=n===0}
function openCart(){renderCart();openModal('cartModal')}
function renderCart(){
  let box=document.getElementById('cartItems'),sum=0;
  if(!cart.length){box.innerHTML=`<div class="empty">${ic('shopping-cart-simple')}<p>Keranjangmu masih kosong.</p><button class="btn" onclick="shopNow()">Mulai belanja</button></div>`;document.getElementById('cartSummary').innerHTML='';return}
  box.innerHTML=cart.map((x,i)=>{let p=products.find(z=>z.id===x.id);if(!p)return '';sum+=p.price*x.qty;return `<div class="cart-row"><img src="${esc(p.image||FALLBACK_IMG)}" alt="" onerror="imgFail(this)"><div><h4>${esc(p.name)}</h4><small><span class="mono">${rupiah(p.price)}</span> · Stok ${p.stock}</small><div class="quantity" style="margin:8px 0 0;gap:8px"><button aria-label="Kurangi jumlah" onclick="cartQty(${i},-1)">${ic('minus')}</button><b class="mono">${x.qty}</b><button aria-label="Tambah jumlah" onclick="cartQty(${i},1)">${ic('plus')}</button></div></div><button class="btn ghost small" onclick="removeCart(${i})">Hapus</button></div>`}).join('');
  document.getElementById('cartSummary').innerHTML=`<div class="cart-total"><span>Total</span><span class="mono">${rupiah(sum)}</span></div><div class="field"><label for="buyerName">Nama pemesan</label><input id="buyerName" placeholder="Nama kamu" autocomplete="name" aria-describedby="nameErr" oninput="this.removeAttribute('aria-invalid');document.getElementById('nameErr').hidden=true"><p class="error" id="nameErr" hidden>Isi nama pemesan terlebih dahulu.</p></div><div class="field"><label for="buyerNote">Catatan pesanan (opsional)</label><textarea id="buyerNote" placeholder="Warna, varian, atau pertanyaan..."></textarea></div><button class="btn primary block" onclick="checkout()">${ic('whatsapp-logo',true)} Checkout via WhatsApp</button><p class="note">Checkout demo akan membuka WhatsApp. Ganti nomor di STORE.whatsapp (JavaScript) sebelum dipakai sungguhan.</p>`
}
function cartQty(i,d){let x=cart[i],p=products.find(z=>z.id===x.id);x.qty=Math.max(1,Math.min(p.stock,x.qty+d));save();renderCart();updateCart()}
function removeCart(i){cart.splice(i,1);save();renderCart();updateCart()}
function checkout(){
  if(!cart.length)return;
  const inp=document.getElementById('buyerName'),err=document.getElementById('nameErr');
  let name=inp.value.trim();
  if(!name){err.hidden=false;inp.setAttribute('aria-invalid','true');inp.focus();return}
  let msg=`Halo ${STORE.name}, saya ${name} ingin memesan:\n\n`;let total=0;
  cart.forEach(x=>{let p=products.find(z=>z.id===x.id);if(p){msg+=`- ${p.name} (${x.qty}x): ${rupiah(p.price*x.qty)}\n`;total+=p.price*x.qty}});
  msg+=`\nTotal: ${rupiah(total)}\nCatatan: ${document.getElementById('buyerNote').value||'-'}`;
  window.open(waLink(msg),'_blank','noopener,noreferrer');
}

/* ---------- Modal: fokus dikunci di dalam dialog, dikembalikan saat ditutup ---------- */
function syncLock(){document.body.style.overflow=document.querySelector('.modal-backdrop.show,.menu.open')?'hidden':''}
function openModal(id){const el=document.getElementById(id);if(el.classList.contains('show'))return;lastFocus=document.activeElement;el.classList.add('show');syncLock();el.querySelector('.close').focus()}
function closeModal(id){document.getElementById(id).classList.remove('show');syncLock();if(lastFocus&&lastFocus.focus)lastFocus.focus()}

/* ---------- Menu panel ---------- */
function openMenu(){const m=document.getElementById('menu');if(m.classList.contains('open'))return;lastFocus=document.activeElement;m.removeAttribute('inert');m.setAttribute('aria-hidden','false');m.classList.add('open');document.getElementById('menuBtn').setAttribute('aria-expanded','true');syncLock();m.querySelector('.menu-toggle').focus()}
function closeMenu(restore=true){const m=document.getElementById('menu');if(!m.classList.contains('open'))return;m.classList.remove('open');m.setAttribute('aria-hidden','true');m.setAttribute('inert','');document.getElementById('menuBtn').setAttribute('aria-expanded','false');syncLock();if(restore&&lastFocus&&lastFocus.focus)lastFocus.focus()}
function backdropClose(e,id){if(e.target.id===id)closeModal(id)}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeMenu();document.querySelectorAll('.modal-backdrop.show').forEach(x=>closeModal(x.id))}
  if(e.key==='Tab'){
    const m=document.querySelector('.menu.open .menu-panel')||document.querySelector('.modal-backdrop.show .modal');if(!m)return;
    const f=[...m.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(x=>x.offsetParent!==null);if(!f.length)return;
    const a=f[0],z=f[f.length-1];
    if(!m.contains(document.activeElement)){e.preventDefault();a.focus()}
    else if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}
    else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}
  }
});

/* ---------- Layout bersama: header, menu, footer, modal. Satu sumber untuk semua halaman. ---------- */
function mountLayout(){
  const page=document.body.dataset.page||'';
  document.getElementById('layoutTop').innerHTML=`<header class="header"><div class="wrap nav">
<a class="brand" href="index.html">SONORA</a>
<div class="actions">
<a class="iconbtn" data-wa target="_blank" rel="noopener noreferrer" title="Chat WhatsApp" aria-label="Chat via WhatsApp">${ic('whatsapp-logo',true)}</a>
<button class="iconbtn" title="Keranjang" aria-label="Keranjang" onclick="openCart()">${ic('shopping-cart-simple')}<span class="count" id="cartCount" hidden>0</span></button>
<button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="menu" onclick="openMenu()">Menu ${ic('plus')}</button>
</div></div></header>
<div class="menu" id="menu" aria-hidden="true" inert>
<div class="menu-scrim" onclick="closeMenu()"></div>
<div class="menu-layer l1"></div><div class="menu-layer l2"></div>
<aside class="menu-panel" role="dialog" aria-modal="true" aria-label="Menu utama">
<button class="menu-toggle" onclick="closeMenu()">Tutup ${ic('x')}</button>
<nav aria-label="Utama"><ol class="menu-list">${NAV.map(([h,l,k],i)=>`<li style="--i:${i}"><a href="${h}"${k===page?' aria-current="page"':''}>${l}</a></li>`).join('')}</ol></nav>
<div class="menu-foot">
<a class="btn primary block" data-wa target="_blank" rel="noopener noreferrer">${ic('whatsapp-logo',true)} Chat WhatsApp</a>
<a class="btn ghost block" href="admin.html">Seller/Admin</a>
</div>
</aside>
</div>`;
  document.getElementById('layoutBottom').innerHTML=`<footer class="footer"><div class="wrap footer-inner"><span class="brand">SONORA</span><span>&copy; 2026 SONORA. Prototype interaktif.</span><a href="#layoutTop">Kembali ke atas ${ic('arrow-up')}</a></div></footer>
<div class="modal-backdrop" id="detailModal" onclick="backdropClose(event,'detailModal')"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="detailTitle"><button class="close" aria-label="Tutup" onclick="closeModal('detailModal')">${ic('x')}</button><div id="detailContent"></div></div></div>
<div class="modal-backdrop" id="cartModal" onclick="backdropClose(event,'cartModal')"><div class="modal narrow" role="dialog" aria-modal="true" aria-labelledby="cartTitle"><button class="close" aria-label="Tutup" onclick="closeModal('cartModal')">${ic('x')}</button><h2 id="cartTitle">Keranjang Belanja</h2><div id="cartItems"></div><div id="cartSummary"></div></div></div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>`;
  document.querySelectorAll('a[data-wa]').forEach(a=>a.href=waLink(WA_DEFAULT));
  document.querySelectorAll('img[data-fb]').forEach(i=>{if(i.complete&&!i.naturalWidth)imgFail(i);else i.addEventListener('error',()=>imgFail(i),{once:true})});
}

/* ---------- Boot ---------- */
try{localStorage.removeItem('sonora_wishlist')}catch{}
migrateSeed();
mountLayout();
if(document.getElementById('featuredGrid'))renderFeatured();
if(document.getElementById('cabinetCols'))renderEtalase();
if(document.getElementById('productGrid')){
  const k=new URLSearchParams(location.search).get('kategori');
  if(['Gitar','Keyboard','Ukulele','Aksesoris'].includes(k))document.getElementById('categoryFilter').value=k;
  renderProducts();
}
updateCart();

/* ---------- Reveal saat scroll: urutan baca section di bawah fold ---------- */
(function(){
  const els=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)||REDUCE){els.forEach(e=>e.classList.add('in'));return}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
  els.forEach(e=>io.observe(e));
})();
