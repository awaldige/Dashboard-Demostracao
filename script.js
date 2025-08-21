// Dados base fictícios
const dataSets = {
  site: [120, 150, 180, 200, 220, 250],
  app: [80, 100, 140, 160, 180, 200],
  todos: [200, 250, 320, 360, 400, 450]
};

const receitaSets = {
  site: [12000, 13500, 14500],
  app: [8500, 9200, 9900],
  todos: [20500, 22700, 24400]
};

// Gráficos
const ctx1 = document.getElementById("chart1").getContext("2d");
let chart1 = new Chart(ctx1, {
  type: "line",
  data: {
    labels: ["Jan","Fev","Mar","Abr","Mai","Jun"],
    datasets: [{
      label: "Usuários Ativos",
      data: dataSets.todos,
      borderColor: "#4a90e2",
      backgroundColor: "rgba(74,144,226,0.2)",
      fill:true
    }]
  },
  options:{responsive:true}
});

const ctx2 = document.getElementById("chart2").getContext("2d");
let chart2 = new Chart(ctx2, {
  type:"bar",
  data:{
    labels:["Site","App","Loja"],
    datasets:[{
      label:"Receita (R$)",
      data:receitaSets.todos,
      backgroundColor:["#4a90e2","#50e3c2","#f5a623"]
    }]
  },
  options:{responsive:true}
});

// Atualizar dashboard
function updateDashboard() {
  const channel = document.getElementById("channelFilter").value;
  const period = parseInt(document.getElementById("periodFilter").value);

  let labels=[], dataset=[];

  if (period===7) {
    labels = ["Dia 1","Dia 2","Dia 3","Dia 4","Dia 5","Dia 6","Dia 7"];
    dataset = Array(7).fill().map(()=>Math.floor(Math.random()*200+100));
  } else if (period===30) {
    labels = Array.from({length:30},(_,i)=>`Dia ${i+1}`);
    dataset = Array(30).fill().map(()=>Math.floor(Math.random()*200+100));
  } else if (period===90) {
    labels = ["Jan","Fev","Mar"];
    dataset = dataSets[channel];
  } else if (period===180) {
    labels = ["Mar","Abr","Mai","Jun","Jul","Ago"];
    dataset = Array(6).fill().map(()=>Math.floor(Math.random()*300+150));
  } else if (period===365) {
    labels = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    dataset = Array(12).fill().map(()=>Math.floor(Math.random()*400+200));
  }

  chart1.data.labels = labels;
  chart1.data.datasets[0].data = dataset;
  chart1.update();

  let receita=receitaSets[channel];
  if (period===180) {
    receita = Array(6).fill().map(()=>Math.floor(Math.random()*20000+10000));
  } else if (period===365) {
    receita = Array(12).fill().map(()=>Math.floor(Math.random()*25000+15000));
  }
  chart2.data.labels = labels;
  chart2.data.datasets[0].data = receita;
  chart2.update();

  // Tabela filtrada
  const rows=document.querySelectorAll("#dataTable tbody tr");
  rows.forEach(row=>{
    const rowDate=new Date(row.cells[3].innerText);
    const rowChannel=row.cells[4].innerText;
    const now=new Date("2025-08-15"); // fixa data atual fictícia
    const diffDays=Math.floor((now-rowDate)/(1000*60*60*24));

    let matchPeriod=diffDays<=period;
    let matchChannel=(channel==="todos"||rowChannel===channel);
    row.style.display=(matchPeriod&&matchChannel)?"":"none";
  });

  // KPIs animados
  animateKPI("kpi1", dataset.reduce((a,b)=>a+b,0));
  animateKPI("kpi2", receita.reduce((a,b)=>a+b,0));
  animateKPI("kpi3", Math.floor(Math.random()*100+20));
}

// Animação dos KPIs
function animateKPI(id, value) {
  let el=document.getElementById(id);
  let start=0, end=value, duration=1000;
  let step=Math.ceil(end/60);
  let counter=setInterval(()=>{
    start+=step;
    if (start>=end) {start=end;clearInterval(counter);}
    el.textContent=start.toLocaleString("pt-BR");
  },16);
}

// Busca na tabela
document.getElementById("searchInput").addEventListener("keyup",function(){
  let filter=this.value.toLowerCase();
  document.querySelectorAll("#dataTable tbody tr").forEach(row=>{
    row.style.display=row.innerText.toLowerCase().includes(filter)?"":"none";
  });
});

// Ordenação por coluna
document.querySelectorAll("#dataTable th").forEach((th,i)=>{
  th.addEventListener("click",()=>{
    let tbody=document.querySelector("#dataTable tbody");
    [...tbody.rows].sort((a,b)=>{
      return a.cells[i].innerText.localeCompare(b.cells[i].innerText);
    }).forEach(tr=>tbody.appendChild(tr));
  });
});

// Tema claro/escuro
document.getElementById("themeToggle").addEventListener("click",()=>{
  document.body.classList.toggle("dark");
});

// Eventos
document.getElementById("channelFilter").addEventListener("change",updateDashboard);
document.getElementById("periodFilter").addEventListener("change",updateDashboard);

// Inicia dashboard
updateDashboard();
