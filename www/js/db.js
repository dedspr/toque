$(function () {

    $.localDB = {
        init: function (func, param) {
            this.initDatabase(func, param);
        },

        initDatabase: function (func, param) {
            try {
                if (!window.openDatabase) {
                    alert('Local Databases are not supported by your browser');
                } else {
                    var shortName = 'DB',
                        version = '1.0',
                        displayName = 'DB App',
                        maxSize = 100000; 

                    DB = openDatabase(shortName, version, displayName, maxSize);
                    this.createTables();

                    if (func == "selectCountAvaliacao")
                        this.selectCountAvaliacao(param);
                    else if (func == "selectAvaliacao")
                        this.selectAvaliacao();
                }
            } catch (e) {
                if (e === 2) {
                    // Version mismatch.
                    console.log("Invalid database version.");
                } else {
                    console.log("Unknown error " + e + ".");
                }
                return;
            }
        },

		/***
		**** CREATE TABLE ** 
		***/
        createTables: function () {
            var that = this;
            DB.transaction(
                function (transaction) {
                    transaction.executeSql('CREATE TABLE IF NOT EXISTS avaliacao (data, mao_esquerda, metodo_exercicios, foco_distracao, auto_confianca, tempo_dedicado, estudo, arco, repertorio);', [], that.nullDataHandler, that.errorHandler);
                }
            );
            
        },

		/***
		**** INSERT INTO TABLE ** 
		***/
        salvarAvaliacao: function () {
            DB.transaction(
                function (transaction) {

                    var model = {
                        mao_esquerda: $("#mao_esquerda").val(),
                        metodo_exercicios: $("#metodo_exercicios").val(),
                        foco_distracao: $("#foco_distracao").val(),
                        auto_confianca: $("#auto_confianca").val(),
                        tempo_dedicado: $("#tempo_dedicado").val(),
                        estudo: $("#estudo").val(),
                        arco: $("#arco").val(),
                        repertorio: $("#repertorio").val(),
                    };

                    transaction.executeSql("INSERT INTO avaliacao(data, mao_esquerda, metodo_exercicios, foco_distracao, auto_confianca, tempo_dedicado, estudo, arco, repertorio) "+
                                           "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                        [(new Date()), model.mao_esquerda, model.metodo_exercicios, model.foco_distracao, model.auto_confianca, model.tempo_dedicado, model.estudo, model.arco, model.repertorio]);

                    window.location.href = "mapa.html";
                }
            );
        },

        selectAvaliacao: function () {
            var that = this;
            
            DB.transaction(
                function (transaction) {
                    transaction.executeSql("SELECT * FROM avaliacao ORDER BY data DESC;", [], that.dataSelectAvaliacao, that.errorHandler);

                }
            );
        },

        dataSelectAvaliacao: function (transaction, results) {
            if (results.rows.length > 0) {

                // Handle the results
                var i = 0, row;
                
                window.chartColors = {
                    red: 'rgb(255, 99, 132)',
                    orange: 'rgb(255, 159, 64)',
                    yellow: 'rgb(255, 205, 86)',
                    green: 'rgb(75, 192, 192)',
                    blue: 'rgb(54, 162, 235)',
                    purple: 'rgb(153, 102, 255)',
                    grey: 'rgb(201, 203, 207)'
                };
                
                var color = Chart.helpers.color;

                for (i; i < results.rows.length; i++) {
                    row = results.rows.item(i);
                    var data = new Date(row['data']);
                    var config = {
                        type: 'radar',
                        data: {
                            labels: ["Mão esquerda", "Método/Exercícios", "Foco/Distração", "Auto Confianca", "Tempo Dedicado", "Estudo", "Arco", "Repertório"],
                            datasets: [{
                                label: pad(data.getDate().toString(), 2) + "/" + pad((data.getMonth() + 1), 2) + "/" + data.getFullYear(),
                                backgroundColor: color(window.chartColors.red).alpha(0.2).rgbString(),
                                borderColor: "#ff0000",
                                pointBackgroundColor: window.chartColors.red,
                                data: [
                                    parseInt(row['mao_esquerda']),
                                    parseInt(row['metodo_exercicios']),
                                    parseInt(row['foco_distracao']),
                                    parseInt(row['auto_confianca']),
                                    parseInt(row['tempo_dedicado']),
                                    parseInt(row['estudo']),
                                    parseInt(row['arco']),
                                    parseInt(row['repertorio'])
                                ]
                            }]
                        },
                        options: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: false,
                                text: 'Mapa'
                            },
                            scale: {
                                ticks: {
                                    beginAtZero: true
                                }
                            },
                        },

                        responsive: true,
                    };
                    
                    window.myRadar = new Chart(document.getElementById("canvas"), config);
                    $("#linkAvaliacao").hide();
                    
                    break;

                }
            }
            else {
                $("#canvas").hide();
                $("#linkAvaliacao").show();
            }
        },
        
        selectCountAvaliacao: function (page) {
            var that = this;
            DB.transaction(
                function (transaction) {
                    transaction.executeSql("SELECT mao_esquerda, metodo_exercicios, foco_distracao, auto_confianca, tempo_dedicado, estudo, arco, repertorio FROM avaliacao ORDER BY data DESC;", [], 
                                           that.dataSelectHomeAvaliacao, 
                                           that.errorHandler);

                }
            );
        },

        dataSelectHomeAvaliacao: function (transaction, results) {
            
            $("#linkAvaliacao").hide();
            $("#linkTreinoAvaliacao").hide();
            
            if (results.rows.length > 0) {
                row = results.rows.item(0);
                
                var min = Math.min.apply(null, Object.keys(row).map(function (x) { return row[x] }));
                menorAvaliacao = Object.keys(row).filter(function (x) { return row[x] == min; })[0];
                
                //, metodo_exercicios, foco_distracao, auto_confianca, tempo_dedicado, estudo, arco, repertorio
                switch (menorAvaliacao) {
                    case 'mao_esquerda':
                        menorAvaliacao = "Mão esquerda";
                        break;
                    case 'metodo_exercicios':
                        menorAvaliacao = "Métodos/Exercícios";
                        break;
                    case 'foco_distracao':
                        menorAvaliacao = "Foco/Distração";
                        break;
                    case 'auto_confianca':
                        menorAvaliacao = "Auto confiança";
                        break;
                    case 'tempo_dedicado':
                        damenorAvaliacaoy = "Tempo dedicado";
                        break;
                    case 'estudo':
                        menorAvaliacao = "Estudo";
                        break;
                    case 'arco':
                        menorAvaliacao = "Arco";
                        break;
                    case 'repertorio':
                        menorAvaliacao = "Repertório";
                }
                
                $("#linkTreinoAvaliacao").html("Sua nota em <b>"+menorAvaliacao+"</b> esta baixa<br>Clique aqui para treinar");
                $("#linkTreinoAvaliacao").show();
            }
            else {
                $("#linkAvaliacao").show();
            }
        },
        
        errorHandler: function (transaction, error) {

            if (error.code === 1) {
                // DB Table already exists
            } else {
                // Error is a human-readable string.
                console.log('Oops.  Error was ' + error.message + ' (Code ' + error.code + ')');
            }
            return false;
        },

        nullDataHandler: function () {
            //console.log("SQL Query Succeeded");
        },

    };

});	

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}