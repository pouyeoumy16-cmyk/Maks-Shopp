const products = [
 {id:1,name:"Boubou moderne",category:"Hommes",tag:"Pièce signature",price:25000,desc:"Une silhouette élégante inspirée du savoir-faire sénégalais.",image:"https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=85"},
 {id:2,name:"Sac artisanal en cuir",category:"Accessoires",tag:"Artisanat",price:18000,desc:"Un sac pratique au design intemporel.",image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85"},
 {id:3,name:"Bracelet traditionnel",category:"Accessoires",tag:"Petit prix",price:5000,desc:"Une touche originale inspirée des motifs locaux.",image:"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=85"},
 {id:4,name:"Chemise en tissu Wax",category:"Hommes",tag:"Coup de cœur",price:15000,desc:"Le mélange de la mode contemporaine et de la culture africaine.",image:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=85"},
 {id:5,name:"Sandales artisanales",category:"Chaussures",tag:"Confort",price:12000,desc:"Des sandales en cuir au style traditionnel.",image:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=85"},
 {id:6,name:"Ensemble femme africain",category:"Femmes",tag:"Édition élégante",price:22000,desc:"Une tenue pensée pour les fêtes et les cérémonies.",image:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=85"}
];
const money = n => new Intl.NumberFormat('fr-FR').format(n) + " FCFA";
let cart = [];
let activeFilter = "Tout";
let searchTerm = "";
const $ = id => document.getElementById(id);

function renderProducts(){
 const list = products.filter(p => (activeFilter==="Tout" || p.category===activeFilter) && (p.name.toLowerCase().includes(searchTerm) || p.desc.toLowerCase().includes(searchTerm)));
 $("productGrid").innerHTML = list.map(p=>`<article class="product-card">
   <div class="product-image-wrap"><img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.style.background='linear-gradient(135deg,#e7d8ca,#9b6c5d)'"><span class="product-badge">${p.tag}</span><button class="quick-add" data-add="${p.id}">Ajouter au panier　＋</button></div>
   <div class="product-info"><div><p class="product-category">${p.category}</p><h3>${p.name}</h3><p class="product-desc">${p.desc}</p></div><div class="product-price">${money(p.price)}</div></div>
 </article>`).join("");
 $("emptyState").hidden = list.length > 0;
}
function setFilter(filter){
 activeFilter=filter;
 document.querySelectorAll(".filter-tab").forEach(b=>b.classList.toggle("active",b.dataset.filter===filter));
 renderProducts();
}
function addToCart(id){
 const item=cart.find(x=>x.id===id);
 if(item)item.qty++;else cart.push({id,qty:1});
 renderCart();showToast("Produit ajouté au panier");
}
function updateQty(id,delta){
 const item=cart.find(x=>x.id===id);if(!item)return;
 item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
 renderCart();
}
function renderCart(){
 const count=cart.reduce((s,x)=>s+x.qty,0);
 const total=cart.reduce((s,x)=>s+x.qty*products.find(p=>p.id===x.id).price,0);
 $("cartCount").textContent=count;$("drawerCount").textContent=`(${count})`;$("cartSubtotal").textContent=money(total);$("checkoutTotal").textContent=money(total);
 $("cartItems").innerHTML=cart.map(x=>{const p=products.find(z=>z.id===x.id);return `<div class="cart-line"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><p>${money(p.price)}</p><div class="qty-controls"><button data-qty="${p.id}" data-delta="-1" aria-label="Diminuer">−</button><span>${x.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Augmenter">+</button></div></div><button class="remove-item" data-remove="${p.id}" aria-label="Retirer">×</button></div>`}).join("");
 $("cartEmpty").style.display=count?"none":"block";$("cartSummary").style.display=count?"block":"none";
}
function showToast(msg){$("toast").textContent=msg;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2300)}
function openCart(){ $("overlay").classList.add("open");$("cartDrawer").classList.add("open");$("cartDrawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closePanels(){ $("overlay").classList.remove("open");$("cartDrawer").classList.remove("open");$("checkoutModal").classList.remove("open");$("cartDrawer").setAttribute("aria-hidden","true");document.body.style.overflow=""}
function openCheckout(){if(!cart.length){showToast("Ajoutez un produit avant de continuer.");return}$("cartDrawer").classList.remove("open");$("checkoutModal").classList.add("open");$("orderSuccess").hidden=true;$("checkoutForm").hidden=false}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add)addToCart(Number(add.dataset.add));
 const filter=e.target.closest("[data-filter]");if(filter)setFilter(filter.dataset.filter);
 const qty=e.target.closest("[data-qty]");if(qty)updateQty(Number(qty.dataset.qty),Number(qty.dataset.delta));
 const remove=e.target.closest("[data-remove]");if(remove){cart=cart.filter(x=>x.id!==Number(remove.dataset.remove));renderCart()}
 const navFilter=e.target.closest("[data-filter-link]");if(navFilter){setFilter(navFilter.dataset.filterLink);$("mainNav").classList.remove("open")}
});
$("cartOpen").addEventListener("click",openCart);$("cartClose").addEventListener("click",closePanels);$("overlay").addEventListener("click",closePanels);$("continueShopping").addEventListener("click",closePanels);$("checkoutOpen").addEventListener("click",openCheckout);$("checkoutClose").addEventListener("click",()=>{$("checkoutModal").classList.remove("open");$("cartDrawer").classList.add("open")});$("successClose").addEventListener("click",()=>{cart=[];renderCart();closePanels();renderProducts()});
$("searchToggle").addEventListener("click",()=>{$("searchBox").classList.toggle("visible");if($("searchBox").classList.contains("visible"))$("searchInput").focus()});
$("searchInput").addEventListener("input",e=>{searchTerm=e.target.value.trim().toLowerCase();renderProducts()});
$("menuToggle").addEventListener("click",()=>$("mainNav").classList.toggle("open"));
$("newsletterForm").addEventListener("submit",e=>{e.preventDefault();$("newsletterMessage").textContent="Merci ! Cette inscription est une démonstration.";e.target.reset()});
$("checkoutForm").addEventListener("submit",e=>{
 e.preventDefault();const data=new FormData(e.target);const total=cart.reduce((s,x)=>s+x.qty*products.find(p=>p.id===x.id).price,0);
 const recap=cart.map(x=>`${x.qty} × ${products.find(p=>p.id===x.id).name}`).join(", ");
 $("successText").textContent=`Merci ${data.get("name")} ! Récapitulatif de démonstration : ${recap}. Total des produits : ${money(total)}. Aucun paiement ni envoi de commande n’a été effectué.`;
 $("checkoutForm").hidden=true;$("orderSuccess").hidden=false;
});
$("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
