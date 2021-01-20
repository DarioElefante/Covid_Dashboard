
    // JUST FOR BACKGROUND CHANGE
    const toggle = document.querySelector('#toggler');

    toggle.addEventListener("click", () => document.body.classList.toggle('on') , true);
    
    
    function toggler(){

    let toggler = document.querySelector('#toggler')
    let pieTrigger = document.querySelector('#pieTrigger')
    let body = document.querySelector('#body')
    let cards =[...document.getElementsByClassName('toggleCard')]
    
    
        if(toggler.checked == true){

            body.classList.add('bg-white','text-gray-800')
            body.classList.remove('bg_dark','text-white')
            pieTrigger.classList.add('btn-circle-light')
            pieTrigger.classList.remove('btn-circle')
            cards.forEach(el=>{
                el.classList.add('bg-main','card_custom_light')
                el.classList.remove('bg_gray','card_custom')
            })
           
            
        }else{
            body.classList.add('bg_dark','text-white')
            body.classList.remove('bg-white','text-gray-800')
            pieTrigger.classList.remove('btn-circle-light')
            pieTrigger.classList.add('btn-circle')
            cards.forEach(el=>{
                el.classList.remove('bg-main','card_custom_light')
                el.classList.add('bg_gray','card_custom')
            })
            
        }

    }
















fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json')
.then(response => response.json())
.then(dati => {
    
    //Ordino dati dal più recente al più vecchio
    let sorted = dati.reverse()
    //Ultima data caricata
    let lastUpdated = sorted[0].data
    //Formattazione per data ultimo update
    let lastUpdatedFormatted = lastUpdated.split("T")[0].split("-").reverse().join("/")
    document.querySelector('#data').innerHTML = lastUpdatedFormatted
    //Prendo i dati dal più recente al più vecchio, li filtro per data e li riordino dal maggiore al minore
    let lastUpdatedData = sorted.filter(el=>el.data == lastUpdated).sort((a,b) => b.nuovi_positivi - a.nuovi_positivi)
    //Creo un array dei casi totali per ogni regione e faccio la somma di ogni elemento nell'arrey per ottenere il totale dei casi in italia
    let totalCases = lastUpdatedData.map(el => el.totale_casi).reduce((t,n)=>t+n)
    document.querySelector('#totalCases').innerHTML=totalCases
    //Creo un array dei ricoveri per ogni regione e faccio la somma di ogni elemento nell'arrey per ottenere il totale dei ricoveri in italia
    let totalRecovered = lastUpdatedData.map(el => el.dimessi_guariti).reduce((t,n)=>t+n)
    document.querySelector('#totalRecovered').innerHTML=totalRecovered
    //Creo un array dei deceduti totali per ogni regione e faccio la somma di ogni elemento nell'arrey per ottenere il totale dei deceduti in italia
    let totalDeath = lastUpdatedData.map(el => el.deceduti).reduce((t,n)=>t+n)
    document.querySelector('#totalDeath').innerHTML=totalDeath
    //Creo un array dei positivi totali per ogni regione e faccio la somma di ogni elemento nell'arrey per ottenere il totale dei positivi in italia
    let totalPositive = lastUpdatedData.map(el => el.totale_positivi).reduce((t,n)=>t+n)
    document.querySelector('#totalPositive').innerHTML=totalPositive


   



    
    //Catturiamo gli id di riferimento nell'HTML
    let cardWrapper = document.querySelector('#cardWrapper')            
    let progressWrapper = document.querySelector('#progressWrapper')
    
    //Calcoliamo il valore massimo dei positivi in tutta italia catturando i dati più recenti ordinati in modo decrescente per numero di contagi
    let todayMax = Math.max(...lastUpdatedData.map(el=>el.nuovi_positivi))
    
    //Per ogni id catturato in HTML stampiamo una card HTML contenente i dati all'ultimo aggiornamento catturati di sopra e richiamati di sotto
    lastUpdatedData.forEach(el=>{
        
        let div = document.createElement('div')
        div.classList.add('col-span-1')
        div.innerHTML = 
        ` 
        <div class="card_custom bg_gray py-8 px-5 h-full toggleCard" data-region = "${el.denominazione_regione}">
            <p class="text-2xl">${el.denominazione_regione}</p>
            <p class="text-right text-4xl mb-0 text-main">${el.nuovi_positivi}</p>
        </div> `
        cardWrapper.appendChild(div) 
        
        let bar = document.createElement('div')
        bar.classList.add('mb-5')
        bar.innerHTML = 
        //Facciamo la stessa cosa delle card ma con le progressbar. Per stabilire il valore di avanzamento della barra sfruttiamo il numero dei nuovi poistivi per regione sul numero massimo dei positivi in italia nella giornata.
        ` 
        <p class="mb-2 text-xl">${el.denominazione_regione}: <span class="text-main">${el.nuovi_positivi}</span></p>
        <div class="relative w-full bg_gray rounded">
            <div class="absolute top-0 h-4 rounded shim-main" style="width:${100*el.nuovi_positivi/todayMax}%;"></div>
        </div>
        `
        progressWrapper.appendChild(bar)               
        
    })
    
    //Catturiamo l'HTML della modale sfruttando le classi inserite in HTML
    let modal = document.querySelector('.modal-custom')    //Attenzione, modal è il layer opaco che separa dal resto dell'html, solo modal content è il box
    let modalContent = document.querySelector('.modal-custom-content')
    
    //Sfruttiamo l'attributo custom data-region per triggherare evento al click. Aggiungiamo la classe active all'elemento con classe modal/modalContent catturato sopra
    document.querySelectorAll('[data-region').forEach(el=>{
        el.addEventListener('click',()=>{
            let region = el.dataset.region                  
            modal.classList.add('active')
            //Filtriamo i dati  nazionali rispetto alla denominazione_regione e catturiamo quello della singola regione in prima posizione.
            let dataAboutRegion = lastUpdatedData.filter(el=>el.denominazione_regione == region)[0]
            modalContent.innerHTML = 

            //stampiamo gli elementi che ci interessano in html
            `
                                  
                <div class="grid grid-cols-1 ">
                    <div class="mb-2">
                        <p class="text-4xl text-main">${dataAboutRegion.denominazione_regione}</p>
                    </div>
                    <div class="mb-5">
                        <p class="text-lg text-white">Totale casi: <span class="text-main"><span class="text-main">${dataAboutRegion.totale_casi}</span></p>
                        <p class="text-lg text-white">Nuovi positivi: <span class="text-main">${dataAboutRegion.nuovi_positivi}</span></p>
                        <p class="text-lg text-white">Deceduti: <span class="text-main">${dataAboutRegion.deceduti}</span></p>
                        <p class="text-lg text-white">Guariti: <span class="text-main">${dataAboutRegion.dimessi_guariti}</span></p>
                        <p class="text-lg text-white">Ricoverati con sintomi: <span class="text-main">${dataAboutRegion.ricoverati_con_sintomi}</span></p>
                    </div>
                </div>
                <div class="grid grid-cols-1">
                    <div class="">
                        <p class="mb-0 mt-5 text-main text-2xl">Trend nuovi casi</p>
                        <canvas id="trend" width="400" height="400"></canvas>

                        
                    </div>
                </div>
            
            
            `

            let trendData = sorted.map(el => el).reverse().filter(el => el.denominazione_regione == region).map(el =>[el.data,el.nuovi_positivi,el.deceduti,el.dimessi_guariti])

            let maxNew = Math.max(...trendData.map(el => el[1]))
            let maxDeath = Math.max(...trendData.map(el => el[2]))
            let maxRecovered = Math.max(...trendData.map(el => el[3]))

            let trend = document.getElementById('trend').getContext('2d');
            let chartNew = new Chart(trend, {
                // The type of chart we want to create
                type: 'line',
                
                // The data for our dataset
                data: {
                    labels: trendData.map(el=>el[0].split('T')[0].split('-').reverse().join('/')),
                    datasets: [{
                        label: 'Positivi',
                        backgroundColor: 'rgba(0, 0, 255, 0.2)',
                        borderColor: 'rgba(0, 0, 255, 0.4)',
                        data: trendData.map(el => el[1])
                    },
                    {
                        label: 'Morti',
                        backgroundColor: ' rgba(255, 0, 0, 0.2)',
                        borderColor: ' rgba(255, 0, 0, 0.4)',
                        data: trendData.map(el => el[2])
                    },
                    {
                        label: 'Guariti',
                        backgroundColor: 'rgba(0, 255, 0, 0.2)',
                        borderColor: 'rgba(0, 255, 0, 0.4)',
                        data: trendData.map(el => el[3]),
                    }
                    ]
                },

                
                // Configuration options go here
                options:  {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                       labels:{
                           fontColor:"white",
                       } 
                    },
                    scales: {
                        xAxes: [{
                          ticks: {
                             fontColor: "white",
                          },
                          gridLines:{
                            color: 'rgba(255, 255, 255, 0.2)',
                           },  
                       }],
                       yAxes: [{
                          ticks: {
                             fontColor: "white",
                             beginAtZero: true,
                             maxTicksLimit: 5,
                             stepSize: Math.ceil(250 / 5),
                          },
                          gridLines:{
                            color:'rgba(255, 255, 255, 0.2)',
                           }, 
                       }]
                    }
                 }
            });

            trendData.forEach(el=>{
                let colNew = document.createElement('div')
                colNew.classList.add('d-inline-block','pin-new')
                colNew.style.height =  `${70*el[1]/maxNew}%`
                trendNew.appendChild(colNew)

                let colDeath = document.createElement('div')
                colDeath.classList.add('d-inline-block','pin-death')
                colDeath.style.height =  `${70*el[2]/maxDeath}%`
                trendDeath.appendChild(colDeath)

                let colRecovered = document.createElement('div')
                colRecovered.classList.add('d-inline-block','pin-recovered')
                colRecovered.style.height =  `${70*el[3]/maxRecovered}%`
                trendRecovered.appendChild(colRecovered)
            })
            
        })
    })
   

    //esempio di come fare il grafico nelle singole regioni spiegato sull'esempio della lombardia

    // //Catturo l'id della col html creata per ospitare il grafico di crescita infetti
    // let trendNew = document.querySelector('#trendNew')
    // //Prendo i dati della lobardia come regione in testa per numero contagi, lì reverso dal più recente al più vecchio, filtro per nome regione(perchè ho preso in considerazione la lombardia) e mappo in un nuovo array gli elementi data e numero dei mositivi
    // let lombardia = sorted.reverse().filter(el => el.denominazione_regione == "Lombardia").map(el => [el.data, el.nuovi_positivi])
    // //Calcolo la somma dei contagi per ogni giorno calcolando il max sull'array costituito dall'elemento 1 di lombardia (nuovi_positivi) 
    // let maxLombardia = Math.max(...lombardia.map(el => el[1]))
    // //ciclo per ogni elemento dell'arrey lombardia così che mi restituisca il trendNew un elemento div con le caratteristiche specificate per ogni elemento di lombardia(per ogni valore di contagiati in ogni giornata)
    // lombardia.forEach(el=>{
    //     let col = document.createElement('div')
    //     col.classList.add('d-inline-block','bg-primary')
    //     col.style.width = "10px"
    //     col.style.marginRight = "1px" 
    // //per dare l'altezza alle colonne del mio grafico calcolo il rapporto tra il numero massimo di contagi in lombardia ed i contagi del giornociclato, moltiplico per 100 solo per rendere più visibile la colonna.
    //     col.style.height = `${100*el[1]/maxLombardia}%`
    //     trendNew.appendChild(col)
    // })

    //Costruiamo un arrey dei dati dal più vecchio     
    let days = Array.from(new Set(sorted.map(el => el.data))).reverse()
    
    //seleziono tutti gli html contrassegnati dall'attributo data-trend e per ognuno di questi elementi aggiungo un evento click. Quando l'evento sarà triggherato si aprirà la modale (il codice è già scritto sopra) con all'interno gli elementi riportati nella funzione
    document.querySelectorAll('[data-trend').forEach(el => {
        el.addEventListener('click',() => {

            //Catturiamo nella variabile set gli elementi riconosciuti come data-trend (dataset serve a prendere gli attributi di tipo data dall'HTML)
            let set = el.dataset.trend
            //Calcoliamo il totale del relativo data per ogni giorno dal più vecchio: prendendo la data dall'array days creo un nuovo array associativo che abbia come primo elemento la data e come secondo elemento un elemento di sorted(tutti i dati relativi alla giornata) inviduandolo a partire dalla data, poi filtrando per il dato specifico che voglio visualizzare (set)
            let totalsPerDays = days.map(el => [el, sorted.filter(i=>i.data == el).map(e => e[set]).reduce((t,n) => t+n)])
            //Calcolo il valore massimo nazionale del dato che mi sto passando come ho fatto altre volte
            let maxData = Math.max(...totalsPerDays.map(el=>el[1]))
            //creo l'elemento HTML
            modal.classList.add('active')
            modalContent.innerHTML = 
            `
            <div class="grid grid-rows-2">
                <p class="text-2xl text-main">${set.replace(/_/g," ").toUpperCase()}</p>
                <hr>
                <canvas id="totalTrend" width="400" height="400"></canvas>
                </div>
                 `
            let totalTrendData = document.querySelector('#totalTrend')
            // totalsPerDays.forEach(el => {

            //     let col = document.createElement('div')
            //     col.classList.add('d-inline-block','pin-new')
            //     col.style.height = `${70*el[1]/maxData}%`
            //     totalTrend.appendChild(col)
            // })
            let dataTrend = totalsPerDays.map(el => el[1]);
            let totalTrend = document.getElementById('totalTrend').getContext('2d');
            let chartTotal = new Chart(totalTrend, {
                // The type of chart we want to create
                type: 'line',
                
                // The data for our dataset
                data: {
                    labels: totalsPerDays.map(el=>el[0].split('T')[0].split('-').reverse().join('/')),
                    datasets: [{
                        label: set.replace(/_/g," ").toUpperCase(),
                        backgroundColor: '#c38fff41',
                        borderColor: '#c38fff',
                        data: dataTrend
                    },
                    ]
                },

                
                // Configuration options go here
                options:  {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                       labels:{
                           fontColor:"white",
                       } 
                    },
                    scales: {
                        xAxes: [{
                          ticks: {
                             fontColor: "white",
                          },
                          gridLines:{
                            color: 'rgba(255, 255, 255, 0.2)',
                           },  
                       }],
                       yAxes: [{
                          ticks: {
                             fontColor: "white",
                             beginAtZero: true,
                             maxTicksLimit: 5,
                             stepSize: Math.ceil(250 / 5),
                          },
                          gridLines:{
                            color:'rgba(255, 255, 255, 0.2)',
                           }, 
                       }]
                    }
                 }
            });
        })
    })

    //seleziono l'elemento con id pieTrigger in HTML e gli aggiungo un trigger al click per l'active della modale creata precedentemente
    let pieTrigger = document.querySelector('#pieTrigger')
    pieTrigger.addEventListener('click', () => {
        modal.classList.add('active')

    //creo un array vuoto e ciclo su tutti i numeri da 21 ad 1 dividendoli per 21 ed inserendoli nel valore apha del rgba (con to Fixed faccio in modo che il numero ottenuto dalla divisione non abbia più di 2 cifre dopo la virgola). Finita l'operazione aggiungo il valore rgba nell'array temp dove collezzionerò 21 differenti colori (le regioni italiane)    
        let temp = []
        for(let i = 21; i>=1; i--){
            let color =  `rgba(17,67,153,${(i/21).toFixed(2)})`
            temp.push(color)
        }

        //inserisco in max i dati aggiornati calcolati in scope globale, da questo mappo un nuovo array contenente solo i dati dei nuovi positivi in lastUpdatedData infine sommandoli tutti
        let max = lastUpdatedData.map(el => el.nuovi_positivi).reduce((t,n) => t + n)
        //inserisco in recap un array che associ i nomi delle regioni, al numero dei positivi ed al colore, poi ordino tutto con sort (ordine alfabetico o numerico)
        let recap = lastUpdatedData.map((el,i) => [el.denominazione_regione,el.nuovi_positivi, temp[i]] ).sort()
        //do' il valore di partenza del mio piechart
        let start = 0
        //Prendo il valore masssimo dei dati aggiornati riguardi i nuovi positivi e lo associo ai 360deg totali del pieChart 
        let cumulative = [0,...recap.map(el => start += +(360*el[1]/max).toFixed(3))]
        let spreader = cumulative
        //creo un sotto array di cumulative in cui vengono associati due valori successivi del pie chart (creo lo spicchio)
        .map(((el,i) => [cumulative[i],cumulative[i+1]]))
        //il map precedente mi restituisce un 21esimo elemento undefined che con splice viene eliminato
        .splice(0,cumulative.length-1)
        //associo lo spicchio creato ai valori di recap ovvero nome regioni, positivi, e colore. mi passo genericamente tutti i valori
        .map((el,i) => [...el, ...recap[i]])  
                     
        //mappo un sotto array fina di spreader in cui mi seleziono gli elementi di interesse (rgba, start spicchio, fine spicchio)
        let final = spreader.map(el => [`${el[4]} ${el[0]}deg ${el[1]}deg`, ...el])
        //Creo un sotto array di final con le informazioni riguardanti le regioni e trasformo queste info in una stringa inseribile come valore nel conic-gradient di sotto
        let valueToShow = final.map(el => el[0]).join(",")
        console.log(valueToShow)
        modalContent.innerHTML = 
        `
        
         <div class="">
             <h2 class="text-main text-4xl mb-2"> Grafico positivi nazionali </h2>
             <hr>
             <canvas id="pieChart" class="mt-5" width="400" height="400"></canvas>        
         </div>
      

        `
        
        let pieChart = document.getElementById('pieChart').getContext('2d');
        let pieLabel = lastUpdatedData.map(el=>el.denominazione_regione)
        let pieData = lastUpdatedData.map(el=>el.nuovi_positivi)
        let chartPie = new Chart(pieChart, {
            // The type of chart we want to create
            type: 'doughnut',
            
            // The data for our dataset
            data: {
                labels: pieLabel,
                datasets: [{
                    backgroundColor: ['#D7263D', '#F46036','#2E294E','#1B998B','#C5D86D','#DDE8B9','#E8D2AE','#D7B29D','#CB8589','#796465','#E9FAE3','#DEE8D5','#D5C7BC','#AC92A6','#77B6EA','#D90368','#37393A','#820263','#2E294E','#FFD400','#92140C',],
                    borderColor: 'black',
                    data: pieData
                },
                ]
            },
            // Configuration options go here
            options:  {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                   labels:{
                       fontColor:"white",
                   } 
                },
             }
        });
        

        // document.querySelector('pieChart').style.background = `conic-gradient(${valueToShow})`
        // let legend = document.querySelector('#legend')
        // final.forEach(el => {
        //     let voice = document.createElement('div')
        //     voice.classList.add('col-6','col-md-3','mb-3')
        //     voice.innerHTML = `<p class="small mb-0">${el[3]}: ${el[4]}</p>`
        //     voice.style.borderLeft = `4px solid ${el[5]}`
        //     legend.appendChild(voice)
        // })
    })

     //Ogni click al di fuori della modale la farà chiudere
     window.addEventListener('click',function(e){
        if(e.target == modal){
            modal.classList.remove('active')
        }
    })
    
})       



