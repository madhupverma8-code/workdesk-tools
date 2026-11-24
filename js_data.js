/* ============================================================
   WorkDesk Tools — Data (Part 1)
   Categories + Tool Registry (Finance, Math, Units)
   Part 2 neeche add karna hai — file ek hi rahegi
============================================================ */

const CATEGORIES = [
  { key:'finance',  label:'Finance & Wealth',      color:'#10b981', dot:'emerald' },
  { key:'math',     label:'Math & Study',           color:'#8b5cf6', dot:'violet' },
  { key:'units',    label:'Units & Converters',     color:'#06b6d4', dot:'cyan' },
  { key:'daily',    label:'Daily Life & Utilities', color:'#f97316', dot:'orange' },
  { key:'business', label:'Business & Shop',        color:'#3b82f6', dot:'blue' },
  { key:'health',   label:'Health & Fitness',       color:'#ec4899', dot:'pink' },
  { key:'loan',     label:'Loan & EMI',             color:'#6366f1', dot:'indigo' },
  { key:'tax',      label:'Tax & GST',              color:'#f43f5e', dot:'rose' },
  { key:'hr',       label:'HR Salary Slip',         color:'#14b8a6', dot:'teal' },
  { key:'all',      label:'All Tools',              color:'#a855f7', dot:'fuchsia' },
];

const TOOL_REGISTRY = [

  /* ============================================================
     FINANCE & WEALTH
  ============================================================ */
  { cat:'finance', id:'fin-emi', title:'Loan EMI', desc:'Monthly EMI, total interest & payable.',
    inputs:[
      {id:'p',label:'Loan Amount (₹)',type:'number',def:500000,step:1000,min:0},
      {id:'r',label:'Annual Interest (%)',type:'number',def:10.5,step:0.1,min:0},
      {id:'n',label:'Tenure (Months)',type:'number',def:36,step:1,min:1},
    ],
    calc:(v)=>{ const P=Math.max(0,v.p),r=Math.max(0,v.r)/12/100,n=Math.max(1,Math.round(v.n));
      const emi=r===0?P/n:(P*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1); const tot=emi*n;
      return { out:[
        {label:'Monthly EMI',value:inr(emi),big:true,money:true},
        {label:'Total Interest',value:inr(tot-P),money:true},
        {label:'Total Payable',value:inr(tot),money:true},
      ]};
    }},
  { cat:'finance', id:'fin-sici', title:'Simple & Compound Interest', desc:'SI & CI with compounding frequency.',
    inputs:[
      {id:'p',label:'Principal (₹)',type:'number',def:100000,step:1000,min:0},
      {id:'r',label:'Rate (% p.a.)',type:'number',def:8,step:0.1,min:0},
      {id:'t',label:'Time (Years)',type:'number',def:3,step:0.5,min:0.1},
      {id:'freq',label:'CI Frequency',type:'select',def:'1',opts:[['1','Yearly'],['2','Half-Yearly'],['4','Quarterly'],['12','Monthly']]},
    ],
    calc:(v)=>{ const P=Math.max(0,v.p),R=Math.max(0,v.r),T=Math.max(0,v.t),f=Math.max(1,parseInt(v.freq,10)||1);
      const si=(P*R*T)/100; const ciTot=P*Math.pow(1+R/100/f,f*T);
      return { out:[
        {label:'Simple Interest',value:inr(si),money:true},
        {label:'SI Maturity',value:inr(P+si),money:true},
        {label:'Compound Interest',value:inr(ciTot-P),big:true,money:true},
        {label:'CI Maturity',value:inr(ciTot),money:true},
      ]};
    }},
  { cat:'finance', id:'fin-fd', title:'FD Maturity', desc:'Fixed deposit maturity & quarterly interest.',
    inputs:[
      {id:'p',label:'Deposit (₹)',type:'number',def:200000,step:1000,min:0},
      {id:'r',label:'Rate (% p.a.)',type:'number',def:7.2,step:0.1,min:0},
      {id:'y',label:'Years',type:'number',def:5,step:0.5,min:0.1},
    ],
    calc:(v)=>{ const P=Math.max(0,v.p),R=Math.max(0,v.r),Y=Math.max(0,v.y);
      const mat=P*Math.pow(1+R/100/4,4*Y);
      return { out:[
        {label:'Interest Earned',value:inr(mat-P),money:true},
        {label:'Maturity Value',value:inr(mat),big:true,money:true},
      ]};
    }},
  { cat:'finance', id:'fin-rd', title:'RD Maturity', desc:'Recurring deposit interest & maturity.',
    inputs:[
      {id:'m',label:'Monthly Deposit (₹)',type:'number',def:5000,step:500,min:0},
      {id:'r',label:'Rate (% p.a.)',type:'number',def:7,step:0.1,min:0},
      {id:'n',label:'Tenure (Months)',type:'number',def:24,step:1,min:1},
    ],
    calc:(v)=>{ const M=Math.max(0,v.m),R=Math.max(0,v.r),n=Math.max(1,Math.round(v.n));
      const i=R/100/12; const mat=i===0?M*n:M*((Math.pow(1+i,n)-1)/i)*(1+i);
      return { out:[
        {label:'Total Invested',value:inr(M*n),money:true},
        {label:'Estimated Interest',value:inr(mat-M*n),money:true},
        {label:'Maturity Value',value:inr(mat),big:true,money:true},
      ]};
    }},
  { cat:'finance', id:'fin-sip', title:'SIP Return', desc:'Monthly SIP wealth projection.',
    inputs:[
      {id:'m',label:'Monthly SIP (₹)',type:'number',def:10000,step:500,min:0},
      {id:'r',label:'Expected Return (% p.a.)',type:'number',def:12,step:0.5,min:0},
      {id:'y',label:'Years',type:'number',def:10,step:1,min:1},
    ],
    calc:(v)=>{ const M=Math.max(0,v.m),R=Math.max(0,v.r),Y=Math.max(1,v.y);
      const n=Math.round(Y*12), i=R/100/12;
      const tot=i===0?M*n:M*((Math.pow(1+i,n)-1)/i)*(1+i);
      return { out:[
        {label:'Invested Amount',value:inr(M*n),money:true},
        {label:'Est. Returns',value:inr(tot-M*n),money:true},
        {label:'Total Value',value:inr(tot),big:true,money:true},
      ]};
    }},
  { cat:'finance', id:'fin-lump', title:'Lumpsum Return', desc:'One-time investment future value.',
    inputs:[
      {id:'p',label:'Investment (₹)',type:'number',def:150000,step:5000,min:0},
      {id:'r',label:'Expected Return (% p.a.)',type:'number',def:12,step:0.5,min:0},
      {id:'y',label:'Years',type:'number',def:8,step:0.5,min:0.5},
    ],
    calc:(v)=>{ const P=Math.max(0,v.p),R=Math.max(0,v.r),Y=Math.max(0,v.y);
      const tot=P*Math.pow(1+R/100,Y);
      return { out:[
        {label:'Estimated Gain',value:inr(tot-P),money:true},
        {label:'Maturity Value',value:inr(tot),big:true,money:true},
      ]};
    }},
  { cat:'finance', id:'fin-gst', title:'GST Add / Remove', desc:'Add or extract GST from an amount.',
    inputs:[
      {id:'amt',label:'Amount (₹)',type:'number',def:10000,step:100,min:0},
      {id:'rate',label:'GST Rate (%)',type:'select',def:'18',opts:[['5','5%'],['12','12%'],['18','18%'],['28','28%']]},
      {id:'mode',label:'Mode',type:'select',def:'add',opts:[['add','Add (Exclusive)'],['remove','Remove (Inclusive)']]},
    ],
    calc:(v)=>{ const amt=Math.max(0,v.amt), rate=Math.max(0,parseFloat(v.rate)||0);
      let base,tax,gross;
      if(v.mode==='add'){ base=amt; tax=base*rate/100; gross=base+tax; }
      else { gross=amt; base=gross/(1+rate/100); tax=gross-base; }
      return { out:[
        {label:'Net Base Price',value:inr(base),money:true},
        {label:'GST Component',value:inr(tax),money:true},
        {label:'Gross Total',value:inr(gross),big:true,money:true},
      ]};
    }},
  { cat:'finance', id:'fin-disc', title:'Discount & Net Price', desc:'Discount savings & final price.',
    inputs:[
      {id:'orig',label:'Original Price (₹)',type:'number',def:4999,step:100,min:0},
      {id:'pct',label:'Discount (%)',type:'number',def:15,step:1,min:0,max:100},
    ],
    calc:(v)=>{ const o=Math.max(0,v.orig), p=Math.min(100,Math.max(0,v.pct));
      const save=o*p/100;
      return { out:[
        {label:'You Save',value:inr(save),money:true},
        {label:'Net Price',value:inr(o-save),big:true,money:true},
      ]};
    }},
  { cat:'finance', id:'fin-cagr', title:'CAGR', desc:'Compound annual growth rate.',
    inputs:[
      {id:'s',label:'Beginning Value (₹)',type:'number',def:100000,step:1000,min:0.01},
      {id:'e',label:'Ending Value (₹)',type:'number',def:250000,step:1000,min:0},
      {id:'y',label:'Years',type:'number',def:5,step:0.5,min:0.1},
    ],
    calc:(v)=>{ const s=Math.max(0.01,v.s), e=Math.max(0,v.e), y=Math.max(0.1,v.y);
      const cagr=(Math.pow(e/s,1/y)-1)*100;
      return { out:[
        {label:'Annualized Growth Rate (CAGR)',value:cagr.toFixed(2)+'%',big:true},
      ]};
    }},
  { cat:'finance', id:'fin-prepay', title:'Loan Prepayment', desc:'Interest & tenure saved on prepayment.',
    inputs:[
      {id:'p',label:'Outstanding Loan (₹)',type:'number',def:1000000,step:10000,min:0},
      {id:'r',label:'Interest Rate (%)',type:'number',def:9.5,step:0.1,min:0},
      {id:'n',label:'Remaining Months',type:'number',def:120,step:1,min:1},
      {id:'pre',label:'Prepayment Now (₹)',type:'number',def:150000,step:10000,min:0},
    ],
    calc:(v)=>{ const P=Math.max(0,v.p), r=Math.max(0,v.r)/12/100, n=Math.max(1,Math.round(v.n)), pre=Math.min(P,Math.max(0,v.pre));
      const emi = r===0? P/n : (P*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
      const origInt = emi*n-P, newP = Math.max(0,P-pre);
      if(newP===0||emi<=newP*r) return { out:[
        {label:'Est. Interest Saved',value:inr(origInt),big:true,money:true},
        {label:'Tenure Saved',value:n+' months'},
      ]};
      const newN = r===0? Math.ceil(newP/emi) : Math.ceil(Math.log(emi/(emi-newP*r))/Math.log(1+r));
      const newInt = Math.max(0,emi*newN-newP);
      return { out:[
        {label:'Est. Interest Saved',value:inr(Math.max(0,origInt-newInt)),big:true,money:true},
        {label:'Tenure Saved',value:Math.max(0,n-newN)+' months'},
      ]};
    }},
  { cat:'finance', id:'fin-salary', title:'Salary Take-Home & OT', desc:'Take-home with overtime pay.',
    inputs:[
      {id:'gross',label:'Monthly Gross (₹)',type:'number',def:30000,step:500,min:0},
      {id:'ded',label:'PF + Deductions (₹)',type:'number',def:2400,step:100,min:0},
      {id:'othrs',label:'OT Hours',type:'number',def:10,step:0.5,min:0},
      {id:'otrate',label:'OT Rate / Hr (₹)',type:'number',def:150,step:10,min:0},
    ],
    calc:(v)=>{ const g=Math.max(0,v.gross), d=Math.max(0,v.ded), oh=Math.max(0,v.othrs), or=Math.max(0,v.otrate);
      const ot=oh*or;
      return { out:[
        {label:'Overtime Pay',value:inr(ot),money:true},
        {label:'Est. Take-Home',value:inr(g+ot-d),big:true,money:true},
      ]};
    }},
  { cat:'finance', id:'fin-goal', title:'Goal SIP Calculator', desc:'Monthly SIP needed to reach a goal.',
    inputs:[
      {id:'goal',label:'Goal Amount (₹)',type:'number',def:1000000,step:10000,min:0},
      {id:'r',label:'Expected Return (% p.a.)',type:'number',def:12,step:0.5,min:0},
      {id:'y',label:'Years to Goal',type:'number',def:10,step:1,min:1},
    ],
    calc:(v)=>{ const G=Math.max(0,v.goal), R=Math.max(0,v.r), Y=Math.max(1,v.y);
      const n=Math.round(Y*12), i=R/100/12;
      const sip = i===0 ? G/n : G / (((Math.pow(1+i,n)-1)/i)*(1+i));
      return { out:[
        {label:'Monthly SIP Needed',value:inr(sip),big:true,money:true},
        {label:'Total Invested',value:inr(sip*n),money:true},
      ]};
    }},
  { cat:'finance', id:'fin-ppf', title:'PPF Maturity', desc:'Public Provident Fund maturity estimate.',
    inputs:[
      {id:'y',label:'Yearly Deposit (₹)',type:'number',def:150000,step:5000,min:0},
      {id:'r',label:'Rate (% p.a.)',type:'number',def:7.1,step:0.1,min:0},
      {id:'yrs',label:'Years',type:'number',def:15,step:1,min:1},
    ],
    calc:(v)=>{ const Y=Math.max(0,v.y), R=Math.max(0,v.r), n=Math.max(1,v.yrs);
      const i=R/100; let bal=0;
      for(let k=0;k<n;k++){ bal=(bal+Y)*(1+i); }
      return { out:[
        {label:'Total Invested',value:inr(Y*n),money:true},
        {label:'Interest Earned',value:inr(bal-Y*n),money:true},
        {label:'Maturity Value',value:inr(bal),big:true,money:true},
      ]};
    }},
  { cat:'finance', id:'fin-inflation', title:'Inflation Impact', desc:'Future cost & present value.',
    inputs:[
      {id:'amt',label:'Current Amount (₹)',type:'number',def:100000,step:1000,min:0},
      {id:'r',label:'Inflation (% p.a.)',type:'number',def:6,step:0.1,min:0},
      {id:'y',label:'Years',type:'number',def:10,step:1,min:1},
    ],
    calc:(v)=>{ const A=Math.max(0,v.amt), R=Math.max(0,v.r), Y=Math.max(0,v.y);
      const fut=A*Math.pow(1+R/100,Y);
      const pv=A/Math.pow(1+R/100,Y);
      return { out:[
        {label:'Future Cost of Same Goods',value:inr(fut),big:true,money:true},
        {label:'Present Value of Future Amount',value:inr(pv),money:true},
      ]};
    }},

  /* ============================================================
     MATH & STUDY
  ============================================================ */
  { cat:'math', id:'math-pct', title:'Percentage & Marks', desc:'Marks % and approximate CGPA.',
    inputs:[
      {id:'o',label:'Obtained',type:'number',def:435,step:1,min:0},
      {id:'t',label:'Total',type:'number',def:500,step:1,min:1},
    ],
    calc:(v)=>{ const o=num(v.o), t=Math.max(1,num(v.t)); const p=o/t*100;
      return { out:[
        {label:'Percentage',value:p.toFixed(2)+'%',big:true},
        {label:'Approx CGPA (÷9.5)',value:(p/9.5).toFixed(2)},
      ]};
    }},
  { cat:'math', id:'math-chg', title:'Percentage Change', desc:'Increase or decrease %.',
    inputs:[
      {id:'old',label:'Old Value',type:'number',def:800,step:1},
      {id:'new',label:'New Value',type:'number',def:1000,step:1},
    ],
    calc:(v)=>{ const a=num(v.old), b=num(v.new); const diff=b-a; const pct=a===0?0:diff/a*100;
      return { out:[
        {label:'Absolute Difference',value:fmt(diff)},
        {label:'Percentage Change',value:pct.toFixed(2)+'%',big:true},
      ]};
    }},
  { cat:'math', id:'math-ratio', title:'Ratio & Proportion', desc:'Solve A : B = C : x.',
    inputs:[
      {id:'a',label:'A',type:'number',def:2,step:0.1},
      {id:'b',label:'B',type:'number',def:5,step:0.1},
      {id:'c',label:'C',type:'number',def:10,step:0.1},
    ],
    calc:(v)=>{ const x = v.a===0? NaN : (v.b*v.c)/v.a;
      return { out:[
        {label:'Missing Value (x)',value: isFinite(x)? fmt(x) : 'Undefined',big:true},
      ]};
    }},
  { cat:'math', id:'math-avg', title:'Average / Mean / Median', desc:'Mean, median, sum & count.',
    inputs:[
      {id:'nums',label:'Numbers (comma separated)',type:'text',def:'12, 18, 25, 30, 40'},
    ],
    calc:(v)=>{ const arr=String(v.nums).split(/[,\s]+/).map(parseFloat).filter(n=>!isNaN(n));
      if(!arr.length) return { out:[{label:'Result',value:'—'}]};
      const sum=arr.reduce((a,b)=>a+b,0), mean=sum/arr.length;
      const s=[...arr].sort((a,b)=>a-b);
      const med = s.length%2 ? s[(s.length-1)/2] : (s[s.length/2-1]+s[s.length/2])/2;
      return { out:[
        {label:'Mean',value:fmt(mean),big:true},
        {label:'Median',value:fmt(med)},
        {label:'Sum / Count',value:fmt(sum)+' / '+arr.length},
      ]};
    }},
  { cat:'math', id:'math-hcf', title:'HCF & LCM', desc:'GCD and LCM of two integers.',
    inputs:[
      {id:'a',label:'First Integer',type:'number',def:24,step:1},
      {id:'b',label:'Second Integer',type:'number',def:36,step:1},
    ],
    calc:(v)=>{ let a=Math.abs(Math.round(v.a)), b=Math.abs(Math.round(v.b));
      const g=(x,y)=>{ while(y){ [x,y]=[y,x%y]; } return x; };
      const hcf = (a&&b)? g(a,b) : Math.max(a,b);
      const lcm = (a&&b)? a*b/hcf : 0;
      return { out:[
        {label:'HCF / GCD',value:hcf,big:true},
        {label:'LCM',value:lcm,big:true},
      ]};
    }},
  { cat:'math', id:'math-pow', title:'Square / Cube / Roots', desc:'x², x³, √x, ∛x.',
    inputs:[{id:'x',label:'Number (x)',type:'number',def:16,step:0.1}],
    calc:(v)=>{ const x=v.x;
      return { out:[
        {label:'Square (x²)',value:fmt(x*x)},
        {label:'Cube (x³)',value:fmt(x*x*x)},
        {label:'√x',value: x>=0? fmt(Math.sqrt(x)) : 'Imaginary'},
        {label:'∛x',value:fmt(Math.cbrt(x))},
      ]};
    }},
  { cat:'math', id:'math-quad', title:'Quadratic Roots', desc:'Roots of ax² + bx + c = 0.',
    inputs:[
      {id:'a',label:'a',type:'number',def:1,step:0.1},
      {id:'b',label:'b',type:'number',def:-5,step:0.1},
      {id:'c',label:'c',type:'number',def:6,step:0.1},
    ],
    calc:(v)=>{ const a=v.a,b=v.b,c=v.c;
      if(a===0) return { out:[{label:'Not quadratic',value:'a cannot be 0'}]};
      const d=b*b-4*a*c;
      let roots;
      if(d>0){ const r1=(-b+Math.sqrt(d))/(2*a), r2=(-b-Math.sqrt(d))/(2*a);
        roots=`x₁ = ${fmt(r1)}, x₂ = ${fmt(r2)}`; }
      else if(d===0){ roots=`x = ${fmt(-b/(2*a))} (repeated)`; }
      else { const re=-b/(2*a), im=Math.sqrt(-d)/(2*a); roots=`x = ${fmt(re)} ± ${fmt(im)}i`; }
      return { out:[
        {label:'Discriminant (Δ)',value:fmt(d)},
        {label:'Roots',value:roots,big:true},
      ]};
    }},
  { cat:'math', id:'math-pyth', title:'Pythagoras', desc:'Hypotenuse c = √(a² + b²).',
    inputs:[
      {id:'a',label:'Side A',type:'number',def:3,step:0.1,min:0},
      {id:'b',label:'Side B',type:'number',def:4,step:0.1,min:0},
    ],
    calc:(v)=>{ const c=Math.sqrt(v.a*v.a+v.b*v.b);
      return { out:[
        {label:'Hypotenuse (c)',value:fmt(c),big:true},
      ]};
    }},
  { cat:'math', id:'math-geom', title:'2D / 3D Geometry', desc:'Area & volume of common shapes.',
    inputs:[
      {id:'shape',label:'Shape',type:'select',def:'circle',opts:[
        ['circle','Circle (r)'],
        ['rect','Rectangle (L, W)'],
        ['cube','Cube (side a)'],
        ['cylinder','Cylinder (r, h)'],
        ['sphere','Sphere (r)'],
      ]},
      {id:'d1',label:'Dim 1',type:'number',def:7,step:0.1,min:0},
      {id:'d2',label:'Dim 2',type:'number',def:10,step:0.1,min:0},
    ],
    calc:(v)=>{ const s=v.shape, a=v.d1, b=v.d2; let r='';
      if(s==='circle') r=`Area = ${fmt(Math.PI*a*a)}`;
      else if(s==='rect') r=`Area = ${fmt(a*b)}`;
      else if(s==='cube') r=`Volume = ${fmt(a**3)} • Surface = ${fmt(6*a*a)}`;
      else if(s==='cylinder') r=`Volume = ${fmt(Math.PI*a*a*b)} • Lateral = ${fmt(2*Math.PI*a*b)}`;
      else if(s==='sphere') r=`Volume = ${fmt(4/3*Math.PI*a**3)} • Surface = ${fmt(4*Math.PI*a*a)}`;
      return { out:[{label:'Result',value:r,big:true}]};
    }},
  { cat:'math', id:'math-sdt', title:'Speed – Distance – Time', desc:'Solve any one value.',
    inputs:[
      {id:'mode',label:'Solve For',type:'select',def:'speed',opts:[
        ['speed','Speed (km/h)'],
        ['distance','Distance (km)'],
        ['time','Time (h)'],
      ]},
      {id:'a',label:'Input A',type:'number',def:120,step:1},
      {id:'b',label:'Input B',type:'number',def:2,step:0.1},
    ],
    calc:(v)=>{ const m=v.mode; let r='';
      if(m==='speed') r=fmt(v.a/v.b)+' km/h';
      else if(m==='distance') r=fmt(v.a*v.b)+' km';
      else r=fmt(v.a/v.b)+' hours';
      return { out:[{label:'Result',value:r,big:true}]};
    }},
  { cat:'math', id:'math-apgp', title:'AP / GP Series', desc:'nth term & sum.',
    inputs:[
      {id:'a',label:'First Term (a)',type:'number',def:2,step:1},
      {id:'d',label:'AP Diff (d)',type:'number',def:3,step:1},
      {id:'r',label:'GP Ratio (r)',type:'number',def:2,step:0.1},
      {id:'n',label:'Terms (n)',type:'number',def:6,step:1,min:1},
    ],
    calc:(v)=>{ const a=v.a,d=v.d,r=v.r,n=v.n;
      const apn = a+(n-1)*d;
      const aps = n/2*(2*a+(n-1)*d);
      let gpn, gps;
      if(r===1){ gpn=a; gps=a*n; }
      else { gpn=a*Math.pow(r,n-1); gps=a*(Math.pow(r,n)-1)/(r-1); }
      return { out:[
        {label:'AP nth Term',value:fmt(apn)},
        {label:'AP Sum',value:fmt(aps)},
        {label:'GP nth Term',value:fmt(gpn)},
        {label:'GP Sum',value:fmt(gps)},
      ]};
    }},
  { cat:'math', id:'math-fact', title:'Factorial & nCr / nPr', desc:'Combinatorics helper.',
    inputs:[
      {id:'n',label:'n',type:'number',def:5,step:1,min:0},
      {id:'r',label:'r',type:'number',def:2,step:1,min:0},
    ],
    calc:(v)=>{ const n=Math.round(v.n), r=Math.round(v.r);
      const fact=(x)=>{ let f=1; for(let i=2;i<=x;i++) f*=i; return f; };
      const nCr = n>=r? fact(n)/(fact(r)*fact(n-r)) : NaN;
      const nPr = n>=r? fact(n)/fact(n-r) : NaN;
      return { out:[
        {label:'n! (Factorial)',value:fmt(fact(n))},
        {label:'nCr',value:fmt(nCr)},
        {label:'nPr',value:fmt(nPr)},
      ]};
    }},
  { cat:'math', id:'math-log', title:'Log Calculator', desc:'log base 10, ln & log base b.',
    inputs:[
      {id:'x',label:'Value (x)',type:'number',def:1000,step:0.1,min:0.0001},
      {id:'b',label:'Base',type:'number',def:10,step:1,min:1.0001},
    ],
    calc:(v)=>{ const x=v.x, b=v.b;
      return { out:[
        {label:'log₁₀(x)',value:fmt(Math.log10(x))},
        {label:'ln(x)',value:fmt(Math.log(x))},
        {label:`log_${b}(x)`,value:fmt(Math.log(x)/Math.log(b))},
      ]};
    }},

  /* ============================================================
     UNITS & CONVERTERS
  ============================================================ */
  { cat:'units', id:'unit-length', title:'Length', desc:'km, m, cm, mile, ft, inch.',
    type:'generic-unit', unitDef:{
      name:'Length',
      units:{ 'km':1000, 'm':1, 'cm':0.01, 'mm':0.001, 'mile':1609.344, 'yard':0.9144, 'foot':0.3048, 'inch':0.0254 },
    }},
  { cat:'units', id:'unit-weight', title:'Weight', desc:'kg, g, tonne, lb, oz.',
    type:'generic-unit', unitDef:{
      name:'Weight',
      units:{ 'tonne':1000000, 'quintal':100000, 'kg':1000, 'g':1, 'mg':0.001, 'lb':453.59237, 'oz':28.3495 },
    }},
  { cat:'units', id:'unit-land', title:'Area / Land (Bigha/Gaj)', desc:'Bigha, Gaj, SqFt, Acre, Hectare.',
    type:'land-converter' },
  { cat:'units', id:'unit-volume', title:'Volume', desc:'L, mL, m³, gallon, cup.',
    type:'generic-unit', unitDef:{
      name:'Volume',
      units:{ 'L':1, 'mL':0.001, 'm³':1000, 'cm³':0.001, 'US gal':3.78541, 'UK gal':4.54609, 'cup':0.24 },
    }},
  { cat:'units', id:'unit-temp', title:'Temperature', desc:'°C, °F, K.',
    type:'temp' },
  { cat:'units', id:'unit-time', title:'Time', desc:'sec, min, hr, day, week, year.',
    type:'generic-unit', unitDef:{
      name:'Time',
      units:{ 'second':1, 'minute':60, 'hour':3600, 'day':86400, 'week':604800, 'month':2629800, 'year':31557600 },
    }},
  { cat:'units', id:'unit-speed', title:'Speed', desc:'km/h, m/s, mph, knots.',
    type:'generic-unit', unitDef:{
      name:'Speed',
      units:{ 'km/h':1, 'm/s':3.6, 'mph':1.60934, 'knot':1.852 },
    }},
  { cat:'units', id:'unit-pressure', title:'Pressure', desc:'Pa, kPa, bar, PSI, atm.',
    type:'generic-unit', unitDef:{
      name:'Pressure',
      units:{ 'Pa':1, 'kPa':1000, 'bar':100000, 'PSI':6894.76, 'atm':101325 },
    }},
  { cat:'units', id:'unit-energy', title:'Energy', desc:'J, kJ, cal, kcal, kWh.',
    type:'generic-unit', unitDef:{
      name:'Energy',
      units:{ 'J':1, 'kJ':1000, 'cal':4.184, 'kcal':4184, 'Wh':3600, 'kWh':3600000 },
    }},
  { cat:'units', id:'unit-power', title:'Power', desc:'W, kW, HP.',
    type:'generic-unit', unitDef:{
      name:'Power',
      units:{ 'W':1, 'kW':1000, 'MW':1000000, 'HP (metric)':735.49875, 'HP (mech)':745.699872 },
    }},
  { cat:'units', id:'unit-data', title:'Data Storage', desc:'B, KB, MB, GB, TB.',
    type:'generic-unit', unitDef:{
      name:'Data Storage',
      units:{ 'Bit':0.125, 'Byte':1, 'KB':1000, 'MB':1e6, 'GB':1e9, 'TB':1e12, 'PB':1e15 },
    }},
  { cat:'units', id:'unit-angle', title:'Angle', desc:'deg, rad, gradian.',
    type:'generic-unit', unitDef:{
      name:'Angle',
      units:{ 'degree':1, 'radian':57.2958, 'gradian':0.9 },
    }},
  /* ============================================================
     DAILY LIFE & UTILITIES
  ============================================================ */
  { cat:'daily', id:'daily-age', title:'Age & Birthday', desc:'Exact age & next birthday.',
    inputs:[
      {id:'dob',label:'Date of Birth',type:'date',def:'1998-06-15'},
      {id:'ref',label:'Reference Date',type:'date',def:''},
    ],
    calc:(v)=>{ const dob=new Date(v.dob), ref=v.ref? new Date(v.ref) : new Date();
      if(isNaN(dob)||isNaN(ref)) return { out:[{label:'Result',value:'—'}]};
      let y=ref.getFullYear()-dob.getFullYear();
      let m=ref.getMonth()-dob.getMonth();
      let d=ref.getDate()-dob.getDate();
      if(d<0){ m--; const dim=new Date(ref.getFullYear(),ref.getMonth(),0).getDate(); d+=dim; }
      if(m<0){ y--; m+=12; }
      const nextB = new Date(ref.getFullYear(), dob.getMonth(), dob.getDate());
      if(nextB<ref) nextB.setFullYear(nextB.getFullYear()+1);
      const days = Math.ceil((nextB-ref)/86400000);
      return { out:[
        {label:'Exact Age',value:`${y} years, ${m} months, ${d} days`,big:true},
        {label:'Next Birthday Countdown',value:`${days} days`},
      ]};
    }},
  { cat:'daily', id:'daily-date', title:'Date Diff & +/- Days', desc:'Days between dates and shifted date.',
    inputs:[
      {id:'start',label:'Start Date',type:'date',def:''},
      {id:'end',label:'End Date',type:'date',def:''},
      {id:'add',label:'+/- Days from Start',type:'number',def:30,step:1},
    ],
    calc:(v)=>{ const s=new Date(v.start), e=new Date(v.end);
      let diff='—', shifted='—';
      if(!isNaN(s)&&!isNaN(e)){ diff=Math.round((e-s)/86400000)+' days'; }
      if(!isNaN(s)){ const ns=new Date(s); ns.setDate(ns.getDate()+Number(v.add)); shifted=ns.toISOString().slice(0,10); }
      return { out:[
        {label:'Days Between',value:diff,big:true},
        {label:'Shifted Date',value:shifted},
      ]};
    }},
  { cat:'daily', id:'daily-bmi', title:'BMI & Water / Calories', desc:'BMI, daily water & rough calories.',
    inputs:[
      {id:'wt',label:'Weight (kg)',type:'number',def:70,step:0.1,min:1},
      {id:'ht',label:'Height (cm)',type:'number',def:172,step:0.1,min:30},
      {id:'age',label:'Age (years)',type:'number',def:28,step:1,min:1},
    ],
    calc:(v)=>{ const w=v.wt, h=v.ht/100, a=v.age;
      const bmi = w/(h*h);
      let cat='Normal';
      if(bmi<18.5) cat='Underweight'; else if(bmi<25) cat='Normal'; else if(bmi<30) cat='Overweight'; else cat='Obese';
      const water = (w*35).toFixed(0)+' ml';
      const cal = Math.round((10*w + 6.25*(h*100) - 5*a + 5));
      return { out:[
        {label:'BMI & Category',value:bmi.toFixed(1)+' ('+cat+')',big:true},
        {label:'Daily Water',value:water},
        {label:'Est. Daily Calories',value:cal+' kcal'},
      ]};
    }},
  { cat:'daily', id:'daily-elec', title:'Electricity Bill / kWh', desc:'Appliance consumption & cost.',
    inputs:[
      {id:'w',label:'Power (Watts)',type:'number',def:1200,step:10,min:0},
      {id:'h',label:'Hours / Day',type:'number',def:4,step:0.5,min:0},
      {id:'d',label:'Days',type:'number',def:30,step:1,min:1},
      {id:'rate',label:'Rate / kWh (₹)',type:'number',def:7.5,step:0.1,min:0},
    ],
    calc:(v)=>{ const kwh = v.w*v.h*v.d/1000; const cost = kwh*v.rate;
      return { out:[
        {label:'Energy Consumed',value:kwh.toFixed(2)+' kWh'},
        {label:'Estimated Cost',value:inr(cost),big:true,money:true},
      ]};
    }},
  { cat:'daily', id:'daily-fuel', title:'Fuel Cost & Mileage', desc:'Fuel liters & trip cost.',
    inputs:[
      {id:'dist',label:'Trip Distance (km)',type:'number',def:180,step:1,min:0},
      {id:'mil',label:'Mileage (km/L)',type:'number',def:45,step:0.1,min:0.1},
      {id:'price',label:'Fuel Price (₹/L)',type:'number',def:96,step:0.1,min:0},
    ],
    calc:(v)=>{ const L = v.dist/v.mil; const cost=L*v.price;
      return { out:[
        {label:'Fuel Needed',value:L.toFixed(2)+' L'},
        {label:'Total Fuel Cost',value:inr(cost),big:true,money:true},
      ]};
    }},
  { cat:'daily', id:'daily-split', title:'Split Bill & Tip', desc:'Tip and per-person share.',
    inputs:[
      {id:'bill',label:'Bill Amount (₹)',type:'number',def:2400,step:1,min:0},
      {id:'tip',label:'Tip (%)',type:'number',def:10,step:1,min:0},
      {id:'people',label:'People',type:'number',def:4,step:1,min:1},
    ],
    calc:(v)=>{ const total=v.bill*(1+v.tip/100); const each=total/Math.max(1,v.people);
      return { out:[
        {label:'Total With Tip',value:inr(total),money:true},
        {label:'Per Person',value:inr(each),big:true,money:true},
      ]};
    }},

  /* ============================================================
     BUSINESS & SHOP
  ============================================================ */
  { cat:'business', id:'biz-pl', title:'Profit / Loss %', desc:'Profit or loss amount and %.',
    inputs:[
      {id:'cp',label:'Cost Price (₹)',type:'number',def:600,step:1,min:0},
      {id:'sp',label:'Selling Price (₹)',type:'number',def:750,step:1,min:0},
    ],
    calc:(v)=>{ const p=v.sp-v.cp; const pct = v.cp===0? 0 : p/v.cp*100;
      return { out:[
        {label:'Profit / Loss',value:inr(Math.abs(p))+(p>=0?' (Profit)':' (Loss)'),big:true,money:true},
        {label:'Profit / Loss %',value:pct.toFixed(2)+'%'},
      ]};
    }},
  { cat:'business', id:'biz-margin', title:'Gross Margin & Markup %', desc:'Margin on SP & markup on CP.',
    inputs:[
      {id:'cp',label:'Cost Price (₹)',type:'number',def:1000,step:1,min:0},
      {id:'sp',label:'Selling Price (₹)',type:'number',def:1400,step:1,min:0},
    ],
    calc:(v)=>{ const gm = v.sp===0? 0 : (v.sp-v.cp)/v.sp*100;
      const mk = v.cp===0? 0 : (v.sp-v.cp)/v.cp*100;
      return { out:[
        {label:'Gross Margin %',value:gm.toFixed(2)+'%',big:true},
        {label:'Markup %',value:mk.toFixed(2)+'%',big:true},
      ]};
    }},
  { cat:'business', id:'biz-bep', title:'Break-Even Point', desc:'BEP units & revenue.',
    inputs:[
      {id:'fc',label:'Fixed Costs (₹)',type:'number',def:50000,step:1000,min:0},
      {id:'price',label:'Price / Unit (₹)',type:'number',def:500,step:1,min:0},
      {id:'vc',label:'Variable Cost / Unit (₹)',type:'number',def:300,step:1,min:0},
    ],
    calc:(v)=>{ const cm=v.price-v.vc; const units = cm<=0? Infinity : v.fc/cm;
      const rev = units*v.price;
      return { out:[
        {label:'Break-Even Units',value: isFinite(units)? Math.ceil(units) : 'N/A',big:true},
        {label:'Break-Even Revenue',value: isFinite(rev)? inr(rev) : 'N/A',money:true},
      ]};
    }},
  { cat:'business', id:'biz-target', title:'Sales Target & Run-Rate', desc:'Remaining target & daily rate.',
    inputs:[
      {id:'goal',label:'Monthly Target (₹)',type:'number',def:300000,step:5000,min:0},
      {id:'ach',label:'Achieved So Far (₹)',type:'number',def:120000,step:5000,min:0},
      {id:'days',label:'Days Left',type:'number',def:12,step:1,min:1},
    ],
    calc:(v)=>{ const rem = Math.max(0,v.goal-v.ach); const rate = rem/Math.max(1,v.days);
      return { out:[
        {label:'Remaining Target',value:inr(rem),money:true},
        {label:'Required Daily Run-Rate',value:inr(rate)+' / day',big:true,money:true},
      ]};
    }},
  { cat:'business', id:'biz-comm', title:'Commission / Incentive', desc:'% commission + bonus.',
    inputs:[
      {id:'sales',label:'Sales Value (₹)',type:'number',def:250000,step:1000,min:0},
      {id:'pct',label:'Commission (%)',type:'number',def:5,step:0.1,min:0},
      {id:'bonus',label:'Bonus (₹)',type:'number',def:1500,step:100,min:0},
    ],
    calc:(v)=>{ const pay = v.sales*v.pct/100 + v.bonus;
      return { out:[
        {label:'Total Payout',value:inr(pay),big:true,money:true},
      ]};
    }},
  { cat:'business', id:'biz-inv', title:'Reorder Point & Turnover', desc:'ROP & inventory turnover.',
    inputs:[
      {id:'dem',label:'Daily Demand (units)',type:'number',def:25,step:1,min:0},
      {id:'lead',label:'Lead Time (days)',type:'number',def:6,step:1,min:0},
      {id:'safe',label:'Safety Stock (units)',type:'number',def:50,step:1,min:0},
      {id:'cogs',label:'COGS (₹)',type:'number',def:600000,step:1000,min:0},
    ],
    calc:(v)=>{ const rop = v.dem*v.lead + v.safe;
      const turn = v.cogs/100000;
      return { out:[
        {label:'Reorder Point (ROP)',value:Math.ceil(rop)+' units',big:true},
        {label:'Inventory Turnover',value:turn.toFixed(2)+'x'},
      ]};
    }},

  /* ============================================================
     HEALTH & FITNESS
  ============================================================ */
  { cat:'health', id:'hlth-bmi', title:'BMI Calculator', desc:'Body mass index & category.',
    inputs:[
      {id:'wt',label:'Weight (kg)',type:'number',def:70,step:0.1,min:1},
      {id:'ht',label:'Height (cm)',type:'number',def:172,step:0.1,min:30},
    ],
    calc:(v)=>{ const h=v.ht/100; const bmi=v.wt/(h*h);
      let cat='Normal';
      if(bmi<18.5) cat='Underweight'; else if(bmi<25) cat='Normal'; else if(bmi<30) cat='Overweight'; else cat='Obese';
      return { out:[
        {label:'BMI',value:bmi.toFixed(1),big:true},
        {label:'Category',value:cat},
      ]};
    }},
  { cat:'health', id:'hlth-cal', title:'BMR & Daily Calories', desc:'Basal metabolic rate (Mifflin).',
    inputs:[
      {id:'wt',label:'Weight (kg)',type:'number',def:70,step:0.1,min:1},
      {id:'ht',label:'Height (cm)',type:'number',def:172,step:0.1,min:30},
      {id:'age',label:'Age',type:'number',def:28,step:1,min:1},
      {id:'sex',label:'Sex',type:'select',def:'male',opts:[['male','Male'],['female','Female']]},
    ],
    calc:(v)=>{ const bmr = v.sex==='male' ? 10*v.wt+6.25*v.ht-5*v.age+5 : 10*v.wt+6.25*v.ht-5*v.age-161;
      return { out:[
        {label:'BMR (Sedentary)',value:Math.round(bmr)+' kcal/day',big:true},
        {label:'Lightly Active',value:Math.round(bmr*1.375)+' kcal'},
        {label:'Moderately Active',value:Math.round(bmr*1.55)+' kcal'},
        {label:'Very Active',value:Math.round(bmr*1.725)+' kcal'},
      ]};
    }},
  { cat:'health', id:'hlth-water', title:'Daily Water Intake', desc:'Water need by weight.',
    inputs:[
      {id:'wt',label:'Weight (kg)',type:'number',def:70,step:0.1,min:1},
      {id:'act',label:'Activity Level',type:'select',def:'light',opts:[
        ['light','Light'],
        ['moderate','Moderate'],
        ['heavy','Heavy'],
      ]},
    ],
    calc:(v)=>{ let base=v.wt*35;
      if(v.act==='moderate') base+=300;
      if(v.act==='heavy') base+=600;
      return { out:[
        {label:'Recommended Water',value:(base/1000).toFixed(2)+' L ('+Math.round(base)+' ml)',big:true},
      ]};
    }},
  { cat:'health', id:'hlth-bodyfat', title:'Body Fat % (U.S. Navy)', desc:'Navy method body fat.',
    inputs:[
      {id:'sex',label:'Sex',type:'select',def:'male',opts:[['male','Male'],['female','Female']]},
      {id:'wt',label:'Weight (kg)',type:'number',def:70,step:0.1,min:1},
      {id:'neck',label:'Neck (cm)',type:'number',def:38,step:0.1,min:1},
      {id:'waist',label:'Waist (cm)',type:'number',def:85,step:0.1,min:1},
      {id:'ht',label:'Height (cm)',type:'number',def:172,step:0.1,min:30},
    ],
    calc:(v)=>{ let bf;
      if(v.sex==='male'){ bf=495/(1.0324-0.19077*Math.log10(v.waist-v.neck)+0.15456*Math.log10(v.ht))-450; }
      else { bf=495/(1.29579-0.35004*Math.log10(v.waist+v.neck)+0.22100*Math.log10(v.ht))-450; }
      return { out:[
        {label:'Body Fat %',value:bf.toFixed(1)+'%',big:true},
      ]};
    }},

  /* ============================================================
     LOAN & EMI
  ============================================================ */
  { cat:'loan', id:'loan-emi', title:'Home Loan EMI', desc:'EMI for home loan amounts.',
    inputs:[
      {id:'p',label:'Loan Amount (₹)',type:'number',def:3000000,step:10000,min:0},
      {id:'r',label:'Interest Rate (%)',type:'number',def:8.5,step:0.1,min:0},
      {id:'n',label:'Tenure (Months)',type:'number',def:240,step:12,min:1},
    ],
    calc:(v)=>{ const P=Math.max(0,v.p), r=Math.max(0,v.r)/12/100, n=Math.max(1,Math.round(v.n));
      const emi=r===0? P/n : (P*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
      const tot=emi*n;
      return { out:[
        {label:'Monthly EMI',value:inr(emi),big:true,money:true},
        {label:'Total Interest',value:inr(tot-P),money:true},
        {label:'Total Payment',value:inr(tot),money:true},
      ]};
    }},
  { cat:'loan', id:'loan-eligibility', title:'Loan Eligibility', desc:'Based on income & obligations.',
    inputs:[
      {id:'inc',label:'Monthly Income (₹)',type:'number',def:60000,step:1000,min:0},
      {id:'ob',label:'Monthly Obligations (₹)',type:'number',def:5000,step:500,min:0},
      {id:'r',label:'Interest Rate (%)',type:'number',def:9,step:0.1,min:0},
      {id:'n',label:'Tenure (Months)',type:'number',def:240,step:12,min:1},
    ],
    calc:(v)=>{ const maxEmi = Math.max(0, v.inc*0.5 - v.ob);
      const r = v.r/12/100, n = Math.max(1,Math.round(v.n));
      const maxLoan = r===0? maxEmi*n : maxEmi*(Math.pow(1+r,n)-1)/(r*Math.pow(1+r,n));
      return { out:[
        {label:'Max Eligible Loan',value:inr(maxLoan),big:true,money:true},
        {label:'Max Monthly EMI',value:inr(maxEmi),money:true},
      ]};
    }},
  { cat:'loan', id:'loan-foir', title:'FOIR Calculator', desc:'Fixed obligation to income ratio.',
    inputs:[
      {id:'inc',label:'Monthly Income (₹)',type:'number',def:80000,step:1000,min:0},
      {id:'emi',label:'Total Monthly EMIs (₹)',type:'number',def:25000,step:500,min:0},
    ],
    calc:(v)=>{ const ratio = v.inc===0? 0 : v.emi/v.inc*100;
      let remark = ratio<30? 'Healthy' : ratio<50? 'Moderate' : 'Risky';
      return { out:[
        {label:'FOIR',value:ratio.toFixed(1)+'%',big:true},
        {label:'Remark',value:remark},
      ]};
    }},
  { cat:'loan', id:'loan-amort', title:'Amortization Summary', desc:'Yearly interest vs principal split.',
    inputs:[
      {id:'p',label:'Loan Amount (₹)',type:'number',def:500000,step:10000,min:0},
      {id:'r',label:'Rate (%)',type:'number',def:10,step:0.1,min:0},
      {id:'n',label:'Months',type:'number',def:60,step:1,min:1},
    ],
    calc:(v)=>{ const P=Math.max(0,v.p), r=Math.max(0,v.r)/12/100, n=Math.max(1,Math.round(v.n));
      const emi = r===0? P/n : (P*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
      let bal=P, pi=0, ii=0;
      for(let i=0;i<n;i++){ const interest=bal*r; const principal=emi-interest; bal-=principal; pi+=principal; ii+=interest; }
      return { out:[
        {label:'Total Principal',value:inr(pi),money:true},
        {label:'Total Interest',value:inr(ii),big:true,money:true},
        {label:'Total Payment',value:inr(emi*n),money:true},
      ]};
    }},

  /* ============================================================
     TAX & GST
  ============================================================ */
  { cat:'tax', id:'tax-gst', title:'GST Calculator', desc:'Add or remove GST.',
    inputs:[
      {id:'amt',label:'Amount (₹)',type:'number',def:1000,step:1,min:0},
      {id:'rate',label:'GST (%)',type:'select',def:'18',opts:[['5','5%'],['12','12%'],['18','18%'],['28','28%']]},
      {id:'mode',label:'Mode',type:'select',def:'add',opts:[['add','Add GST'],['remove','Remove GST']]},
    ],
    calc:(v)=>{ const amt=v.amt, rate=parseFloat(v.rate);
      let base,tax,gross;
      if(v.mode==='add'){ base=amt; tax=amt*rate/100; gross=base+tax; }
      else { gross=amt; base=gross/(1+rate/100); tax=gross-base; }
      return { out:[
        {label:'Base Price',value:inr(base),money:true},
        {label:'GST Amount',value:inr(tax),money:true},
        {label:'Total Price',value:inr(gross),big:true,money:true},
      ]};
    }},
  { cat:'tax', id:'tax-income', title:'Income Tax (India, New Regime)', desc:'Rough estimate, FY 2024-25.',
    inputs:[
      {id:'inc',label:'Annual Income (₹)',type:'number',def:800000,step:10000,min:0},
      {id:'ded',label:'Deductions (₹)',type:'number',def:0,step:1000,min:0},
    ],
    calc:(v)=>{ const taxable = Math.max(0, v.inc-v.ded);
      let tax=0;
      if(taxable<=300000) tax=0;
      else if(taxable<=600000) tax=(taxable-300000)*0.05;
      else if(taxable<=900000) tax=15000+(taxable-600000)*0.10;
      else if(taxable<=1200000) tax=45000+(taxable-900000)*0.15;
      else if(taxable<=1500000) tax=90000+(taxable-1200000)*0.20;
      else tax=150000+(taxable-1500000)*0.30;
      const cess = tax*0.04;
      const net = taxable>700000? tax+cess : 0;
      return { out:[
        {label:'Taxable Income',value:inr(taxable),money:true},
        {label:'Income Tax (incl. cess)',value:inr(net),big:true,money:true},
        {label:'Net Income',value:inr(v.inc-net),money:true},
      ]};
    }},
  { cat:'tax', id:'tax-hra', title:'HRA Exemption', desc:'HRA exemption calculation.',
    inputs:[
      {id:'basic',label:'Basic + DA (₹/yr)',type:'number',def:600000,step:10000,min:0},
      {id:'hra',label:'HRA Received (₹/yr)',type:'number',def:300000,step:10000,min:0},
      {id:'rent',label:'Rent Paid (₹/yr)',type:'number',def:240000,step:10000,min:0},
      {id:'metro',label:'Metro City?',type:'select',def:'yes',opts:[['yes','Yes'],['no','No']]},
    ],
    calc:(v)=>{ const basicPct = v.metro==='yes'? 0.5 : 0.4;
      const a = v.hra;
      const b = basicPct*v.basic;
      const c = Math.max(0, v.rent - 0.1*v.basic);
      const exempt = Math.max(0, Math.min(a,b,c));
      return { out:[
        {label:'HRA Exempted',value:inr(exempt),big:true,money:true},
        {label:'Taxable HRA',value:inr(Math.max(0,v.hra-exempt)),money:true},
      ]};
    }},
  { cat:'tax', id:'tax-tds', title:'TDS Estimator', desc:'Simple TDS on income.',
    inputs:[
      {id:'amt',label:'Income / Payment (₹)',type:'number',def:100000,step:1000,min:0},
      {id:'rate',label:'TDS Rate (%)',type:'number',def:10,step:0.1,min:0},
    ],
    calc:(v)=>{ const tds=v.amt*v.rate/100;
      return { out:[
        {label:'TDS',value:inr(tds),big:true,money:true},
        {label:'Net Amount',value:inr(v.amt-tds),money:true},
      ]};
    }},
];