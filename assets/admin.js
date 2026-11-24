/* SONORA admin.js: hanya dimuat di admin.html. Butuh app.js (data produk, helper, toast).
   PERINGATAN KEAMANAN: login ini hanya gerbang tampilan di sisi browser. Username dan password
   terbaca siapa pun lewat view-source, dan sesi bisa dipalsukan lewat DevTools. Data produk juga
   hanya tersimpan di localStorage browser ini. Untuk dipakai sungguhan, butuh backend (API, database,
   hash password, session/JWT). Jangan simpan data sensitif di sini. */
const ADMIN_USER='admin',ADMIN_PASS='admin',SESSION_KEY='sonora_admin';
let adminEditing=null,authed=false;
try{authed=sessionStorage.getItem(SESSION_KEY)==='1'}catch{}
function showAdmin(){document.getElementById('loginView').hidden=true;document.getElementById('adminView').hidden=false;adminTab('overview',document.querySelector('.admin-menu button'));const t=document.getElementById('adminTitle');t.focus()}
function showLogin(){document.getElementById('adminView').hidden=true;document.getElementById('loginView').hidden=false;document.getElementById('adminUser').focus()}
function setSession(on){authed=on;try{on?sessionStorage.setItem(SESSION_KEY,'1'):sessionStorage.removeItem(SESSION_KEY)}catch{}}
document.getElementById('loginForm').addEventListener('submit',e=>{
  e.preventDefault();
  const u=document.getElementById('adminUser'),p=document.getElementById('adminPass'),err=document.getElementById('loginErr');
  if(u.value.trim()===ADMIN_USER&&p.value===ADMIN_PASS){
    setSession(true);e.target.reset();err.hidden=true;u.removeAttribute('aria-invalid');p.removeAttribute('aria-invalid');showAdmin();
  }else{
    err.hidden=false;u.setAttribute('aria-invalid','true');p.setAttribute('aria-invalid','true');p.value='';u.focus();
  }
});
document.getElementById('logoutBtn').addEventListener('click',()=>{setSession(false);showLogin();toast('Berhasil keluar')});
function adminContentGuard(){if(!authed){showLogin();return false}return true}

function adminTab(tab,btn){
  if(!adminContentGuard())return;
  document.querySelectorAll('.admin-menu button').forEach(x=>x.classList.remove('active'));if(btn)btn.classList.add('active');
  let c=document.getElementById('adminContent');
  if(tab==='overview'){
    let revenue=cart.reduce((s,x)=>s+(products.find(p=>p.id===x.id)?.price||0)*x.qty,0);
    c.innerHTML=`<h2>Ringkasan toko</h2><div class="admin-stats"><div class="stat"><small>Total produk</small><b>${products.length}</b></div><div class="stat"><small>Total stok</small><b>${products.reduce((s,p)=>s+p.stock,0)}</b></div><div class="stat"><small>Nilai keranjang</small><b style="font-size:15px">${rupiah(revenue)}</b></div></div><p class="sub" style="margin-bottom:16px">Selamat datang di Seller Center SONORA. Kelola katalog dan persediaan tokomu dari sini. Data produk tersimpan di browser ini saja.</p><button class="btn primary" onclick="adminTab('add',document.querySelectorAll('.admin-menu button')[2])">${ic('plus')} Tambah produk</button>`
  }else if(tab==='products'){
    c.innerHTML=`<h2>Kelola produk</h2><div style="overflow:auto"><table class="admin-table"><thead><tr><th>Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Aksi</th></tr></thead><tbody>${products.map(p=>`<tr><td>${esc(p.name)}</td><td>${esc(p.category)}</td><td class="mono">${rupiah(p.price)}</td><td class="mono">${p.stock}</td><td><button class="btn ghost small" onclick="editProduct(${p.id})">Edit</button> <button class="btn ghost small danger" onclick="deleteProduct(${p.id})">Hapus</button></td></tr>`).join('')}</tbody></table></div>`
  }else if(tab==='add'){adminEditing=null;c.innerHTML=productForm()}
}
function productForm(p={}){
  const f=(id,label,control)=>`<div class="field"><label for="f_${id}">${label}</label>${control}</div>`;
  const opt=n=>`<option ${p.category===n?'selected':''}>${n}</option>`;
  return `<h2>${p.id?'Edit produk':'Tambah produk baru'}</h2><form onsubmit="saveProduct(event)" autocomplete="off"><div class="form-grid">${f('name','Nama produk',`<input id="f_name" name="name" required value="${esc(p.name||'')}">`)}${f('category','Kategori',`<select id="f_category" name="category">${['Gitar','Keyboard','Ukulele','Aksesoris'].map(opt).join('')}</select>`)}${f('sub','Subkategori',`<input id="f_sub" name="sub" required value="${esc(p.sub||'')}">`)}${f('price','Harga (Rp)',`<input id="f_price" name="price" type="number" min="0" required value="${p.price||''}">`)}${f('stock','Stok',`<input id="f_stock" name="stock" type="number" min="0" required value="${p.stock??0}">`)}${f('tag','Label produk',`<input id="f_tag" name="tag" value="${esc(p.tag||'')}" placeholder="Best seller / Baru">`)}</div>${f('image','URL gambar produk',`<input id="f_image" name="image" type="url" value="${esc(p.image||'')}" placeholder="https://...">`)}${f('desc','Deskripsi',`<textarea id="f_desc" name="desc" required>${esc(p.desc||'')}</textarea>`)}${f('spec','Spesifikasi',`<input id="f_spec" name="spec" value="${esc(p.spec||'')}">`)}${f('model','URL model 3D (.glb / .gltf)',`<input id="f_model" name="model" value="${esc(p.model||'')}" placeholder="models/guitar.glb">`)}<button class="btn primary">${p.id?'Simpan perubahan':'Simpan produk'}</button> <button type="button" class="btn ghost" onclick="adminTab('products',document.querySelectorAll('.admin-menu button')[1])">Batal</button></form>`
}
function editProduct(id){let p=products.find(x=>x.id===id);adminEditing=id;document.getElementById('adminContent').innerHTML=productForm(p)}
function saveProduct(e){e.preventDefault();let f=new FormData(e.target),d=Object.fromEntries(f.entries());d.price=Number(d.price);d.stock=Number(d.stock);if(adminEditing){Object.assign(products.find(p=>p.id===adminEditing),d)}else{d.id=Math.max(0,...products.map(p=>p.id))+1;products.push(d)}save();adminTab('products',document.querySelectorAll('.admin-menu button')[1]);toast('Data produk berhasil disimpan')}
function deleteProduct(id){if(!confirm('Hapus produk ini?'))return;products=products.filter(p=>p.id!==id);cart=cart.filter(x=>x.id!==id);save();updateCart();adminTab('products',document.querySelectorAll('.admin-menu button')[1]);toast('Produk dihapus')}

if(authed)showAdmin();
