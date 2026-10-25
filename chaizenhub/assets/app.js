const IC={
pulsa:'<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
"paket-data":'<path d="M4 20V14M9 20V10M14 20V6M19 20V3"/>',
"e-wallet":'<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18M16 15h2"/>',
pln:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
pdam:'<path d="M12 3s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12z"/>',
"tv-internet":'<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8"/>',
game:'<path d="M6 9h12a4 4 0 0 1 3.8 5.3l-.8 2.4a2.5 2.5 0 0 1-4.3.7L15 16H9l-1.7 1.4a2.5 2.5 0 0 1-4.3-.7l-.8-2.4A4 4 0 0 1 6 9zM8 12v3M6.5 13.5h3"/>',
bpjs:'<path d="M12 21s-8-4.5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6.5-8 11-8 11z"/><path d="M12 9v5M9.5 11.5h5"/>',
multifinance:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h6"/>'};
const svg=(k,c="w-6 h-6")=>`<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${IC[k]}</svg>`;
const L=a=>a.map(([n,p])=>[n.toLocaleString("id-ID"),p]);
const D={
pulsa:{t:"Pulsa",c:"Isi ulang",d:"Semua operator. Operator terdeteksi otomatis dari nomormu.",inp:"Nomor HP",ph:"08xx xxxx xxxx",auto:1,prov:["Telkomsel","Indosat","XL","Axis","Tri","Smartfren"],byp:{
Telkomsel:L([[5000,6200],[10000,11000],[20000,20900],[25000,25800],[50000,50800],[100000,100200]]),
Indosat:L([[5000,6900],[10000,12000],[20000,21200],[25000,26000],[50000,51200],[100000,100500]]),
XL:L([[5000,6800],[10000,11800],[25000,26200],[50000,51400],[100000,101200]]),
Axis:L([[5000,6800],[10000,11500],[25000,26000],[50000,51200],[100000,101000]]),
Tri:L([[5000,6500],[10000,12300],[20000,21300],[25000,26300],[50000,51000],[100000,100800]]),
Smartfren:L([[5000,6000],[10000,11000],[20000,21200],[25000,26000],[50000,51500],[100000,100900]])}},
"paket-data":{t:"Paket Data",c:"Isi ulang",d:"Kuota harian sampai bulanan. Operator terdeteksi otomatis.",inp:"Nomor HP",ph:"08xx xxxx xxxx",auto:1,prov:["Telkomsel","Indosat","XL","Axis","Tri","Smartfren"],items:[["Harian 1GB · 1 hari",5500],["Mingguan 5GB · 7 hari",22000],["Bulanan 15GB · 30 hari",65000],["Bulanan 30GB · 30 hari",98000]]},
"e-wallet":{t:"E-Wallet",c:"Isi ulang",d:"Top up DANA, OVO, GoPay, ShopeePay, LinkAja.",inp:"Nomor terdaftar",ph:"08xx xxxx xxxx",prov:["DANA","OVO","GoPay","ShopeePay","LinkAja"],items:L([[20000,21500],[50000,51500],[100000,101500],[200000,201500],[500000,501500]])},
pln:{t:"Token PLN",c:"Tagihan",d:"Token prabayar, langsung muncul 20 digit.",inp:"Nomor meter",ph:"11 atau 12 digit",prov:["PLN Prabayar"],items:[["Token 20.000",22500],["Token 50.000",52500],["Token 100.000",102500],["Token 200.000",202500],["Token 500.000",502500]]},
pdam:{t:"PDAM",c:"Tagihan",d:"Bayar air bulanan tanpa antre.",inp:"ID pelanggan",ph:"Nomor pelanggan",prov:["PDAM Jakarta","PDAM Bandung","PDAM Surabaya","PDAM lainnya"],bill:1},
"tv-internet":{t:"TV & Internet",c:"Tagihan",d:"IndiHome, Biznet, First Media dan lainnya.",inp:"ID pelanggan",ph:"Nomor pelanggan",prov:["IndiHome","Biznet","First Media","MyRepublic","Transvision"],bill:1},
game:{t:"Top Up Game",c:"Hiburan",d:"Diamond & UC masuk dalam hitungan detik.",inp:"User ID (Zone ID)",ph:"12345678 (1234)",prov:["Mobile Legends","Free Fire","PUBG Mobile"],byp:{
"Mobile Legends":[["86 Diamonds",24500],["172 Diamonds",48500],["257 Diamonds",72000],["344 Diamonds",97000],["706 Diamonds",198000],["Weekly Diamond Pass",34900]],
"Free Fire":[["70 Diamonds",10900],["140 Diamonds",21500],["355 Diamonds",51000],["720 Diamonds",101000],["1450 Diamonds",196000]],
"PUBG Mobile":[["60 UC",17500],["325 UC",80500],["660 UC",167000]]}},
bpjs:{t:"BPJS Kesehatan",c:"Tagihan",d:"Iuran per bulan sesuai kelas.",inp:"Nomor VA BPJS",ph:"88888xxxxxxxxxx",prov:["Kelas 1","Kelas 2","Kelas 3"],byp:{"Kelas 1":[["1 bulan",152500],["2 bulan",302500],["3 bulan",452500]],"Kelas 2":[["1 bulan",102500],["2 bulan",202500],["3 bulan",302500]],"Kelas 3":[["1 bulan",37500],["2 bulan",72500],["3 bulan",107500]]}},
multifinance:{t:"Multifinance",c:"Tagihan",d:"Angsuran motor & elektronik.",inp:"Nomor kontrak",ph:"Nomor kontrak",prov:["Adira","FIF","BAF","WOM Finance","Home Credit"],bill:1}};
const OP={Telkomsel:["0811","0812","0813","0821","0822","0823","0851","0852","0853"],Indosat:["0814","0815","0816","0855","0856","0857","0858"],XL:["0817","0818","0819","0859","0877","0878"],Axis:["0831","0832","0833","0838"],Tri:["0895","0896","0897","0898","0899"],Smartfren:["0881","0882","0883","0884","0885","0886","0887","0888","0889"]};
const rp=n=>"Rp"+Math.round(n).toLocaleString("id-ID");
const LOGO=`<a href="/" class="flex items-center gap-2 shrink-0"><svg width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#930500"/><path d="M21.5 11.2A7 7 0 1 0 21.5 20.8" fill="none" stroke="#FFF8E7" stroke-width="3.6" stroke-linecap="round"/><circle cx="23" cy="16" r="2.6" fill="#F3CFC9"/></svg><span class="disp font-extrabold text-[1.35rem] tracking-tight">chaizenhub<span class="text-[#930500]">.</span></span></a>`;
function shell(active,{hideFootMobile}={}){
 const nav=[["/","Beranda"],["/#produk","Produk"],["/invoice","Cek Invoice"],["/bantuan","Bantuan"]];
 document.getElementById("hdr").innerHTML=`<header class="sticky top-0 z-50 border-b border-black/5 bg-[#FFF8E7]/85 backdrop-blur-xl"><div class="max-w-6xl mx-auto px-5 h-16 grid grid-cols-[1fr_auto_1fr] items-center gap-4"><div class="justify-self-start">${LOGO}</div><nav class="hidden md:flex gap-1 text-sm bg-white/70 border border-black/5 rounded-full p-1">${nav.map(([h,l])=>`<a href="${h}" class="px-4 py-2 rounded-full ${active==l?"bg-[#1E0A08] text-[#FFF8E7]":"mut hover:text-[#1E0A08]"}">${l}</a>`).join("")}</nav><span class="md:hidden"></span><div class="justify-self-end flex items-center gap-2"><a href="/#produk" class="hidden md:inline-block btn-lime rounded-full px-5 py-2.5 text-sm whitespace-nowrap">Top up</a><button id="mbtn" aria-label="Menu" class="md:hidden w-10 h-10 rounded-full bg-white border border-black/10 grid place-items-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 8h16M4 16h16"/></svg></button></div></div>
<div id="mnav" class="md:hidden hidden border-t border-black/5 px-5 py-4 bg-[#FFF8E7]"><div class="grid gap-1">${nav.map(([h,l])=>`<a href="${h}" class="px-4 py-3 rounded-2xl text-base font-medium ${active==l?"bg-[#1E0A08] text-[#FFF8E7]":"bg-white"}">${l}</a>`).join("")}</div><a href="/#produk" class="btn-lime block text-center rounded-2xl py-3.5 mt-3">Top up sekarang</a></div></header>`;
 document.getElementById("mbtn").onclick=()=>document.getElementById("mnav").classList.toggle("hidden");
 document.querySelectorAll("#mnav a").forEach(x=>x.onclick=()=>document.getElementById("mnav").classList.add("hidden"));
 const f=document.getElementById("ftr");if(!f)return;
 f.className=(hideFootMobile?"hidden md:block ":"")+"relative z-10 border-t border-black/5 mt-24";
 f.innerHTML=`<div class="max-w-6xl mx-auto px-5 py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]"><div>${LOGO}<p class="mut text-sm mt-4 max-w-xs">Pusat top up & bayar tagihan digital. Cepat, transparan, tanpa daftar akun.</p></div><div class="text-sm space-y-2.5"><p class="font-semibold mb-3">Produk</p>${Object.entries(D).slice(0,5).map(([k,v])=>`<a class="block mut hover:text-[#1E0A08]" href="/produk?s=${k}">${v.t}</a>`).join("")}</div><div class="text-sm space-y-2.5"><p class="font-semibold mb-3">Bantuan</p><a class="block mut hover:text-[#1E0A08]" href="/invoice">Cek invoice</a><a class="block mut hover:text-[#1E0A08]" href="/bantuan">Pusat bantuan</a><a class="block mut hover:text-[#1E0A08]" href="/bantuan#kontak">Kontak</a></div></div><div class="max-w-6xl mx-auto px-5 pb-8 text-xs mut flex flex-wrap justify-between gap-2"><span>© 2026 Chaizenhub</span><span>QRIS · Virtual Account · E-Wallet · Minimarket</span></div>`;
}
