/* ---------- Data Sample ---------- */
const PRODUCTS = [
  {id:1,title:"Anting Minimalis Silver", price:8000, category:"Anting", image:"https://down-id.img.susercontent.com/file/dbaceffd47c4eeae227778f4d9a79542", desc:"Anting simple berlapis silver. Cocok untuk daily look.", popular:true, stock:12, sale:false, newItem:true},
  {id:2,title:"Gelang Rantai Tipis", price:9000, category:"Gelang", image:"https://tse4.mm.bing.net/th/id/OIP.f2CU7LIaAZBgUGK22e9VlAHaHa?pid=Api&P=0&h=180", desc:"Gelang rantai elegan, finishing halus.", popular:true, stock:8, sale:true, newItem:false},
  {id:3,title:"Kalung Layered Emas", price:10000, category:"Kalung", image:"https://tse4.mm.bing.net/th/id/OIP.q4f47f63V2AtI7abnxYhDwHaHa?pid=Api&P=0&h=180", desc:"Kalung berlapis emas, tampak mewah namun ringan.", popular:true, stock:5, sale:true, newItem:true},
  {id:4,title:"Cincin Solitaire Elegant", price:8000, category:"Cincin", image:"https://tse4.mm.bing.net/th/id/OIP.yQvydXQbNStFqdZokLr9_QHaHa?pid=Api&P=0&h=180", desc:"Cincin solitaire dengan batu kristal jernih.", popular:false, stock:6, sale:false, newItem:true},
  {id:5,title:"Anting Hoop Classic", price:6000, category:"Anting", image:"https://down-id.img.susercontent.com/file/sg-11134201-7rd5x-lut0849y9a1l12", desc:"Hoop ring klasik untuk semua suasana.", popular:true, stock:15, sale:false, newItem:false},
  {id:6,title:"Gelang Charm Pink", price:8000, category:"Gelang", image:"https://down-id.img.susercontent.com/file/id-11134207-7r98z-lt938r7pza317b", desc:"Gelang charm dengan aksen pink pastel.", popular:true, stock:14, sale:true, newItem:true},
  {id:7,title:"Set Cincin + Anting", price:10000, category:"Set", image:"https://down-id.img.susercontent.com/file/id-11134207-7r98y-lpbm2728ujz55f", desc:"Paket hemat: cincin + anting senada.", popular:true, stock:3, sale:true, newItem:false},
  {id:8,title:"Kalung Pendant Batu", price:6000, category:"Kalung", image:"https://down-id.img.susercontent.com/file/id-11134207-7r992-lu35i1w514iza4", desc:"Pendant dengan batu natural pilihan.", popular:false, stock:4, sale:true, newItem:false},
  {id:9,title:"Cincin Couple Simple", price:9000, category:"Cincin", image:"https://tse4.mm.bing.net/th/id/OIP.DpLR0bFy9XmqXUBuIYoxuAHaHa?pid=Api&P=0&h=180", desc:"Cincin couple simple, cocok pasangan.", popular:true, stock:10, sale:false, newItem:true},
  {id:10,title:"Anting Pearl Mini", price:5000, category:"Anting", image:"https://down-id.img.susercontent.com/file/id-11134207-7qul5-lhlhs05vobbob5", desc:"Anting mutiara kecil untuk tampilan elegan.", popular:false, stock:7, sale:false, newItem:false},
  {id:11,title:"Gelang Kulit Minimal", price:8000, category:"Gelang", image:"https://tse2.mm.bing.net/th/id/OIP.rVBxfcY9Ll8E48P25TbktAHaHa?pid=Api&P=0&h=180", desc:"Gelang kulit berkualitas, desain timeless.", popular:false, stock:8, sale:true, newItem:false},
  {id:12,title:"Kalung Choker Satin", price:7000, category:"Kalung", image:"https://fitinline.com/data/article/20220825/Kalung-Choker-001.jpeg", desc:"Choker satin lembut, nuansa feminin.", popular:false, stock:18, sale:false, newItem:true}
];

/* ---------- State ---------- */
let state = {
  products: PRODUCTS.slice(),
  category: "All",
  search: "",
  sort: "popular",
  cart: JSON.parse(localStorage.getItem('cart_v1') || "[]"),
  wishlist: JSON.parse(localStorage.getItem('wishlist_v1') || "[]"),
  checkoutContext: null
};

/* ---------- Utils ---------- */
const rupiah = v => {
  if (typeof v !== 'number') v = Number(v) || 0;
  return "Rp" + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".");
};

function saveCart(){ localStorage.setItem('cart_v1', JSON.stringify(state.cart)); renderCart(); }
function saveWishlist(){ localStorage.setItem('wishlist_v1', JSON.stringify(state.wishlist)); renderWishlistCount(); renderWishlist(); }

/* ---------- Render category buttons ---------- */
function renderCategoryButtons(){
  const cats = ["All","Gelang","Anting","Cincin","Kalung","Set"];
  const bar = document.getElementById('category-bar');
  bar.innerHTML = "";
  cats.forEach(cat=>{
    const btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.textContent = cat === "All" ? "Semua" : cat;
    btn.dataset.cat = cat;
    if(state.category === cat) btn.classList.add('active');
    btn.addEventListener('click', ()=>{
      state.category = cat;
      document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(true);
      document.getElementById('product-grid').scrollIntoView({behavior:'smooth'});
    });
    bar.appendChild(btn);
  });
}

/* ---------- Render products ---------- */
function renderProducts(flash=true){
  let list = PRODUCTS.slice();

  if(state.category && state.category !== "All"){
    list = list.filter(p => p.category === state.category);
  }

  if(state.search && state.search.trim().length > 0){
    const q = state.search.trim().toLowerCase();
    list = list.filter(p => (p.title + " " + p.desc + " " + p.category).toLowerCase().includes(q));
  }

  if(state.sort === "popular"){
    list.sort((a,b)=> (b.popular?1:0) - (a.popular?1:0));
  } else if(state.sort === "new"){
    list.sort((a,b)=> (b.newItem?1:0) - (a.newItem?1:0));
  } else if(state.sort === "low"){
    list.sort((a,b)=> a.price - b.price);
  } else if(state.sort === "high"){
    list.sort((a,b)=> b.price - a.price);
  }

  const grid = document.getElementById('product-grid');
  grid.innerHTML = "";
  document.getElementById('total-products').textContent = list.length;

  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card fade-in';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}" loading="lazy" />
      <div class="meta">
        <h3>${p.title}</h3>
        <div class="price">${rupiah(p.price)}</div>
      </div>
      <div class="label">${p.category} • ${p.stock} stok</div>
      <div class="actions">
        <button class="btn-small btn-primary" data-id="${p.id}" data-action="add">Tambah</button>
        <button class="btn-small btn-ghost" data-id="${p.id}" data-action="view">Lihat</button>
        <button class="btn-small btn-checkout" data-id="${p.id}" data-action="buy">Checkout</button>
      </div>
    `;
    card.querySelector('[data-action="add"]').addEventListener('click', ()=> addToCart(p.id,1));
    card.querySelector('[data-action="view"]').addEventListener('click', ()=> openModal(p.id));
    card.querySelector('[data-action="buy"]').addEventListener('click', ()=> openCheckoutForProduct(p.id));
    grid.appendChild(card);
  });

  if(flash){
    grid.animate([{opacity:0.96, transform:'translateY(6px)'},{opacity:1, transform:'none'}],{duration:300});
  }
}

/* ---------- CART ---------- */
function addToCart(id, qty=1){
  const prod = PRODUCTS.find(p=>p.id===id);
  if(!prod) return alert("Produk tidak ditemukan.");
  const existing = state.cart.find(i=>i.id===id);
  if(existing){
    existing.qty += qty;
  } else {
    state.cart.push({id:prod.id, title:prod.title, price:prod.price, image:prod.image, qty});
  }
  saveCart();
  flashCartCount();
}

function removeFromCart(id){
  state.cart = state.cart.filter(i=>i.id!==id);
  saveCart();
}

function updateQty(id, delta){
  const it = state.cart.find(i=>i.id===id);
  if(!it) return;
  it.qty = Math.max(1, it.qty + delta);
  saveCart();
}

function renderCart(){
  const container = document.getElementById('cart-items');
  container.innerHTML = "";
  if(state.cart.length === 0){
    container.innerHTML = "<div style='color:var(--muted);padding:10px'>Keranjang kosong.</div>";
  } else {
    state.cart.forEach(item=>{
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <div style="flex:1">
          <div style="font-weight:700">${item.title}</div>
          <div style="color:var(--muted);font-size:13px">${rupiah(item.price)}</div>
          <div class="qty" style="margin-top:8px;display:flex;align-items:center;gap:8px">
            <button data-action="dec" data-id="${item.id}" style="padding:6px;border-radius:8px;border:0;background:transparent;cursor:pointer">−</button>
            <div style="padding:6px 10px;border-radius:8px;background:var(--glass-2)">${item.qty}</div>
            <button data-action="inc" data-id="${item.id}" style="padding:6px;border-radius:8px;border:0;background:transparent;cursor:pointer">+</button>
            <button data-action="del" data-id="${item.id}" style="margin-left:8px;padding:6px;border-radius:8px;border:0;background:transparent;color:#ff6f8f;cursor:pointer">Hapus</button>
          </div>
        </div>
      `;
      row.querySelector('[data-action="dec"]').addEventListener('click', ()=> updateQty(item.id, -1));
      row.querySelector('[data-action="inc"]').addEventListener('click', ()=> updateQty(item.id, +1));
      row.querySelector('[data-action="del"]').addEventListener('click', ()=> removeFromCart(item.id));
      container.appendChild(row);
    });
  }
  const subtotal = state.cart.reduce((s,c)=> s + c.price * c.qty, 0);
  document.getElementById('cart-subtotal').textContent = rupiah(subtotal);
  document.getElementById('cart-count').textContent = state.cart.reduce((s,c)=>s+c.qty,0);
}

/* flash cart icon */
function flashCartCount(){
  const el = document.getElementById('cart-count');
  el.animate([{transform:'scale(1)'},{transform:'scale(1.2)'},{transform:'scale(1)'}],{duration:300});
}

/* Cart panel toggle */
document.getElementById('open-cart').addEventListener('click', ()=>{
  document.getElementById('cart-panel').classList.toggle('active');
});

/* Checkout all from cart button */
document.getElementById('cart-checkout-btn').addEventListener('click', ()=>{
  if(state.cart.length === 0) return alert("Keranjang kosong.");
  const items = state.cart.map(i => ({...i}));
  openCheckoutModal(items);
});

/* ---------- WISHLIST ---------- */
function addToWishlist(id){
  if(state.wishlist.find(i=>i.id===id)) return alert("Produk sudah tersimpan.");
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  state.wishlist.push({id:p.id, title:p.title, price:p.price, image:p.image});
  saveWishlist();
  animateWishlist();
}
function removeFromWishlist(id){
  state.wishlist = state.wishlist.filter(i=>i.id!==id);
  saveWishlist();
}
function renderWishlist(){
  const container = document.getElementById('wishlist-items');
  container.innerHTML = "";
  if(state.wishlist.length === 0){
    container.innerHTML = "<div style='color:var(--muted);padding:10px'>Belum ada produk tersimpan.</div>";
  } else {
    state.wishlist.forEach(item=>{
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <div style="flex:1">
          <div style="font-weight:700">${item.title}</div>
          <div style="color:var(--muted);font-size:13px">${rupiah(item.price)}</div>
          <div style="margin-top:8px;display:flex;gap:8px">
            <button style="padding:8px;border-radius:8px;border:0;background:linear-gradient(90deg,var(--accent),#ff8fc3);color:#fff;cursor:pointer" data-action="addtocart" data-id="${item.id}">Tambah ke Keranjang</button>
            <button style="padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,0.06);background:transparent;cursor:pointer" data-action="remove" data-id="${item.id}">Hapus</button>
          </div>
        </div>
      `;
      row.querySelector('[data-action="addtocart"]').addEventListener('click', ()=>{
        addToCart(item.id,1);
        removeFromWishlist(item.id);
      });
      row.querySelector('[data-action="remove"]').addEventListener('click', ()=> removeFromWishlist(item.id));
      container.appendChild(row);
    });
  }
}
function renderWishlistCount(){
  document.getElementById('wishlist-count').textContent = state.wishlist.length;
}
document.getElementById('open-wishlist').addEventListener('click', ()=>{
  const panel = document.getElementById('wishlist-panel');
  panel.classList.toggle('active');
  renderWishlist();
});
function animateWishlist(){
  const el = document.getElementById('open-wishlist');
  el.animate([{transform:'scale(1)'},{transform:'scale(1.15)'},{transform:'scale(1)'}],{duration:300});
}

/* ---------- PRODUCT MODAL ---------- */
function openModal(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  document.getElementById('modal-image').src = p.image;
  document.getElementById('modal-title').textContent = p.title;
  document.getElementById('modal-cat').textContent = p.category;
  document.getElementById('modal-price').textContent = rupiah(p.price);
  document.getElementById('modal-desc').textContent = p.desc;
  document.getElementById('modal-stock').textContent = p.stock;
  document.getElementById('modal-qty').value = 1;
  document.getElementById('modal').classList.add('active');
  document.getElementById('modal').setAttribute('aria-hidden','false');

  document.getElementById('modal-add').onclick = ()=>{
    const qty = parseInt(document.getElementById('modal-qty').value) || 1;
    addToCart(p.id, qty);
    document.getElementById('modal').classList.remove('active');
  };
  document.getElementById('modal-wishlist').onclick = ()=>{
    addToWishlist(p.id);
    document.getElementById('modal').classList.remove('active');
  };
  document.getElementById('modal-direct-checkout').onclick = ()=>{
    const qty = parseInt(document.getElementById('modal-qty').value) || 1;
    openCheckoutForProduct(p.id, qty);
    document.getElementById('modal').classList.remove('active');
  };
}
document.getElementById('close-modal').addEventListener('click', ()=>{
  document.getElementById('modal').classList.remove('active');
});

/* ---------- CHECKOUT ---------- */
function shippingForCity(city){
  switch(city){
    case 'Jakarta': return {cost:15000, days:'1-2 hari'};
    case 'Bandung': return {cost:12000, days:'1-2 hari'};
    case 'Surabaya': return {cost:20000, days:'2-4 hari'};
    case 'Yogyakarta': return {cost:13000, days:'1-3 hari'};
    default: return {cost:25000, days:'3-5 hari'};
  }
}
function openCheckoutForProduct(id, qty=1){
  const prod = PRODUCTS.find(p=>p.id===id);
  if(!prod) return;
  const items = [{id:prod.id, title:prod.title, price:prod.price, image:prod.image, qty}];
  openCheckoutModal(items);
}
function openCheckoutModal(items){
  state.checkoutContext = {items};
  renderCheckoutItems();
  document.getElementById('checkout-city').value = 'Jakarta';
  updateCheckoutTotals();
  document.getElementById('checkout-modal').classList.add('active');
  document.getElementById('checkout-modal').setAttribute('aria-hidden','false');
}
function renderCheckoutItems(){
  const cot = document.getElementById('checkout-items');
  cot.innerHTML = "";
  const items = state.checkoutContext?.items || [];
  if(items.length === 0){
    cot.innerHTML = "<div style='color:var(--muted)'>Tidak ada item untuk checkout.</div>";
  } else {
    items.forEach(it=>{
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap='10px';
      row.style.marginBottom='10px';
      row.style.alignItems='center';
      row.innerHTML = `
        <img src="${it.image}" style="width:56px;height:56px;object-fit:cover;border-radius:8px" />
        <div style="flex:1">
          <div style="font-weight:700">${it.title}</div>
          <div style="color:var(--muted);font-size:13px">${rupiah(it.price)} × ${it.qty}</div>
        </div>
      `;
      cot.appendChild(row);
    });
  }
  const subtotal = (state.checkoutContext?.items || []).reduce((s,i)=> s + i.price * i.qty, 0);
  document.getElementById('co-subtotal').textContent = rupiah(subtotal);
}
document.getElementById('checkout-city').addEventListener('change', updateCheckoutTotals);
function updateCheckoutTotals(){
  const city = document.getElementById('checkout-city').value;
  const ship = shippingForCity(city);
  const subtotal = (state.checkoutContext?.items || []).reduce((s,i)=> s + i.price * i.qty, 0);
  document.getElementById('co-shipping').textContent = rupiah(ship.cost);
  document.getElementById('co-estimate-days').textContent = ship.days;
  document.getElementById('co-subtotal').textContent = rupiah(subtotal);
  document.getElementById('co-total').textContent = rupiah(subtotal + ship.cost);
}
document.getElementById('place-order').addEventListener('click', async ()=>{
  const name = document.getElementById('checkout-name').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim();
  const address = document.getElementById('checkout-address').value.trim();
  const city = document.getElementById('checkout-city').value;
  if(!name || !phone || !address) return alert("Mohon isi nama, telepon, dan alamat pengiriman.");

  const items = state.checkoutContext.items;
  const subtotal = items.reduce((s,i)=> s + i.price * i.qty, 0);
  const ship = shippingForCity(city);
  const total = subtotal + ship.cost;

  try {
    // Kirim data ke server Python kamu
    const response = await fetch("http://127.0.0.1:5000/create_transaction", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        name, phone, address, city,
        total: total
      })
    });

    const data = await response.json();

    if (!data.token) {
      alert("Gagal membuat transaksi: " + JSON.stringify(data));
      return;
    }

    // Buka popup pembayaran Midtrans
    snap.pay(data.token, {
      onSuccess: function(result){
        alert("Pembayaran Sukses!");
        console.log(result);
      },
      onPending: function(result){
        alert("Pembayaran pending (belum dibayar)");
        console.log(result);
      },
      onError: function(result){
        alert("Terjadi kesalahan pembayaran");
        console.log(result);
      },
      onClose: function(){
        console.log("Popup ditutup tanpa pembayaran");
      }
    });

  } catch (error) {
    alert("Terjadi error saat menghubungkan ke server Midtrans.");
    console.error(error);
  }
});
document.getElementById('close-checkout').addEventListener('click', ()=>{
  document.getElementById('checkout-modal').classList.remove('active');
});
document.getElementById('checkout-cancel').addEventListener('click', ()=>{
  document.getElementById('checkout-modal').classList.remove('active');
});

/* ---------- FILTER ---------- */
document.getElementById('filter-sale').addEventListener('click', function(){
  const active = this.classList.toggle('active');
  if(active){ state.products = PRODUCTS.filter(p=>p.sale); }
  else { state.products = PRODUCTS.slice(); }
  renderProducts();
});
document.getElementById('filter-new').addEventListener('click', function(){
  const active = this.classList.toggle('active');
  if(active){ state.products = state.products.filter(p=>p.newItem); }
  else { state.products = PRODUCTS.slice(); }
  renderProducts();
});

/* ---------- NAVIGATION ---------- */
document.getElementById('nav-home').addEventListener('click', ()=>{
  document.getElementById('hero').scrollIntoView({behavior:'smooth'});
  document.getElementById('contact-section').style.display = 'none';
});
document.getElementById('nav-collection').addEventListener('click', ()=>{
  document.getElementById('product-grid').scrollIntoView({behavior:'smooth'});
  document.getElementById('contact-section').style.display = 'none';
});
document.getElementById('nav-contact').addEventListener('click', ()=>{
  document.getElementById('contact-section').style.display = 'block';
  document.getElementById('contact-section').scrollIntoView({behavior:'smooth'});
});

/* ---------- CONTACT FORM ---------- */
document.getElementById('contact-send').addEventListener('click', ()=>{
  const name = document.getElementById('contact-name').value.trim();
  const info = document.getElementById('contact-email').value.trim();
  const msg = document.getElementById('contact-msg').value.trim();
  if(!name || !info || !msg) return alert("Mohon isi semua kolom.");
  alert("Terima kasih, pesan Anda telah terkirim (simulasi).");
  document.getElementById('contact-name').value='';
  document.getElementById('contact-email').value='';
  document.getElementById('contact-msg').value='';
});
document.getElementById('contact-clear').addEventListener('click', ()=>{
  document.getElementById('contact-name').value='';
  document.getElementById('contact-email').value='';
  document.getElementById('contact-msg').value='';
});

/* ---------- SHOP NOW ---------- */
document.getElementById('shop-now').addEventListener('click', ()=>{
  state.category = "All";
  document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.cat-btn').forEach(b=>{
    if(b.dataset.cat==="All") b.classList.add('active');
  });
  renderProducts();
  document.getElementById('product-grid').scrollIntoView({behavior:'smooth'});
});

/* ---------- INIT ---------- */
function init(){
  renderCategoryButtons();
  renderProducts();
  renderCart();
  renderWishlistCount();
  renderWishlist();
  document.getElementById('year').textContent = new Date().getFullYear();
  window.addEventListener('focus', ()=>{
    if(!state.products || state.products.length === 0)
      state.products = PRODUCTS.slice();
    });
}
init();
